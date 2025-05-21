// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TextArea } from './TextArea';
import { textFieldVariants } from './TextField';
import { FormField } from './FormField';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { VariantProps } from 'class-variance-authority';

// Component - TextAreaField
type TextAreaFieldProperties = VariantProps<typeof textFieldVariants> &
    React.ComponentPropsWithoutRef<typeof TextArea> & {
        label: string;
        optional?: boolean;
        info?: string;
        caption?: string;
        error?: string;
        placeholder: string; // Enforce placeholder
    };
const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProperties>(function (
    properties: TextAreaFieldProperties,
    reference,
) {
    const internalId = React.useId();

    // Get the properties to spread onto the TextArea element
    const textAreaProperties = { ...properties } as Partial<TextAreaFieldProperties>;
    delete textAreaProperties.label;
    delete textAreaProperties.optional;
    delete textAreaProperties.info;
    delete textAreaProperties.caption;
    delete textAreaProperties.error;
    delete textAreaProperties.id;
    delete textAreaProperties.className;

    // Render the component
    return (
        <FormField
            label={properties.label}
            optional={properties.optional}
            caption={properties.caption}
            error={properties.error}
        >
            <TextArea
                id={properties.id ?? internalId}
                className={mergeClassNames(
                    textFieldVariants({
                        size: properties.size,
                        className: properties.className,
                    }),
                )}
                {...textAreaProperties}
                ref={reference}
            />

            {/* InfoIcon */}
            {properties.info && (
                <div className="pointer-events-none absolute right-0 top-2 flex items-start pr-3">
                    {properties.info}
                </div>
            )}
        </FormField>
    );
});

// Set the display name for the component
TextAreaField.displayName = 'TextAreaField';

// Export
export { TextAreaField, type TextAreaFieldProperties as TextAreaFieldProps };
