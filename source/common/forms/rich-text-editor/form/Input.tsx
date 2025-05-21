import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';

const inputVariants = cva(
    [
        // Base
        'bg-opsis-background-tetriary border border-opsis-border-primary placeholder:text-opsis-content-placeholder transition-colors w-full shadow-01',
        // Hover
        'hover:border-opsis-border-tetriary',
        // Active
        'active:border-action-secondary-pressed',
        // Focus
        'focus-visible:border-opsis-action-secondary-pressed focus-visible:outline-none',
        // Disabled
        'disabled:text-opsis-content-disabled disabled:pointer-events-none',
    ], // Defaults
    {
        variants: {
            size: {
                large: ['py-2.5'],
            },
            rounded: {
                true: ['rounded-full'],
                false: ['rounded-small'],
            },
        },
        defaultVariants: {
            size: 'large',
            rounded: false,
        },
        compoundVariants: [
            {
                size: 'large',
                rounded: true,
                className: 'px-5',
            },
            {
                size: 'large',
                rounded: false,
                className: 'px-3',
            },
        ],
    },
);

// Component - Input
type InputProperties = React.ComponentPropsWithoutRef<'input'> & VariantProps<typeof inputVariants>;
const Input = React.forwardRef<HTMLInputElement, InputProperties>(function (properties, reference) {
    // Get properties to spread onto the input element
    const inputProperties = { ...properties };
    delete inputProperties.className;
    delete inputProperties.size;
    delete inputProperties.rounded;

    // Render the component
    return (
        <input
            ref={reference}
            className={mergeClassNames(
                inputVariants({
                    className: properties.className,
                    size: properties.size,
                    rounded: properties.rounded,
                }),
            )}
            {...inputProperties}
        />
    );
});

// Set the display name for the component
Input.displayName = 'Input';

// Export
export { Input, type InputProperties, inputVariants };
