import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';

export const badgeVariants = cva(
    ['rounded-full py-1 gap-2 inline-flex items-center justify-center transition-colors'],
    {
        variants: {
            variant: {
                success: ['text-opsis-content-positive'],
                danger: ['text-opsis-content-negative'],
                warning: ['text-opsis-content-warning'],
                info: ['text-opsis-content-informative'],
                muted: ['text-opsis-content-secondary'],
            },
            type: {
                filled: '',
                outline: '',
            },
            size: {
                medium: ['text-xs font-medium px-2', '[&_svg]:size-3.5'],
                large: ['text-sm font-medium px-3', '[&_svg]:size-4'],
            },
        },
        compoundVariants: [
            {
                type: 'filled',
                variant: 'success',
                className: 'bg-opsis-background-subtle-positive',
            },
            {
                type: 'filled',
                variant: 'danger',
                className: 'bg-opsis-background-subtle-negative',
            },
            {
                type: 'filled',
                variant: 'warning',
                className: 'bg-opsis-background-subtle-warning',
            },
            {
                type: 'filled',
                variant: 'info',
                className: 'bg-opsis-background-subtle-informative',
            },
            {
                type: 'filled',
                variant: 'muted',
                className: 'bg-opsis-background-secondary',
            },
            {
                type: 'outline',
                variant: 'success',
                className: 'border border-opsis-border-subtle-positive',
            },
            {
                type: 'outline',
                variant: 'danger',
                className: 'border border-opsis-border-subtle-negative',
            },
            {
                type: 'outline',
                variant: 'warning',
                className: 'border border-opsis-border-subtle-warning',
            },
            {
                type: 'outline',
                variant: 'info',
                className: 'border border-opsis-border-subtle-informative',
            },
            {
                type: 'outline',
                variant: 'muted',
                className: 'border border-opsis-border-primary',
            },
        ],
        defaultVariants: {
            type: 'filled',
            size: 'large',
        },
    },
);

type BadgeProperties = VariantProps<typeof badgeVariants> & React.HTMLAttributes<HTMLDivElement>;
const Badge = React.forwardRef<HTMLDivElement, BadgeProperties>(function Badge(properties, reference) {
    // Create a clone of properties for remaining HTML attributes
    const divProperties = { ...properties };
    delete divProperties.variant;
    delete divProperties.size;
    delete divProperties.type;
    delete divProperties.className;
    delete divProperties.children;

    return (
        <div
            ref={reference}
            className={mergeClassNames(
                badgeVariants({
                    size: properties.size,
                    variant: properties.variant,
                    type: properties.type,
                    className: properties.className,
                }),
            )}
            {...divProperties}
        >
            {properties.children}
        </div>
    );
});
Badge.displayName = 'Badge';

export default Badge;
