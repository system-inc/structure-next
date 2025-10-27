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

// Dependencies - Form-Aware Components
import { FormLabel as FormAwareLabel } from './fields/FormLabel';
import { FormInputText } from './fields/text/FormInputText';
import { FormInputTextArea } from './fields/text/FormInputTextArea';
import { InputFile } from './fields/file/InputFile';
import { InputFileDrop } from './fields/file/InputFileDrop';
import { InputFileList } from './fields/file/InputFileList';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Schema Types
import type { SchemaSuccess } from '@structure/source/utilities/schema/Schema';

/**
 * Interface - SuccessMeta
 * Extends TanStack Form's field.meta to include success messages
 */
interface SuccessMeta {
    successes?: SchemaSuccess[];
}

/**
 * Function - selectSuccesses
 * Reactive selector to extract successes from field store
 */
export function selectSuccesses(state: { meta: unknown }): SchemaSuccess[] {
    return ((state.meta as SuccessMeta)?.successes) ?? [];
}

/**
 * Function - setFieldSuccesses
 * Updates field meta with new success messages (immutable update)
 */
export function setFieldSuccesses(field: AnyFieldApi, successes: SchemaSuccess[]): void {
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
 * We forward the entire generic surface to preserve inference for defaultValues,
 * validators, and submit meta.
 */
export function useForm<
    TFormData,
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
    >,
) {
    // This is the fully-typed TanStack form instance with Field, Subscribe, AppForm, etc.
    const appForm = useAppForm(options);

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
                </FormIdProvider>
            );
        },
        [appForm],
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

    // Extend Field properties to allow React.ReactNode as children (in addition to function)
    type ExtendedFieldProperties = Omit<OriginalFieldProperties, 'children'> & {
        children?: React.ReactNode | OriginalFieldProperties['children'];
    };

    function Field(fieldProperties: ExtendedFieldProperties) {
        return (
            <OriginalField {...fieldProperties}>
                {function (field: AnyFieldApi) {
                    // Provide field context so useFieldContext() works in wrappers
                    return (
                        <fieldContext.Provider value={field}>
                            {typeof fieldProperties.children === 'function'
                                ? (fieldProperties.children as (field: AnyFieldApi) => React.ReactNode)(field)
                                : fieldProperties.children}
                        </fieldContext.Provider>
                    );
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
        InputFile: InputFile,
        InputFileDrop: InputFileDrop,
        InputFileList: InputFileList,
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
