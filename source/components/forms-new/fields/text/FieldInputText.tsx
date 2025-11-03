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
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onBlur')
};
export function FieldInputText(properties: FieldInputTextProperties) {
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

    // Defaults
    const commitStrategy = properties.commit ?? 'onBlur';

    // Check if this is a number input
    const isNumberInput = properties.type === 'number';

    // Function to handle input changes while typing
    function onInputIntercept(event: React.FormEvent<HTMLInputElement>) {
        // For number inputs, always commit on blur to avoid empty string vs 0 issues
        if(isNumberInput) {
            return;
        }

        // For text inputs, only update store if commit strategy is 'onChange'
        if(commitStrategy === 'onChange') {
            const inputValue = event.currentTarget.value;
            fieldContext.handleChange(inputValue);
        }

        // Call properties.onInput if it exists
        properties.onInput?.(event);
    }

    // Function to handle key down events
    async function onKeyDownIntercept(event: React.KeyboardEvent<HTMLInputElement>) {
        // If Enter key is pressed and commit strategy is 'onBlur', validate and navigate
        if(event.key === 'Enter' && commitStrategy === 'onBlur' && !isNumberInput) {
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

        // Call properties.onKeyDown if it exists
        properties.onKeyDown?.(event);
    }

    // Function to handle focus events
    function onFocusIntercept(event: React.FocusEvent<HTMLInputElement>) {
        // Call properties.onFocus if it exists
        properties.onFocus?.(event);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLInputElement>) {
        // Commit value to store without validation if commit strategy is 'onBlur'
        if(commitStrategy === 'onBlur' || isNumberInput) {
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

        // Call properties.onBlur if it exists
        properties.onBlur?.(event);
    }

    // Render the component
    return (
        <>
            <InputText
                {...properties}
                ref={inputReference}
                id={properties.id ?? fieldId}
                name={properties.name ?? fieldContext.name}
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
