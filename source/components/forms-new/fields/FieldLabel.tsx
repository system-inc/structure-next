'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext } from '../useForm';
import { useFieldId } from '../providers/FormIdProvider';
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
    children: React.ReactNode;
}
export function FieldLabel<T extends HTMLElement>(properties: FieldLabelProperties<T>) {
    // Hooks
    const formSchemaContext = useFormSchema();
    const fieldContext = useFieldContext();
    const fieldId = useFieldId(fieldContext.name);

    // Determine if field is optional
    const isOptionalFromSchema = formSchemaContext.schema?.shape[fieldContext.name]?.isOptional ?? false;
    const isOptional = properties.showOptional !== undefined ? properties.showOptional : isOptionalFromSchema;

    // Render the component
    return (
        <Label
            htmlFor={fieldId}
            className={mergeClassNames(
                'inline-flex items-center justify-start gap-1 text-sm font-medium',
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
