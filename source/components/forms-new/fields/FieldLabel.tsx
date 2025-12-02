'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext } from '../useForm';
import { useFieldId, useFieldLabelId } from '../providers/FormIdProvider';
import { useFormSchema } from '../providers/FormSchemaProvider';

// Dependencies - Main Components
import { Label } from '@radix-ui/react-label';
import { TipButton } from '@structure/source/components/buttons/TipButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - FieldLabel
export interface FieldLabelProperties<T extends HTMLElement> extends React.HTMLAttributes<T> {
    showOptional?: boolean; // Override schema detection - if undefined, auto-detect from schema
    tip?: React.ReactNode; // Optional tooltip content displayed next to the label
    // For non-native form elements (e.g., contenteditable), use aria-labelledby instead of htmlFor
    // When true, the label won't use htmlFor and will have an id for aria-labelledby reference
    useAriaLabelledBy?: boolean;
    children: React.ReactNode;
}
export function FieldLabel<T extends HTMLElement>(properties: FieldLabelProperties<T>) {
    // Hooks
    const formSchemaContext = useFormSchema();
    const fieldContext = useFieldContext();
    const fieldId = useFieldId(fieldContext.name);
    const fieldLabelId = useFieldLabelId(fieldContext.name);

    // Determine if field is optional
    const isOptionalFromSchema = formSchemaContext.schema?.shape[fieldContext.name]?.isOptional ?? false;
    const isOptional = properties.showOptional !== undefined ? properties.showOptional : isOptionalFromSchema;

    // Function to handle click when using aria-labelledby (mimics native label click-to-focus)
    function handleClick(event: React.MouseEvent<HTMLLabelElement>) {
        if(properties.useAriaLabelledBy) {
            // Only focus if clicking the label itself, not child buttons (like TipButton)
            const target = event.target as HTMLElement;
            if(target.closest('button')) {
                return;
            }

            // Prevent Radix Label from forwarding click to child interactive elements
            event.preventDefault();

            // Find and focus the associated element by id
            const element = document.getElementById(fieldId);
            if(element) {
                element.focus();
            }
        }
    }

    // Render the component
    return (
        <Label
            id={properties.useAriaLabelledBy ? fieldLabelId : undefined}
            htmlFor={properties.useAriaLabelledBy ? undefined : fieldId}
            onClick={properties.useAriaLabelledBy ? handleClick : undefined}
            className={mergeClassNames(
                'inline-flex items-center justify-start gap-1 text-sm font-medium',
                properties.useAriaLabelledBy && 'cursor-pointer',
                properties.className,
            )}
        >
            {properties.children}
            {isOptional && <span className="font-normal content--2">(Optional)</span>}
            {properties.tip && (
                <TipButton
                    className="-ml-0.5"
                    tip={properties.tip}
                    tipClassName="text-sm font-normal"
                    openOnPress={true}
                />
            )}
        </Label>
    );
}
