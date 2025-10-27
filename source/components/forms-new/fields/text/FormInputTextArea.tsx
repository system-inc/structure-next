'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Form Context
import { useFieldContext, useStore } from '../../useForm';

// Dependencies - Pure Components
import { InputTextArea } from './InputTextArea';

// Dependencies - ID Utilities
import { useFieldId } from '../../providers/FormIdProvider';

// Component - FormInputTextArea
export type FormInputTextAreaProperties = Omit<
    React.ComponentProps<typeof InputTextArea>,
    'value' | 'onChange' | 'onBlur'
>;

export function FormInputTextArea(properties: FormInputTextAreaProperties) {
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to value reactively
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value as string;
    });

    // Subscribe to errors for aria-invalid
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    return (
        <InputTextArea
            {...properties}
            id={properties.id ?? fieldId}
            name={properties.name ?? fieldContext.name}
            value={storeValue}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onChange={function (event: React.ChangeEvent<HTMLTextAreaElement>) {
                fieldContext.handleChange(event.target.value);
            }}
            onBlur={function () {
                fieldContext.handleBlur();
            }}
        />
    );
}
