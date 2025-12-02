'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputSelect, InputSelectProperties, InputSelectReferenceInterface } from './InputSelect';

// Component - FieldInputSelect
export type FieldInputSelectProperties = Omit<
    InputSelectProperties,
    'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
    commitOn?: 'Change' | 'Blur'; // When to update form store (default: 'Change' for select)
};
export function FieldInputSelect({ commitOn = 'Change', ...inputSelectProperties }: FieldInputSelectProperties) {
    void commitOn; // Currently not used, but could be implemented for different behaviors

    // Hooks
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to value and errors from form store
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // References
    const inputReference = React.useRef<InputSelectReferenceInterface>(null);

    // Function to handle selection change
    function handleChange(value: string | undefined) {
        fieldContext.setValue(value ?? '');
        fieldContext.handleChange(value ?? '');

        // Handle blur as well to clear blur validation errors
        fieldContext.handleBlur();
    }

    // Function to handle blur events
    function handleBlur() {
        // Trigger validation on blur
        fieldContext.handleBlur();
    }

    // Render the component
    return (
        <InputSelect
            {...inputSelectProperties}
            ref={inputReference}
            id={inputSelectProperties.id ?? fieldId}
            name={inputSelectProperties.name ?? fieldContext.name}
            value={storeValue ?? ''}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}
