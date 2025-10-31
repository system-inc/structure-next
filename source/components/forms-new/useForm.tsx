'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Form
import {
    createFormHook,
    createFormHookContexts,
    type FormOptions,
    type AnyFieldApi,
    type FormValidateOrFn,
    type FormAsyncValidateOrFn,
} from '@tanstack/react-form';

// Dependencies - Form-Aware Components
import { FormIdProvider } from './providers/FormIdProvider';
import { FormSchemaProvider, useFormSchema } from './providers/FormSchemaProvider';
import { FormLabel } from './fields/FormLabel';
import { FormInputText } from './fields/text/FormInputText';
import { FormInputTextArea } from './fields/text/FormInputTextArea';
import { FormInputFile } from './fields/file/FormInputFile';

// Dependencies - Utilities
import type { ValidationResult } from '@structure/source/utilities/schema/Schema';
import type { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';
import type { BaseSchema } from '@structure/source/utilities/schema/schemas/BaseSchema';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { useLatestPropertyValue } from '@structure/source/utilities/react/React';

// Re-export TanStack Form types and hooks
export { useField, useStore, type FormApi, type FieldApi } from '@tanstack/react-form';
export type { FormState, FieldOptions, FieldState, ValidationError } from '@tanstack/react-form';
export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

// Interface - SuccessMeta
// Extends TanStack Form's field.meta to include success messages
interface SuccessMeta {
    successes?: ValidationResult[];
}

// Function to extract successes from field store
export function selectSuccesses(state: { meta: unknown }): ValidationResult[] {
    return (state.meta as SuccessMeta)?.successes ?? [];
}

// Function to update field meta with new success messages (immutable update)
export function setFieldSuccesses(field: AnyFieldApi, successes: ValidationResult[]) {
    field.setMeta(function (previousMeta) {
        return { ...previousMeta, successes } as typeof previousMeta;
    });
}

// Create our custom useForm hook with our contexts
const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {},
    formComponents: {},
});

/**
 * Hook - useForm
 * Our public hook that mirrors TanStack's useForm generics and options
 * and returns the standard TanStack form API, extended with:
 *   - form.Form: a typed HTML <form> wrapper that provides TanStack context
 *   - form.bindField(field): typed helper for controlled inputs { value, onChange, onBlur }
 *
 * TFormData is automatically inferred from the schema - no need to specify the type parameter.
 */
export function useForm<
    TSchema extends ObjectSchema<ObjectShape>,
    TFormData = TSchema extends ObjectSchema<infer S>
        ? { [K in keyof S]: S[K] extends BaseSchema<unknown, infer O> ? O : never }
        : never,
    TOnMount extends undefined | FormValidateOrFn<TFormData> = undefined,
    TOnChange extends undefined | FormValidateOrFn<TFormData> = undefined,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> = undefined,
    TOnBlur extends undefined | FormValidateOrFn<TFormData> = undefined,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> = undefined,
    TOnSubmit extends undefined | FormValidateOrFn<TFormData> = undefined,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> = undefined,
    TOnDynamic extends undefined | FormValidateOrFn<TFormData> = undefined,
    TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> = undefined,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData> = undefined,
    TSubmitMeta = unknown,
