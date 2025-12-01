'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputTextArea } from './InputTextArea';
import { FormUncontrolledInputSynchronizer } from '../FormUncontrolledInputSynchronizer';

// Component - FieldInputTextArea
export type FieldInputTextAreaProperties = Omit<
    React.ComponentProps<typeof InputTextArea>,
    'value' | 'defaultValue'
> & {
    commitOn?: 'Change' | 'Blur'; // When to update form store (default: 'Blur')
};
export function FieldInputTextArea({ commitOn = 'Blur', ...inputTextAreaProperties }: FieldInputTextAreaProperties) {
    // Hooks
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);
    // Subscribe to errors for aria-invalid
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // References
    const inputReference = React.useRef<HTMLTextAreaElement>(null);

    // State - Get initial value once for defaultValue (uncontrolled)
    const [defaultValue] = React.useState(function () {
        return fieldContext.state.value == null ? '' : String(fieldContext.state.value);
    });

    // Function to handle input changes while typing
    function onInputIntercept(event: React.FormEvent<HTMLTextAreaElement>) {
        // Only update store if commit strategy is 'Change'
        if(commitOn === 'Change') {
            const inputValue = event.currentTarget.value;
            fieldContext.handleChange(inputValue);
        }

        // Call inputProperties.onInput if it exists
        inputTextAreaProperties.onInput?.(event);
    }

    // Function to handle key down events
    function onKeyDownIntercept(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        // If Enter key is pressed with Ctrl/Cmd and commit strategy is 'Blur', commit value
        // Note: In textareas, Enter creates new lines, so we only commit on Ctrl+Enter or Cmd+Enter
        if(event.key === 'Enter' && (event.ctrlKey || event.metaKey) && commitOn === 'Blur') {
            const element = inputReference.current;
            if(element) {
                fieldContext.setValue(element.value, { dontValidate: true });
            }
        }

        // Call inputProperties.onKeyDown if it exists
        inputTextAreaProperties.onKeyDown?.(event);
    }

    // Function to handle focus events
    function onFocusIntercept(event: React.FocusEvent<HTMLTextAreaElement>) {
        // Call inputProperties.onFocus if it exists
        inputTextAreaProperties.onFocus?.(event);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLTextAreaElement>) {
        // Commit value to store without validation if commit strategy is 'Blur'
        if(commitOn === 'Blur') {
            const element = inputReference.current;
            if(element) {
                fieldContext.setValue(element.value, { dontValidate: true });
            }
        }

        // Trigger validation (only one validation cycle, no flash)
        fieldContext.handleBlur();

        // Call inputProperties.onBlur if it exists
        inputTextAreaProperties.onBlur?.(event);
    }

    // Render the component
    return (
        <>
            <InputTextArea
                {...inputTextAreaProperties}
                ref={inputReference}
                id={inputTextAreaProperties.id ?? fieldId}
                name={inputTextAreaProperties.name ?? fieldContext.name}
                defaultValue={defaultValue}
                aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
                onFocus={onFocusIntercept}
                onInput={onInputIntercept}
                onBlur={onBlurIntercept}
                onKeyDown={onKeyDownIntercept}
            />
            <FormUncontrolledInputSynchronizer inputReference={inputReference} fieldStore={fieldContext.store} />
        </>
    );
}
