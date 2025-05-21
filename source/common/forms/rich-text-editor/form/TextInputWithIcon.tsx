// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Input, InputProperties } from './Input';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { cva, VariantProps } from 'class-variance-authority';

const textInputWithIconVariants = cva(
    [''], // Defaults
    {
        variants: {
            size: {
                large: ['pl-[3.25rem]'],
            },
        },
        defaultVariants: {
            size: 'large',
        },
    },
);

// Component - TextInputWithIcon
type TextInputWithIconProperties = React.ComponentPropsWithoutRef<'input'> &
    Omit<VariantProps<typeof textInputWithIconVariants>, 'icon'> & {
        icon: React.ReactNode;
    } & InputProperties;
const TextInputWithIcon = React.forwardRef<HTMLInputElement, TextInputWithIconProperties>(
    function (properties, reference) {
        // Get the properties to spread onto the Input component
        const inputProps = { ...properties };
        delete inputProps.className;
        delete inputProps.icon;

        // Render the component
        return (
            <div className={mergeClassNames('relative w-full', properties.className)}>
                <Input
                    ref={reference}
                    className={mergeClassNames(textInputWithIconVariants({ size: properties.size }))}
                    {...inputProps}
                />
                <div className="text-opsis-content-tetriary pointer-events-none absolute inset-y-0 left-5 flex h-full w-5 items-center">
                    {properties.icon}
                </div>
            </div>
        );
    },
);

// Set the display name for debugging
TextInputWithIcon.displayName = 'TextInputWithIcon';

// Export
export { TextInputWithIcon, type TextInputWithIconProperties as TextInputWithIconProps };