>(
    options: FormOptions<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
        TOnServer,
        TSubmitMeta
    > & {
        schema: TSchema; // Required and used for type inference!
    },
) {
    // Extract the schema from options
    const schema = options.schema;

    // Dev-only: Validate that number/boolean fields have defaults (required for controlled inputs)
    // React controlled inputs cannot switch between undefined and a value - they must
    // start with a value. Strings and arrays auto-default to '' and [], but numbers
    // and booleans need explicit defaults because 0/false are meaningful values that
    // differ semantically from "not set yet". This enforces the developer makes a
    // conscious choice about what "empty" means for these fields.
    if(process.env.NODE_ENV !== 'production') {
        for(const [fieldName, fieldSchema] of Object.entries(schema.shape)) {
            const typeName = fieldSchema.typeName;
            const hasDefault = fieldSchema.getDefault() !== undefined;
            const userProvidedDefault = options.defaultValues?.[fieldName as keyof TFormData] !== undefined;

            // Number and boolean fields MUST have a default (either in schema or user-provided)
            if((typeName === 'number' || typeName === 'boolean') && !hasDefault && !userProvidedDefault) {
                throw new Error(
                    `Form field "${fieldName}" is type "${typeName}" but has no default value. ` +
                        `Controlled inputs require a default. Add .default() to the schema field.\n` +
                        `Example: ${fieldName}: schema.${typeName}().default(${typeName === 'number' ? '0' : 'false'})`,
                );
            }
        }
    }

    // Freeze defaultValues once (stabilize identity to prevent TanStack Form reinitialization)
    const defaultValuesReference = React.useRef<TFormData | null>(null);
    if(!defaultValuesReference.current) {
        const schemaDefaults = schema.getDefaults();
        defaultValuesReference.current = { ...schemaDefaults, ...(options.defaultValues ?? {}) } as TFormData;
    }

    // Merge options with stable defaultValues
    // CRITICAL: Only defaultValues identity matters for preventing TanStack Form reinitialization
    const mergedOptions = React.useMemo(
        function () {
            return {
                ...options,
                defaultValues: defaultValuesReference.current!,
            };
        },
        [options],
    );

    // This is the fully-typed TanStack form instance with Field, Subscribe, AppForm, etc.
    const appForm = useAppForm(mergedOptions);
    type AppFormType = typeof appForm;

    const formReference = React.useRef<HTMLFormElement | null>(null);
    const requestAnimationFrameIdReference = React.useRef<number | null>(null);

    // Cleanup requestAnimationFrame on unmount
    React.useEffect(function () {
        return function () {
            if(requestAnimationFrameIdReference.current !== null) {
                cancelAnimationFrame(requestAnimationFrameIdReference.current);
            }
        };
    }, []);

    // Component - form.Form
    // HTML <form> wrapper bound to this form instance and context
    type FormProperties = React.FormHTMLAttributes<HTMLFormElement> & {
        children?: React.ReactNode;
    };
    const Form: React.FC<FormProperties> = React.useCallback(
        function ({ onSubmit, className, children, ...formProperties }: FormProperties) {
            async function handleSubmitWithFocus(event: React.FormEvent<HTMLFormElement>) {
                event.preventDefault();
                event.stopPropagation();

                // Run TanStack form submit; it will trigger validation
                await appForm.handleSubmit();

                // After state settles, if invalid, focus/scroll the first invalid control
                if(!appForm.store.state.isValid && formReference.current) {
                    // Wait a frame so DOM reflects the latest error state
                    requestAnimationFrameIdReference.current = requestAnimationFrame(function () {
                        const firstInvalid = formReference.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
                        if(firstInvalid) {
                            // Focus the invalid field
                            const element = firstInvalid as HTMLElement & { focus: () => void };
                            element.focus?.();
                            // Scroll into view smoothly
                            element.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                        requestAnimationFrameIdReference.current = null;
                    });
                }

                // Allow optional user onSubmit after our work
                onSubmit?.(event);
            }

            // Render the component
            return (
                <FormIdProvider>
                    <FormSchemaProvider schema={schema}>
                        <appForm.AppForm>
                            <form
                                {...formProperties}
                                ref={formReference}
                                className={mergeClassNames(className)}
                                onSubmit={handleSubmitWithFocus}
                            >
                                {children}
                            </form>
                        </appForm.AppForm>
                    </FormSchemaProvider>
                </FormIdProvider>
            );
        },
        [appForm, schema],
    );

    // Typed Field override that injects FieldIdProvider and supports both child modes
    type OriginalFieldProperties = Parameters<AppFormType['Field']>[0];

    // Capture the original TanStack Field once and never update it
    // CRITICAL: Do NOT let this reference get overwritten with our wrapper, or we get infinite recursion
    // This MUST be stable - if it changes, our Field wrapper will call itself (recursion)
    // Use a reference to capture exactly once
    const OriginalFieldReference = React.useRef(appForm.Field);
    const OriginalField = OriginalFieldReference.current;

    // Extend Field properties to support both 'identifier' (public API) and 'name' (TanStack internal)
    type FieldName = Extract<keyof TFormData, string>;
    type ExtendedFieldProperties = Omit<OriginalFieldProperties, 'children' | 'name'> & {
        identifier: FieldName; // REQUIRED - Public API must use identifier (type-safe field names)
        name?: FieldName; // Optional - TanStack internal usage only (type-safe)
        children?: React.ReactNode | OriginalFieldProperties['children'];
        validateSchema?: 'onChange' | 'onBlur' | 'Both' | 'None'; // When to run schema validation (default: 'onBlur')
    };

    // Component - form.Field
    const Field = React.useCallback(
        function FieldComponent({
            identifier,
            name,
            children,
            validateSchema,
            ...fieldProperties
        }: ExtendedFieldProperties) {
            // Support both 'identifier' (public API) and 'name' (TanStack internal calls)

            // Use identifier if provided (user-facing), otherwise use name (TanStack internal)
            const fieldIdentifier = identifier ?? name;

            // Get schema from context (must be called before any early returns)
            const formSchemaContext = useFormSchema();
            const schema = formSchemaContext.schema;

            // Get validation timing (default: 'onBlur')
            const validationTiming = validateSchema ?? 'onBlur';

            // Generate auto-validator if schema exists for this field
            // Memoize based on schema, fieldName, and validationTiming to avoid rebuilding on every render
            const validatorsFromSchema = React.useMemo(
                function () {
                    if(!schema || !fieldIdentifier || validationTiming === 'None') return undefined;

                    const fieldSchema = schema.shape[fieldIdentifier as string];
                    if(!fieldSchema) return undefined;

                    // Create the schema validation function
                    const schemaValidationFunction = async function (field: { value: unknown; fieldApi: AnyFieldApi }) {
                        const result = await fieldSchema.validate(field.value);

                        // Auto-populate successes
                        setFieldSuccesses(field.fieldApi, result.successes);

                        return result.valid ? undefined : result.errors?.[0];
                    };

                    // Return validators based on validateSchema prop
                    if(validationTiming === 'onChange') {
                        return {
                            onChangeAsync: schemaValidationFunction,
                        };
                    }
                    else if(validationTiming === 'onBlur') {
                        return {
                            onBlurAsync: schemaValidationFunction,
                        };
                    }
                    else if(validationTiming === 'Both') {
                        return {
                            onChangeAsync: schemaValidationFunction,
                            onBlurAsync: schemaValidationFunction,
                        };
                    }

                    return undefined;
                },
                [schema, fieldIdentifier, validationTiming],
            );

            // Merge auto-validators with user-provided validators
            // Memoize to avoid recreating validator objects on every render
            const mergedValidators = React.useMemo(
                function () {
                    if(!validatorsFromSchema) {
                        return fieldProperties.validators;
                    }

                    if(!fieldProperties.validators) {
                        return validatorsFromSchema;
                    }

                    // Merge: run schema validator first, then custom validator
                    const customValidatorOnChangeAsync = fieldProperties.validators.onChangeAsync;
                    const customValidatorOnBlurAsync = fieldProperties.validators.onBlurAsync;

                    return {
                        ...fieldProperties.validators,
                        // Merge schema onChange validator with custom onChange validator
                        onChangeAsync: async function (field: {
                            value: unknown;
                            fieldApi: AnyFieldApi;
                            signal: AbortSignal;
                        }) {
                            // Run schema validation first (if exists)
                            const schemaError = await validatorsFromSchema.onChangeAsync?.(field);
                            if(schemaError) return schemaError;

                            // Then run custom validation if provided (only if it's a function)
                            if(typeof customValidatorOnChangeAsync === 'function') {
                                return await customValidatorOnChangeAsync(field as never);
                            }
                        },
                        // Merge schema onBlur validator with custom blur validator
                        onBlurAsync: async function (field: {
                            value: unknown;
                            fieldApi: AnyFieldApi;
                            signal: AbortSignal;
                        }) {
                            // Run schema validation first (if exists)
                            const schemaError = await validatorsFromSchema.onBlurAsync?.(field);
                            if(schemaError) return schemaError;

                            // Then run custom validation if provided (only if it's a function)
                            if(typeof customValidatorOnBlurAsync === 'function') {
                                return await customValidatorOnBlurAsync(field as never);
                            }
                        },
                    };
                },
                [validatorsFromSchema, fieldProperties.validators],
            );

            // Stabilize the render-prop function so TanStack's OriginalField doesn't see it as "new content"
            // and remount the entire field subtree on every parent re-render.
            // We use useLatestPropertyValue to access the current children without adding it to dependencies.
            const childrenLatestPropertyValue = useLatestPropertyValue(children);

            // CRITICAL: renderFieldChildren MUST be stable (useCallback with empty dependencies)
            // If this function identity changes, TanStack Form sees it as "new content" and remounts the field subtree
            // Read from reference.current inside the function to avoid adding a reference to dependencies
            const renderFieldChildren = React.useCallback(
                function (field: AnyFieldApi) {
                    // Access latest children from reference (avoids dependency on recreated JSX objects)
                    const currentChildren = childrenLatestPropertyValue.current;

                    // Support both function children (render-property) and React node children (composition)
                    const content =
                        typeof currentChildren === 'function'
                            ? (currentChildren as (field: AnyFieldApi) => React.ReactNode)(field)
                            : currentChildren;

                    return <fieldContext.Provider value={field}>{content}</fieldContext.Provider>;
                },
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [], // Empty dependencies - read from ref.current inside function to keep identity stable
            );

            // Guard against missing field name (after all hooks)
            if(!fieldIdentifier) {
                console.error('Field component did not receive an identifier.');
                return null;
            }

            // OriginalField expects a render function that receives the field API
            // We pass a stable render-prop (renderFieldChildren) to prevent field subtree remounts
            return (
                <OriginalField {...fieldProperties} name={fieldIdentifier} validators={mergedValidators}>
                    {renderFieldChildren}
                </OriginalField>
            );
        },
        [OriginalField],
    );

    // Preserve the full TanStack API and add our extensions
    // CRITICAL: Do NOT mutate appForm - use Proxy to override specific properties
    // This preserves getters/accessors like .state while adding our extensions
    const extendedForm = React.useMemo(
        function () {
            const overrides = {
                Form,
                Field, // Our wrapped version (exposed on returned object, not on appForm)
                Label: FormLabel,
                InputText: FormInputText,
                InputTextArea: FormInputTextArea,
                InputFile: FormInputFile,
            } as Record<PropertyKey, unknown>;

            // Cache bound functions to prevent identity churn on every property access
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            const functionCache = new Map<PropertyKey, Function>();

            // Create Proxy that intercepts property access
            const proxy = new Proxy(appForm, {
                get(target, property, receiver) {
                    // If we have an override for this property, return it
                    if(property in overrides) {
                        return overrides[property];
                    }
                    // Otherwise, fall through to the original appForm (preserves getters like .state)
                    const value = Reflect.get(target, property, receiver);

                    // For functions, return cached bound version to preserve identity
                    if(typeof value === 'function') {
                        if(!functionCache.has(property)) {
                            functionCache.set(property, value.bind(target));
                        }
                        return functionCache.get(property);
                    }

                    return value;
                },
            });

            // Type assertion to tell TypeScript about our extensions
            return proxy as typeof appForm & {
                Form: typeof Form;
                Field: typeof Field;
                Label: typeof FormLabel;
                InputText: typeof FormInputText;
                InputTextArea: typeof FormInputTextArea;
                InputFile: typeof FormInputFile;
            };
        },
        [appForm, Form, Field],
    );

    return extendedForm;
}

/**
 * Example: Using setFieldSuccesses in validators
 *
 * import { setFieldSuccesses } from '@structure/source/components/forms-new/useForm'
 * import { schema } from '@structure/source/utilities/schema/Schema'
 *
 * const emailSchema = schema.string().emailAddress().minimumLength(5)
 *
 * <form.Field
 *     name="email"
 *     validators={{
 *         onChangeAsync: async function(props) {
 *             const result = await emailSchema.validate(props.value)
 *
 *             // Write successes to field meta (reactive)
 *             setFieldSuccesses(props.fieldApi, result.successes)
 *
 *             // Return error message or undefined (standard TanStack pattern)
 *             return result.valid ? undefined : result.errors?.[0]?.message
 *         }
 *     }}
 * >
 *     <form.Label label="Email Address" showSuccessesWhen="BlurOrNonEmpty">
 *         <form.InputText />
 *     </form.Label>
 * </form.Field>
 */
