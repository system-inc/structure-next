'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormContext } from './FormContext';

// Dependencies - Types
import type { FormContextInterface, FormFieldReferenceInterface, ValidationResult, InferFormValues } from './types';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Interface - Form
export interface FormInterface<T extends React.ReactNode> extends React.FormHTMLAttributes<HTMLFormElement> {
    onSubmit: (values: InferFormValues<T>) => Promise<FormSubmitResponse>;
    loading?: boolean;
    submitting?: boolean;
    error?: string;
    children: T;
}

// Component - Form
export function Form<T extends React.ReactNode>(properties: FormInterface<T>) {
    // References
    const fieldsMap = React.useRef(new Map<string, FormFieldReferenceInterface>());

    // State
    const [validatingFields, setValidatingFields] = React.useState<Record<string, boolean>>({});
    const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});

    // Add form reset functionality
    function resetForm() {
        for(const [id, field] of fieldsMap.current.entries()) {
            field.setValue(undefined);
        }
        setValidationResults({});
        setValidatingFields({});
    }

    // Form context implementation
    const formContext: FormContextInterface = React.useMemo(
        () => ({
            registerField(id: string, reference: FormFieldReferenceInterface) {
                fieldsMap.current.set(id, reference);
            },
            unregisterField(id: string) {
                fieldsMap.current.delete(id);
            },
            getFieldValue(id: string) {
                return fieldsMap.current.get(id)?.getValue();
            },
            setFieldValue(id: string, value: unknown) {
                fieldsMap.current.get(id)?.setValue(value);
            },
            async validateField(id: string) {
                setValidatingFields((prev) => ({ ...prev, [id]: true }));
                const result = await fieldsMap.current.get(id)?.validate();
                setValidatingFields((prev) => ({ ...prev, [id]: false }));
                if(result) {
                    setValidationResults((prev) => ({ ...prev, [id]: result }));
                }
                return result;
            },
            getFieldValidationResult(id: string) {
                return validationResults[id];
            },
            isFieldValidating(id: string) {
                return validatingFields[id] || false;
            },
            loading: properties.loading,
            error: properties.error,
            resetForm,
        }),
        [properties.loading, properties.error, validatingFields, validationResults],
    );

    // Function to handle form submission
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            // Validate all fields before submission
            const validationPromises = Array.from(fieldsMap.current.entries()).map(([id]) =>
                formContext.validateField(id),
            );
            const results = await Promise.all(validationPromises);

            // Check if any validations failed
            if(results.some((result) => result?.valid === false)) {
                // Focus first invalid field
                const firstInvalidField = Array.from(fieldsMap.current.entries()).find(
                    ([id]) => validationResults[id]?.valid === false,
                );
                if(firstInvalidField) {
                    firstInvalidField[1].focus();
                }
                return;
            }

            // Collect all values
            const values: Record<string, unknown> = {};
            for(const [id, field] of fieldsMap.current.entries()) {
                values[id] = field.getValue();
            }

            // Submit
            const response = await properties.onSubmit(values);

            if(response.success) {
                resetForm();
            }
            else if(response.errors) {
                setValidationResults((prev) => ({
                    ...prev,
                    ...response.errors,
                }));
            }
        }
        catch(error) {
            console.error('Form submission error:', error);
            // Handle error appropriately
        }
    }

    // Render the component
    return (
        <FormContext.Provider value={formContext}>
            <form
                {...properties}
                className={mergeClassNames('space-y-4', properties.className)}
                onSubmit={handleSubmit}
            >
                {properties.children}
            </form>
        </FormContext.Provider>
    );
}
