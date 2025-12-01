'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputText } from './InputText';
import { FormUncontrolledInputSynchronizer } from '../FormUncontrolledInputSynchronizer';

// Dependencies - Utilities
import { pause } from '@structure/source/utilities/type/Function';
import { focusNextFormElementByLabel } from '@structure/source/utilities/react/React';

// Component - FieldInputText
export type FieldInputTextProperties = Omit<React.ComponentProps<typeof InputText>, 'value' | 'defaultValue'> & {
    commitOn?: 'Change' | 'Blur'; // When to update form store (default: 'Blur')
};
export function FieldInputText({ commitOn = 'Blur', ...inputTextProperties }: FieldInputTextProperties) {
    // Hooks
    const fieldContext = useFieldContext<string | number>();
    const fieldId = useFieldId(fieldContext.name);
    // Subscribe to errors for aria-invalid
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // References
    const inputReference = React.useRef<HTMLInputElement>(null);

    // State - Get initial value once for defaultValue (uncontrolled)
    const [defaultValue] = React.useState(function () {
        return fieldContext.state.value == null ? '' : String(fieldContext.state.value);
    });

    // Check if this is a number input
    const isNumberInput = inputTextProperties.type === 'number';

    // Function to handle input changes while typing
    function onInputIntercept(event: React.FormEvent<HTMLInputElement>) {
        // Only update store if commit strategy is 'Change'
        if(commitOn === 'Change') {
            const rawValue = event.currentTarget.value;

            // For number inputs, convert to number (empty string becomes 0)
            if(isNumberInput) {
                const numberValue = rawValue === '' ? 0 : Number(rawValue);
                fieldContext.handleChange(numberValue);
            }
            else {
                fieldContext.handleChange(rawValue);
            }
        }

        // Call inputProperties.onInput if it exists
        inputTextProperties.onInput?.(event);
    }

    // Function to handle key down events
    async function onKeyDownIntercept(event: React.KeyboardEvent<HTMLInputElement>) {
        // If Enter key is pressed and commit strategy is 'Blur', validate and navigate
        if(event.key === 'Enter' && commitOn === 'Blur' && !isNumberInput) {
            event.preventDefault(); // Prevent default form submission
            const element = inputReference.current;
            if(element) {
                // Commit value and validate
                fieldContext.setValue(element.value, { dontValidate: true });
                await fieldContext.handleBlur(); // Wait for validation to complete

                // Wait a tick for the store to update with validation results
                await pause(0);

                // Check if field is valid (read fresh state from store)
                const currentState = fieldContext.store.state;
                const isFieldValid = !currentState.meta.errors || currentState.meta.errors.length === 0;

                if(!isFieldValid) {
                    // Field invalid - stay here, error is already shown
                    return;
                }

                // Field is valid - move to next field or submit form
                const hasNextField = focusNextFormElementByLabel(element);
                if(!hasNextField) {
                    // This is the last field - submit the form
                    element.form?.requestSubmit();
                }
            }
        }

        // Call inputProperties.onKeyDown if it exists
        inputTextProperties.onKeyDown?.(event);
    }

    // Function to handle focus events
    function onFocusIntercept(event: React.FocusEvent<HTMLInputElement>) {
        // Call inputProperties.onFocus if it exists
        inputTextProperties.onFocus?.(event);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLInputElement>) {
        // Commit value to store without validation if commit strategy is 'Blur'
        if(commitOn === 'Blur') {
            const element = inputReference.current;
            if(element) {
                // If number input, convert to a number
                if(isNumberInput) {
                    const rawValue = element.value;
                    const numberValue = rawValue === '' ? 0 : Number(rawValue);
                    fieldContext.setValue(numberValue, { dontValidate: true });
                }
                // Otherwise, just use the string value
                else {
                    fieldContext.setValue(element.value, { dontValidate: true });
                }
            }
        }

        // Trigger validation (only one validation cycle, no flash)
        fieldContext.handleBlur();

        // Call inputProperties.onBlur if it exists
        inputTextProperties.onBlur?.(event);
    }

    // Render the component
    return (
        <>
            <InputText
                {...inputTextProperties}
                ref={inputReference}
                id={inputTextProperties.id ?? fieldId}
                name={inputTextProperties.name ?? fieldContext.name}
                defaultValue={defaultValue}
                aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
                onInput={onInputIntercept}
                onKeyDown={onKeyDownIntercept}
                onFocus={onFocusIntercept}
                onBlur={onBlurIntercept}
            />
            <FormUncontrolledInputSynchronizer inputReference={inputReference} fieldStore={fieldContext.store} />
        </>
    );
}
