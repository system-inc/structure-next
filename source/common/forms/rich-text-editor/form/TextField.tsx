// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Input } from './Input';
import { TextInputWithIcon } from './TextInputWithIcon';
import { FormField } from './FormField';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { cva } from 'class-variance-authority';

const textFieldVariants = cva([], {
    variants: {
        size: {
            large: 'text-sm font-normal',
            'extra-large': 'text-base font-normal',
        },
    },
    defaultVariants: {
        size: 'large',
    },
});

// Component - TextField
interface TextFieldProperties extends React.ComponentPropsWithoutRef<typeof Input> {
    label: string;
    optional?: boolean;
    info?: string;
    icon?: React.ReactNode;
    caption?: string;
    error?: string;
    placeholder: string; // Enforce placeholder
}
const TextField = React.forwardRef<HTMLInputElement, TextFieldProperties>(function (
    properties: TextFieldProperties,
    reference,
) {
    const internalId = React.useId();

    // Clone the properties object and remove properties we handle separately
    // Get the properties to spread onto the Input element
    const inputProperties = { ...properties } as Partial<TextFieldProperties>;
    delete inputProperties.label;
    delete inputProperties.optional;
    delete inputProperties.info;
    delete inputProperties.icon;
    delete inputProperties.caption;
    delete inputProperties.error;
    delete inputProperties.id;
    delete inputProperties.className;

    // Render the component
    return (
        <FormField
            label={properties.label}
            optional={properties.optional}
            // info={properties.info}
            caption={properties.caption}
            error={properties.error}
            htmlFor={properties.id ?? internalId}
            className={mergeClassNames(
                textFieldVariants({
                    className: properties.className,
                    size: properties.size,
                }),
            )}
            // size={properties.size}
        >
            {/* Input */}
            {!properties.icon ? (
                <Input
                    ref={reference}
                    id={properties.id ?? internalId}
                    className={mergeClassNames(
                        textFieldVariants({
                            className: properties.className,
                            size: properties.size,
                        }),
                    )}
                    {...inputProperties}
                />
            ) : (
                <TextInputWithIcon
                    ref={reference}
                    icon={properties.icon}
                    id={properties.id ?? internalId}
                    className={mergeClassNames(
                        textFieldVariants({
                            className: properties.className,
                            size: properties.size,
                        }),
                    )}
                    size={properties.size}
                    {...inputProperties}
                />
            )}

            {/* InfoIcon */}
            {properties.info && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {properties.info}
                </div>
            )}
        </FormField>
    );
});

// Set the display name for the component
TextField.displayName = 'TextField';

// Export
export { TextField, type TextFieldProperties as TextFieldProps, textFieldVariants };
