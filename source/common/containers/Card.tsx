import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { Slot } from '@radix-ui/react-slot';

const cardVariants = cva(
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

type CardProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants> & { asChild?: boolean };
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, asChild, interactive, ...props }, ref) => {
        const Component = asChild ? Slot : 'div';

        return (
            <Component ref={ref} className={mergeClassNames(cardVariants({ className, interactive }))} {...props}>
                {children}
            </Component>
        );
    },
);
Card.displayName = 'Card';

export { Card, cardVariants };
export default Card;
