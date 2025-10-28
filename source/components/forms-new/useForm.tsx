/* eslint-disable structure/react-export-rule */
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
export { useField, useStore, type FormApi, type FieldApi } from '@tanstack/react-form';
export type { FormState, FieldOptions, FieldState, ValidationError } from '@tanstack/react-form';

// Dependencies - ID Utilities
import { FormIdProvider } from './providers/FormIdProvider';

// Dependencies - Schema Provider
import { FormSchemaProvider, useFormSchema } from './providers/FormSchemaProvider';

// Dependencies - Form-Aware Components
import { FormLabel as FormAwareLabel } from './fields/FormLabel';
import { FormInputText } from './fields/text/FormInputText';
import { FormInputTextArea } from './fields/text/FormInputTextArea';
import { FormInputFile } from './fields/file/FormInputFile';

// Dependencies - Utilities
import type { ValidationResult } from '@structure/source/utilities/schema/Schema';
import type { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';
import type { BaseSchema } from '@structure/source/utilities/schema/schemas/BaseSchema';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

/**
 * Interface - SuccessMeta
 * Extends TanStack Form's field.meta to include success messages
 */
interface SuccessMeta {
    successes?: ValidationResult[];
}

/**
 * Function - selectSuccesses
 * Reactive selector to extract successes from field store
 */
export function selectSuccesses(state: { meta: unknown }): ValidationResult[] {
    return (state.meta as SuccessMeta)?.successes ?? [];
}

/**
 * Function - setFieldSuccesses
 * Updates field meta with new success messages (immutable update)
 */
export function setFieldSuccesses(field: AnyFieldApi, successes: ValidationResult[]): void {
    field.setMeta(function (previousMeta) {
        return { ...previousMeta, successes } as typeof previousMeta;
    });
}

/**
 * Create framework contexts once per bundle.
 * These are standard TanStack utilities intended for app-level composition.
 * Docs: https://tanstack.com/form/latest/docs/framework/react/guides/form-composition
 */
export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

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
    // Extract schema from options (now required)
    const schema = options.schema;

    // Merge schema defaults with user-provided defaultValues
    const mergedOptions = React.useMemo(
        function () {
            // Get defaults from schema
            const schemaDefaults = schema.getDefaults();

            // Validate that number/boolean fields have defaults (required for controlled inputs)
            // React controlled inputs cannot switch between undefined and a value - they must
            // start with a value. Strings and arrays auto-default to '' and [], but numbers
            // and booleans need explicit defaults because 0/false are meaningful values that
            // differ semantically from "not set yet". This enforces the developer makes a
            // conscious choice about what "empty" means for these fields.
            for(const [fieldName, fieldSchema] of Object.entries(schema.shape)) {
                const typeName = fieldSchema.typeName;
                const hasDefault = fieldSchema.getDefault() !== undefined;
                const userProvidedDefault = options.defaultValues?.[fieldName as keyof TFormData] !== undefined;

                // Number and boolean fields MUST have a default (either in schema or user-provided)
                if((typeName === 'number' || typeName === 'boolean') && !hasDefault && !userProvidedDefault) {
                    throw new Error(
                        `Form field "${fieldName}" is type "${typeName}" but has no default value. ` +
                            `Controlled inputs require a default. Add .default() to the schema field.\n` +
                            `Example: ${fieldName}: schema.${typeName}().default(${
                                typeName === 'number' ? '0' : 'false'
                            })`,
                    );
                }
            }

            // Merge: user defaults override schema defaults
            const mergedDefaultValues = {
                ...schemaDefaults,
                ...options.defaultValues,
            } as TFormData;

            return {
                ...options,
                defaultValues: mergedDefaultValues,
            };
        },
        [schema, options],
    );

    // This is the fully-typed TanStack form instance with Field, Subscribe, AppForm, etc.
    const appForm = useAppForm(mergedOptions);

    // 1) form.Form — HTML <form> wrapper bound to this form instance and context
    type FormProperties = React.FormHTMLAttributes<HTMLFormElement> & {
        children?: React.ReactNode;
    };

    const formReference = React.useRef<HTMLFormElement | null>(null);

    const Form: React.FC<FormProperties> = React.useCallback(
        function FormComponent({ onSubmit, className, children, ...formProperties }) {
            async function handleSubmitWithFocus(event: React.FormEvent<HTMLFormElement>) {
                event.preventDefault();
                event.stopPropagation();

                // Run TanStack form submit; it will trigger validation
                await appForm.handleSubmit();

                // After state settles, if invalid, focus/scroll the first invalid control
                const currentState = appForm.store.state;
                if(!currentState.isValid && formReference.current) {
                    // Wait a frame so DOM reflects the latest error state
                    requestAnimationFrame(function () {
                        const firstInvalid = formReference.current!.querySelector<HTMLElement>('[aria-invalid="true"]');
                        if(firstInvalid) {
                            // Focus the invalid field
                            const element = firstInvalid as HTMLElement & { focus: () => void };
                            element.focus?.();
                            // Scroll into view smoothly
                            element.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                    });
                }

                // Allow optional user onSubmit after our work
                onSubmit?.(event);
            }

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

    // 2) form.bindField(field) — typed binding for React controlled inputs
    // Handles React's synthetic events and extracts event.target.value
    function bindField<F extends AnyFieldApi>(field: F) {
        type V = F['state']['value'];
        return {
            value: field.state.value as V,
            onBlur: function () {
                field.handleBlur();
            },
            onChange: function (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
                field.handleChange(event.target.value as V);
            },
        };
    }

    // 3) form.Field — Typed Field override that injects FieldIdProvider and supports both child modes
    type AppFormType = typeof appForm;
    type OriginalFieldProperties = Parameters<AppFormType['Field']>[0];

    // Save reference to original Field before we override it
    const OriginalField = appForm.Field;

    // Extend Field properties to support both 'identifier' (public API) and 'name' (TanStack internal)
    type ExtendedFieldProperties = Omit<OriginalFieldProperties, 'children' | 'name'> & {
        identifier: OriginalFieldProperties['name']; // REQUIRED - Public API must use identifier
        name?: OriginalFieldProperties['name']; // Optional - TanStack internal usage only
        children?: React.ReactNode | OriginalFieldProperties['children'];
        validateSchema?: 'onChange' | 'onBlur' | 'Both' | 'None'; // When to run schema validation (default: 'onBlur')
    };

    function Field({ identifier, name, children, validateSchema, ...restFieldProperties }: ExtendedFieldProperties) {
        // Support both 'identifier' (public API) and 'name' (TanStack internal calls)

        // Use identifier if provided (user-facing), otherwise use name (TanStack internal)
        const fieldName = identifier ?? name;

        // Get schema from context (must be called before any early returns)
        const formSchemaContext = useFormSchema();
        const schema = formSchemaContext.schema;

        // Get validation timing (default: 'onBlur')
        const validationTiming = validateSchema ?? 'onBlur';

        // Generate auto-validator if schema exists for this field
        const validatorsFromSchema = React.useMemo(
            function () {
                if(!schema || !fieldName || validationTiming === 'None') return undefined;

                const fieldSchema = schema.shape[fieldName as string];
                if(!fieldSchema) return undefined;

                // Create the schema validation function
                const schemaValidationFunction = async function (field: { value: unknown; fieldApi: AnyFieldApi }) {
                    const result = await fieldSchema.validate(field.value);

                    // Auto-populate successes
                    setFieldSuccesses(field.fieldApi, result.successes);

                    return result.valid ? undefined : result.errors?.[0]?.message;
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
            [schema, fieldName, validationTiming],
        );

        // Merge auto-validators with user-provided validators
        const mergedValidators = React.useMemo(
            function () {
                if(!validatorsFromSchema) return restFieldProperties.validators;
                if(!restFieldProperties.validators) return validatorsFromSchema;

                // Merge: run schema validator first, then custom validator
                const customValidatorOnChangeAsync = restFieldProperties.validators.onChangeAsync;
                const customValidatorOnBlurAsync = restFieldProperties.validators.onBlurAsync;

                return {
                    ...restFieldProperties.validators,
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
            [validatorsFromSchema, restFieldProperties.validators],
        );

        // Guard against missing field name (after all hooks)
        if(!fieldName) {
            console.error('Field component received neither identifier nor name.');
            return null;
        }

        // OriginalField expects a render function that receives the field API
        // We need to provide fieldContext so useFieldContext() works in children
        return (
            <OriginalField {...restFieldProperties} name={fieldName} validators={mergedValidators}>
                {function (field: AnyFieldApi) {
                    // Provide field context so useFieldContext() works in wrappers
                    const content =
                        typeof children === 'function'
                            ? (children as (field: AnyFieldApi) => React.ReactNode)(field)
                            : children;

                    return <fieldContext.Provider value={field}>{content}</fieldContext.Provider>;
                }}
            </OriginalField>
        );
    }

    // Preserve the full TanStack API and add our extensions
    return Object.assign(appForm, {
        Form,
        Field, // Our wrapped version
        bindField,
        Label: FormAwareLabel,
        InputText: FormInputText,
        InputTextArea: FormInputTextArea,
        InputFile: FormInputFile,
    });
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
