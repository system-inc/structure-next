'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Form Context
import { useFieldContext, useStore } from '../../useForm';

// Dependencies - Pure Components
import { InputText } from './InputText';

// Dependencies - ID Utilities
import { useFieldId } from '../../providers/FormIdProvider';

// Component - FormInputText
export type FormInputTextProperties = Omit<React.ComponentProps<typeof InputText>, 'value' | 'onChange' | 'onBlur'>;

export function FormInputText(properties: FormInputTextProperties) {
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to value reactively
    const value = useStore(fieldContext.store, function (state) {
        return state.value as string;
    });

    // Subscribe to errors for aria-invalid
    const errors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    return (
        <InputText
            {...properties}
            id={properties.id ?? fieldId}
            name={properties.name ?? fieldContext.name}
            value={value}
            aria-invalid={errors && errors.length > 0 ? true : undefined}
            onChange={function (event: React.ChangeEvent<HTMLInputElement>) {
                fieldContext.handleChange(event.target.value);
            }}
            onBlur={function () {
                fieldContext.handleBlur();
            }}
        />
    );
}
