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
    { label, optional, info, icon, caption, error, id, className, size, ...inputProperties }: TextFieldProperties,
    reference,
) {
    const internalId = React.useId();

    // Render the component
    return (
        <FormField
            label={label}
            optional={optional}
            // info={info}
            caption={caption}
            error={error}
            htmlFor={id ?? internalId}
            className={mergeClassNames(
                textFieldVariants({
                    className: className,
                    size: size,
                }),
            )}
            // size={size}
        >
            {/* Input */}
            {!icon ? (
                <Input
                    ref={reference}
                    id={id ?? internalId}
                    className={mergeClassNames(
                        textFieldVariants({
                            className: className,
                            size: size,
                        }),
                    )}
                    {...inputProperties}
                />
            ) : (
                <TextInputWithIcon
                    ref={reference}
                    icon={icon}
                    id={id ?? internalId}
                    className={mergeClassNames(
                        textFieldVariants({
                            className: className,
                            size: size,
                        }),
                    )}
                    size={size}
                    {...inputProperties}
                />
            )}

            {/* InfoIcon */}
            {info && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">{info}</div>
            )}
        </FormField>
    );
});

// Set the display name for the component
TextField.displayName = 'TextField';

// Export
export { TextField, type TextFieldProperties, textFieldVariants };
