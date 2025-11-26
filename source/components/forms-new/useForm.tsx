'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Form
import {
    createFormHook,
    createFormHookContexts,
    useStore,
    type FormOptions,
    type AnyFieldApi,
    type FormValidateOrFn,
    type FormAsyncValidateOrFn,
} from '@tanstack/react-form';

// Dependencies - Form-Aware Components
import { FormIdProvider } from './providers/FormIdProvider';
import { FormSchemaProvider, useFormSchema } from './providers/FormSchemaProvider';
import { FieldLabel } from './fields/FieldLabel';
import { FieldMessage } from './fields/FieldMessage';

// Dependencies - Utilities
import type { ValidationResult } from '@structure/source/utilities/schema/Schema';
import type { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';
import type { BaseSchema } from '@structure/source/utilities/schema/schemas/BaseSchema';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
 * and returns the standard TanStack form API extended with additional components.
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
        for(const [fieldIdentifier, fieldSchema] of Object.entries(schema.shape)) {
            const typeName = fieldSchema.typeName;
            const hasDefault = fieldSchema.getDefault() !== undefined;
            const userProvidedDefault = options.defaultValues?.[fieldIdentifier as keyof TFormData] !== undefined;

            // Number and boolean fields MUST have a default (either in schema or user-provided)
            if((typeName === 'number' || typeName === 'boolean') && !hasDefault && !userProvidedDefault) {
                throw new Error(
                    `Form field "${fieldIdentifier}" is type "${typeName}" but has no default value. ` +
                        `Controlled inputs require a default. Add .default() to the schema field.\n` +
                        `Example: ${fieldIdentifier}: schema.${typeName}().default(${
                            typeName === 'number' ? '0' : 'false'
                        })`,
                );
            }
        }
    }

    // Merge schema defaults with user-provided defaults
    const schemaDefaults = schema.getDefaults();
    const mergedDefaultValues = { ...schemaDefaults, ...(options.defaultValues ?? {}) } as TFormData;
    const mergedOptions = {
        ...options,
        defaultValues: mergedDefaultValues,
    };

    // This is the fully-typed TanStack form instance with Field, Subscribe, AppForm, etc.
    const appForm = useAppForm(mergedOptions);
    type AppFormType = typeof appForm;

    // Track the last defaultValues we synced to, to avoid unnecessary resets
    // We serialize to JSON for deep comparison (handles objects, arrays, etc.)
    const lastSyncedDefaultsReference = React.useRef<string | null>(null);

    // Automatically synchronize defaultValues when they change (e.g., async data arrives)
    // This makes defaultValues "reactive" - when the property changes, we reset the form
    // so that TanStack Form's internal defaultValues (and thus isDefaultValue) stay in sync
    React.useEffect(
        function () {
            // Serialize current defaultValues for comparison
            const serialized = JSON.stringify(mergedDefaultValues);

            // Skip if defaultValues haven't actually changed
            if(serialized === lastSyncedDefaultsReference.current) {
                return;
            }

            // Reset form with new defaultValues
            // This updates both the form values AND TanStack's internal defaultValues,
            // ensuring isDefaultValue computes correctly
            appForm.reset(mergedDefaultValues);
            lastSyncedDefaultsReference.current = serialized;
        },
        // We intentionally use the serialized value as the dependency trigger
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(mergedDefaultValues)],
    );

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
    function Form({ onSubmit, className, children, ...formProperties }: FormProperties) {
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
    }

    // Typed Field override that injects FieldIdProvider and supports both child modes
    type OriginalFieldProperties = Parameters<AppFormType['Field']>[0];

    // Capture the original TanStack Field
    const OriginalField = appForm.Field;

    // Extend Field properties to support both 'identifier' (public API) and 'name' (TanStack internal)
    // Component - form.Field
    type FieldName = Extract<keyof TFormData, string>;
    type ExtendedFieldProperties = Omit<OriginalFieldProperties, 'children' | 'name'> & {
        identifier: FieldName; // REQUIRED - Public API must use identifier (type-safe field names)
        name?: FieldName; // Optional - TanStack internal usage only (type-safe)
        children?: React.ReactNode | OriginalFieldProperties['children'];
        validateSchema?: 'onChange' | 'onBlur' | 'Both' | 'None'; // When to run schema validation (default: 'onBlur')
        showMessage?: boolean; // Auto-render FieldMessage below children (default: true)
        messageProperties?: React.ComponentProps<typeof FieldMessage>; // Props to pass to auto-rendered FieldMessage
        className?: string; // CSS classes for the Field wrapper div
    };
    function Field({
        identifier,
        name,
        children,
        validateSchema,
        showMessage = true,
        messageProperties,
        className,
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
        let validatorsFromSchema;

        if(!schema || !fieldIdentifier || validationTiming === 'None') {
            validatorsFromSchema = undefined;
        }
        else {
            const fieldSchema = schema.shape[fieldIdentifier];

            if(!fieldSchema) {
                validatorsFromSchema = undefined;
            }
            else {
                // Create the schema validation function
                const schemaValidationFunction = async function (field: { value: unknown; fieldApi: AnyFieldApi }) {
                    const result = await fieldSchema.validate(field.value);

                    // Auto-populate successes
                    setFieldSuccesses(field.fieldApi, result.successes);

                    return result.valid ? undefined : result.errors?.[0];
                };

                // Return validators based on validateSchema prop
                if(validationTiming === 'onChange') {
                    validatorsFromSchema = {
                        onChangeAsync: schemaValidationFunction,
                    };
                }
                else if(validationTiming === 'onBlur') {
                    validatorsFromSchema = {
                        onBlurAsync: schemaValidationFunction,
                    };
                }
                else if(validationTiming === 'Both') {
                    validatorsFromSchema = {
                        onChangeAsync: schemaValidationFunction,
                        onBlurAsync: schemaValidationFunction,
                    };
                }
                else {
                    validatorsFromSchema = undefined;
                }
            }
        }

        // Merge auto-validators with user-provided validators
        let mergedValidators;

        if(!validatorsFromSchema) {
            mergedValidators = fieldProperties.validators;
        }
        else if(!fieldProperties.validators) {
            mergedValidators = validatorsFromSchema;
        }
        else {
            // Merge: run schema validator first, then custom validator
            const customValidatorOnChangeAsync = fieldProperties.validators.onChangeAsync;
            const customValidatorOnBlurAsync = fieldProperties.validators.onBlurAsync;

            mergedValidators = {
                ...fieldProperties.validators,
                // Merge schema onChange validator with custom onChange validator
                onChangeAsync: async function (field: { value: unknown; fieldApi: AnyFieldApi; signal: AbortSignal }) {
                    // Run schema validation first (if exists)
                    const schemaError = await validatorsFromSchema.onChangeAsync?.(field);
                    if(schemaError) return schemaError;

                    // Then run custom validation if provided (only if it's a function)
                    if(typeof customValidatorOnChangeAsync === 'function') {
                        return await customValidatorOnChangeAsync(field as never);
                    }
                },
                // Merge schema onBlur validator with custom blur validator
                onBlurAsync: async function (field: { value: unknown; fieldApi: AnyFieldApi; signal: AbortSignal }) {
                    // Run schema validation first (if exists)
                    const schemaError = await validatorsFromSchema.onBlurAsync?.(field);
                    if(schemaError) return schemaError;

                    // Then run custom validation if provided (only if it's a function)
                    if(typeof customValidatorOnBlurAsync === 'function') {
                        return await customValidatorOnBlurAsync(field as never);
                    }
                },
            };
        }

        // Render the field children
        // FieldInput components are protected by TanStack's field-level store subscriptions,
        // so they only re-render when their specific field state changes.
        function renderFieldChildren(field: AnyFieldApi) {
            // Support both function children (render-property) and React node children (composition)
            const content =
                typeof children === 'function'
                    ? (children as (field: AnyFieldApi) => React.ReactNode)(field)
                    : children;

            return (
                <fieldContext.Provider value={field}>
                    <div className={mergeClassNames('flex flex-col gap-2', className)}>
                        {content}
                        {showMessage && <FieldMessage {...messageProperties} />}
                    </div>
                </fieldContext.Provider>
            );
        }

        // Guard against missing field name (after all hooks)
        if(!fieldIdentifier) {
            console.error('Field component did not receive an identifier.');
            return null;
        }

        // OriginalField expects a render function that receives the field API
        return (
            <OriginalField {...fieldProperties} name={fieldIdentifier} validators={mergedValidators}>
                {renderFieldChildren}
            </OriginalField>
        );
    }

    // Preserve the full TanStack API and add our extensions
    // CRITICAL: Do NOT mutate appForm - use Proxy to override specific properties
    // This preserves getters/accessors like .state while adding our extensions
    // The useMemo keeps the functionCache Map alive across renders (critical for stable method identity)
    // If we do not useMemo here, everytime a component with a form inside renders it will wipe everything
    const extendedForm = React.useMemo(
        function () {
            const overrides = {
                Form,
                Field, // Our wrapped version (exposed on returned object, not on appForm)
                FieldLabel: FieldLabel,
                FieldMessage: FieldMessage,
                // Add useStore convenience wrapper - allows form.useStore(selector) instead of useStore(form.store, selector)
                useStore: function <TSelected>(selector: (state: typeof appForm.store.state) => TSelected): TSelected {
                    return useStore(appForm.store, selector);
                },
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
                FieldLabel: typeof FieldLabel;
                FieldMessage: typeof FieldMessage;
                useStore: <TSelected>(selector: (state: typeof appForm.store.state) => TSelected) => TSelected;
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appForm], // Only depend on appForm - Form/Field are defined in this hook and captured in closure
    );

    return extendedForm;
}
