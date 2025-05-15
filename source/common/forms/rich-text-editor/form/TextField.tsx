import React from 'react';
import { Input } from './Input';
import { cva } from 'class-variance-authority';
import { TextInputWithIcon } from './TextInputWithIcon';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { FormField } from './FormField';

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

interface TextFieldProps extends React.ComponentPropsWithoutRef<typeof Input> {
    label: string;
    optional?: boolean;
    info?: string;
    icon?: React.ReactNode;
    caption?: string;
    error?: string;
    placeholder: string; // Enforce placeholder
}
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, optional, info, icon, caption, error, id, className, size, ...props }: TextFieldProps, ref) => {
        const internalId = React.useId();

        return (
            <FormField
                label={label}
                optional={optional}
                // info={info}
                caption={caption}
                error={error}
                htmlFor={id ?? internalId}
                className={mergeClassNames(textFieldVariants({ className, size }))}
                // size={size}
            >
                {/* Input */}
                {!icon ? (
                    <Input
                        ref={ref}
                        id={id ?? internalId}
                        className={mergeClassNames(textFieldVariants({ className, size }))}
                        size={size}
                        {...props}
                    />
                ) : (
                    <TextInputWithIcon
                        ref={ref}
                        icon={icon}
                        id={id ?? internalId}
                        className={mergeClassNames(textFieldVariants({ className, size }))}
                        size={size}
                        {...props}
                    />
                )}

                {/* InfoIcon */}
                {info && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">{info}</div>
                )}
            </FormField>
        );
    },
);
TextField.displayName = 'TextField';

export { TextField, type TextFieldProps, textFieldVariants };
