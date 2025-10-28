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

// Component - FormInputText
export type FormInputTextProperties = Omit<
    React.ComponentProps<typeof InputText>,
    'value' | 'defaultValue' | 'onChange' | 'onInput' | 'onBlur' | 'onKeyDown'
> & {
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onBlur')
};
export function FormInputText(properties: FormInputTextProperties) {
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
    function handleInput(event: React.FormEvent<HTMLInputElement>) {
        // For number inputs, always commit on blur to avoid empty string vs 0 issues
        if(isNumberInput) {
            return;
        }

        // For text inputs, only update store if commit strategy is 'onChange'
        if(commitStrategy === 'onChange') {
            const inputValue = event.currentTarget.value;
            fieldContext.handleChange(inputValue);
        }
    }

    // Function to handle blur events
    function handleBlur() {
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
    }

    // Function to handle key down events
    async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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

                // Field is valid - find next focusable element or submit button
                const form = element.closest('form');
                if(form) {
                    // Get all focusable form elements (inputs, textareas, buttons)
                    const formElements = Array.from(
                        form.querySelectorAll<HTMLElement>(
                            'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), button[type="submit"]:not([disabled])',
                        ),
                    );
                    const currentIndex = formElements.indexOf(element);
                    const nextElement = formElements[currentIndex + 1];

                    // Focus the next element if it exists
                    if(nextElement) {
                        nextElement.focus();
                    }
                }
            }
        }
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
                onInput={handleInput}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
            <FormUncontrolledInputSynchronizer inputReference={inputReference} fieldStore={fieldContext.store} />
        </>
    );
}
