import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { Slot } from '@radix-ui/react-slot';

export const cardVariants = cva(
    [
        // Base styles
        'p-8 rounded-2xl border border-opsis-border-primary bg-opsis-background-tetriary flex flex-col items-start justify-start gap-6 transition-all shadow-02',
    ],
    {
        variants: {
            interactive: {
                true: [
                    // Hover state
                    'hover:shadow-03',
                    'dark:hover:border-opsis-action-secondary-pressed',

                    // Active state
                    'active:shadow-03',
                    'active:border-opsis-action-secondary-pressed',
                    'dark:active:border-opsis-action-secondary-hover',
                ],
            },
        },
    },
);

type CardProperties = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants> & { asChild?: boolean };
export const Card = React.forwardRef<HTMLDivElement, CardProperties>(function (properties, reference) {
    const Component = properties.asChild ? Slot : 'div';

    // Properties to spread onto the component
    const componentProperties = { ...properties };
    delete componentProperties.className;
    delete componentProperties.children;
    delete componentProperties.asChild;
    delete componentProperties.interactive;

    return (
        <Component
            ref={reference}
            className={mergeClassNames(
                cardVariants({ className: properties.className, interactive: properties.interactive }),
            )}
            {...componentProperties}
        >
            {properties.children}
        </Component>
    );
});
Card.displayName = 'Card';
