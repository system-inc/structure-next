'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useFieldContext } from '../../useForm';
import { useFieldId, useFieldLabelId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputMarkup, InputMarkupToolbarProperties } from './InputMarkup';
import { InputMarkupReferenceInterface } from './lexical/LexicalImperativeHandle';
import { LexicalFormSynchronizer } from './lexical/LexicalFormSynchronizer';

// Dependencies - Theme
import { InputMarkupVariant } from './InputMarkupTheme';

// Component - FieldInputMarkup
export interface FieldInputMarkupProperties {
    className?: string;
    variant?: InputMarkupVariant;
    placeholder?: string;
    disabled?: boolean;
    toolbar?: InputMarkupToolbarProperties;
    // Which format to store in the form (default: 'Markdown')
    outputFormat?: 'Markdown' | 'Html' | 'Json';
}
export function FieldInputMarkup(properties: FieldInputMarkupProperties) {
    // Hooks
    const fieldContext = useFieldContext<string>();
    const fieldId = useFieldId(fieldContext.name);
    const fieldLabelId = useFieldLabelId(fieldContext.name);

    // References
    const editorReference = React.useRef<InputMarkupReferenceInterface>(null);

    // State - Get initial value once for defaultValue (uncontrolled)
    const [defaultValue] = React.useState(function () {
        return fieldContext.state.value ?? '';
    });

    // Determine the output format
    const outputFormat = properties.outputFormat ?? 'Markdown';

    // Function to handle changes from InputMarkup
    function handleChange({ markdown, html, json }: { markdown: string; html: string; json: string }) {
        // Select the appropriate format based on outputFormat property
        let value: string;
        if(outputFormat === 'Html') {
            value = html;
        }
        else if(outputFormat === 'Json') {
            value = json;
        }
        else {
            value = markdown;
        }

        // Update the form field value
        fieldContext.handleChange(value);
    }

    // Render the component
    return (
        <>
            <InputMarkup
                ref={editorReference}
                id={fieldId}
                ariaLabelledBy={fieldLabelId}
                type={outputFormat}
                variant={properties.variant}
                className={properties.className}
                placeholder={properties.placeholder}
                defaultValue={defaultValue}
                disabled={properties.disabled}
                toolbar={properties.toolbar}
                onChange={handleChange}
            />
            <LexicalFormSynchronizer
                editorReference={editorReference}
                fieldStore={fieldContext.store}
                type={outputFormat}
            />
        </>
    );
}
