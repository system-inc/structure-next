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
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onBlur')
};
export function FieldInputTextArea(properties: FieldInputTextAreaProperties) {
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

    // Defaults
    const commitStrategy = properties.commit ?? 'onBlur';

    // Function to handle input changes while typing
    function onInputIntercept(event: React.FormEvent<HTMLTextAreaElement>) {
        // Only update store if commit strategy is 'onChange'
        if(commitStrategy === 'onChange') {
            const inputValue = event.currentTarget.value;
            fieldContext.handleChange(inputValue);
        }

        // Call properties.onInput if it exists
        properties.onInput?.(event);
    }

    // Function to handle key down events
    function onKeyDownIntercept(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        // If Enter key is pressed with Ctrl/Cmd and commit strategy is 'onBlur', commit value
        // Note: In textareas, Enter creates new lines, so we only commit on Ctrl+Enter or Cmd+Enter
        if(event.key === 'Enter' && (event.ctrlKey || event.metaKey) && commitStrategy === 'onBlur') {
            const element = inputReference.current;
            if(element) {
                fieldContext.setValue(element.value, { dontValidate: true });
            }
        }

        // Call properties.onKeyDown if it exists
        properties.onKeyDown?.(event);
    }

    // Function to handle focus events
    function onFocusIntercept(event: React.FocusEvent<HTMLTextAreaElement>) {
        // Call properties.onFocus if it exists
        properties.onFocus?.(event);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLTextAreaElement>) {
        // Commit value to store without validation if commit strategy is 'onBlur'
        if(commitStrategy === 'onBlur') {
            const element = inputReference.current;
            if(element) {
                fieldContext.setValue(element.value, { dontValidate: true });
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
            <InputTextArea
                {...properties}
                ref={inputReference}
                id={properties.id ?? fieldId}
                name={properties.name ?? fieldContext.name}
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
