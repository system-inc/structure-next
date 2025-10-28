'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputTextArea } from './InputTextArea';
import { FormUncontrolledInputSynchronizer } from '../FormUncontrolledInputSynchronizer';

// Component - FormInputTextArea
export type FormInputTextAreaProperties = Omit<
    React.ComponentProps<typeof InputTextArea>,
    'value' | 'defaultValue' | 'onChange' | 'onInput' | 'onBlur' | 'onKeyDown'
> & {
    commit?: 'onChange' | 'onBlur'; // When to update form store (default: 'onBlur')
};
export function FormInputTextArea(properties: FormInputTextAreaProperties) {
    // Hooks
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);
    // Subscribe to errors for aria-invalid
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // References
    const textareaReference = React.useRef<HTMLTextAreaElement>(null);

    // State - Get initial value once for defaultValue (uncontrolled)
    const [defaultValue] = React.useState(function () {
        return fieldContext.state.value == null ? '' : String(fieldContext.state.value);
    });

    // Defaults
    const commitStrategy = properties.commit ?? 'onBlur';

    // Function to handle input changes while typing
    function handleInput(event: React.FormEvent<HTMLTextAreaElement>) {
        // Only update store if commit strategy is 'onChange'
        if(commitStrategy === 'onChange') {
            const inputValue = event.currentTarget.value;
            fieldContext.handleChange(inputValue);
        }
    }

    // Function to handle blur events
    function handleBlur() {
        // Commit value to store before validation if commit strategy is 'onBlur'
        if(commitStrategy === 'onBlur') {
            const element = textareaReference.current;
            if(element) {
                fieldContext.handleChange(element.value);
            }
        }

        // Trigger validation
        fieldContext.handleBlur();
    }

    // Function to handle key down events
    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        // If Enter key is pressed with Ctrl/Cmd and commit strategy is 'onBlur', commit value
        // Note: In textareas, Enter creates new lines, so we only commit on Ctrl+Enter or Cmd+Enter
        if(event.key === 'Enter' && (event.ctrlKey || event.metaKey) && commitStrategy === 'onBlur') {
            const element = textareaReference.current;
            if(element) {
                fieldContext.handleChange(element.value);
            }
        }
    }

    // Render the component
    return (
        <>
            <InputTextArea
                {...properties}
                ref={textareaReference}
                id={properties.id ?? fieldId}
                name={properties.name ?? fieldContext.name}
                defaultValue={defaultValue}
                aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
                onInput={handleInput}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
            <FormUncontrolledInputSynchronizer inputReference={textareaReference} fieldStore={fieldContext.store} />
        </>
    );
}
