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
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onChange' for select)
};
export function FieldInputSelect(properties: FieldInputSelectProperties) {
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

    // Defaults - selects typically commit onChange (immediate)
    const commitStrategy = properties.commit ?? 'onChange';

    // Function to handle selection change
    function handleChange(value: string | undefined) {
        // Commit immediately for onChange strategy
        if(commitStrategy === 'onChange') {
            fieldContext.handleChange(value ?? '');
        }
        else {
            // For onBlur strategy, just update value without triggering validation
            fieldContext.setValue(value ?? '', { dontValidate: true });
        }
    }

    // Function to handle blur events
    function handleBlur() {
        // Trigger validation on blur
        fieldContext.handleBlur();
    }

    // Render the component
    return (
        <InputSelect
            {...properties}
            ref={inputReference}
            id={properties.id ?? fieldId}
            name={properties.name ?? fieldContext.name}
            value={storeValue ?? ''}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}
