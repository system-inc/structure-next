import React from 'react';
import {
    mergeClassNames,
    createVariantClassNames,
    VariantProperties,
} from '@structure/source/utilities/style/ClassName';
import { Slot } from '@radix-ui/react-slot';

export const cardVariants = createVariantClassNames(
    // Base styles
    'flex flex-col items-start justify-start gap-6 rounded-2xl border border--0 background--2 p-8 shadow-lg transition-all',
    {
        variants: {
            interactive: {
                true: [
                    // Hover state
                    'hover:shadow',
                    // 'dark:hover:border-opsis-action-secondary-pressed',

                    // Active state
                    'active:shadow',
                    // 'active:border-opsis-action-secondary-pressed',
                    // 'dark:active:border-opsis-action-secondary-hover',
                ],
            },
        },
    },
);

type CardProperties = React.HTMLAttributes<HTMLDivElement> &
    VariantProperties<typeof cardVariants> & { asChild?: boolean };
export const Card = React.forwardRef<HTMLDivElement, CardProperties>(function (
    { className, children, asChild, interactive, ...divProperties },
    reference,
) {
    const Component = asChild ? Slot : 'div';

    return (
        <Component
            ref={reference}
            className={mergeClassNames(cardVariants({ className: className, interactive: interactive }))}
            {...divProperties}
        >
            {children}
        </Component>
    );
});
Card.displayName = 'Card';
