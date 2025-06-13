// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TextArea } from './TextArea';
import { textFieldVariants } from './TextField';
import { FormField } from './FormField';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { VariantProps as VariantProperties } from 'class-variance-authority';

// Component - TextAreaField
type TextAreaFieldProperties = VariantProperties<typeof textFieldVariants> &
    React.ComponentPropsWithoutRef<typeof TextArea> & {
        label: string;
        optional?: boolean;
        info?: string;
        caption?: string;
        error?: string;
        placeholder: string; // Enforce placeholder
    };
export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProperties>(function (
    { label, optional, info, caption, error, id, className, ...textAreaProperties }: TextAreaFieldProperties,
    reference,
) {
    const internalId = React.useId();

    // Render the component
    return (
        <FormField label={label} optional={optional} caption={caption} error={error}>
            <TextArea
                id={id ?? internalId}
                className={mergeClassNames(
                    textFieldVariants({
                        size: textAreaProperties.size,
                        className: className,
                    }),
                )}
                {...textAreaProperties}
                ref={reference}
            />

            {/* InfoIcon */}
            {info && <div className="pointer-events-none absolute right-0 top-2 flex items-start pr-3">{info}</div>}
        </FormField>
    );
});

// Set the display name for the component
TextAreaField.displayName = 'TextAreaField';

// Export
