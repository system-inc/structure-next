'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputSelect } from './InputSelect';

// Component - FieldInputSelect
export type FieldInputSelectProperties = Omit<React.ComponentProps<typeof InputSelect>, 'value' | 'defaultValue'> & {
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onChange' for select)
};
export function FieldInputSelect(properties: FieldInputSelectProperties) {
    // Hooks
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);
    // Subscribe to value and errors
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // Defaults - selects typically commit onChange (immediate)
    const commitStrategy = properties.commit ?? 'onChange';

    // Function to handle change events
    function onChangeIntercept(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectValue = event.currentTarget.value;

        // Commit immediately for onChange strategy
        if(commitStrategy === 'onChange') {
            fieldContext.handleChange(selectValue);
        }
        else {
            // For onBlur strategy, just update value without triggering validation
            fieldContext.setValue(selectValue, { dontValidate: true });
        }

        // Call properties.onChange if it exists
        properties.onChange?.(event);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLSelectElement>) {
        // Trigger validation on blur
        fieldContext.handleBlur();

        // Call properties.onBlur if it exists
        properties.onBlur?.(event);
    }

    // Render the component
    return (
        <InputSelect
            {...properties}
            id={properties.id ?? fieldId}
            name={properties.name ?? fieldContext.name}
            value={storeValue ?? ''}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onChange={onChangeIntercept}
            onBlur={onBlurIntercept}
        />
    );
}
