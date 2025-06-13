// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Input, InputProperties } from './Input';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { cva, VariantProps as VariantProperties } from 'class-variance-authority';

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
    Omit<VariantProperties<typeof textInputWithIconVariants>, 'icon'> & {
        icon: React.ReactNode;
    } & InputProperties;
export const TextInputWithIcon = React.forwardRef<HTMLInputElement, TextInputWithIconProperties>(function (
    { className, icon, size, ...inputProperties },
    reference,
) {
    // Render the component
    return (
        <div className={mergeClassNames('relative w-full', className)}>
            <Input
                ref={reference}
                className={mergeClassNames(textInputWithIconVariants({ size: size }))}
                {...inputProperties}
            />
            <div className="pointer-events-none absolute inset-y-0 left-5 flex h-full w-5 items-center text-opsis-content-tetriary">
                {icon}
            </div>
        </div>
    );
});

// Set the display name for debugging
TextInputWithIcon.displayName = 'TextInputWithIcon';

// Export
