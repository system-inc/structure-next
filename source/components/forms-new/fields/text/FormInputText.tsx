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
    const fieldContext = useFieldContext<string | number>();
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to value reactively
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value as string | number;
    });

    // Subscribe to errors for aria-invalid
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    return (
        <InputText
            {...properties}
            id={properties.id ?? fieldId}
            name={properties.name ?? fieldContext.name}
            value={storeValue}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onChange={function (event: React.ChangeEvent<HTMLInputElement>) {
                // Convert to number if type="number"
                const inputValue = event.target.value;
                if(properties.type === 'number') {
                    // Empty string becomes NaN when converted, keep as empty string or convert to 0
                    const numberValue = inputValue === '' ? 0 : Number(inputValue);
                    fieldContext.handleChange(numberValue);
                }
                else {
                    fieldContext.handleChange(inputValue);
                }
            }}
            onBlur={function () {
                fieldContext.handleBlur();
            }}
        />
    );
}
