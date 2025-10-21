import React from 'react';
import { cva, VariantProps as VariantProperties } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

export const badgeVariants = cva(
    ['rounded-full py-1 gap-2 inline-flex items-center justify-center transition-colors'],
    {
        variants: {
            variant: {
                success: ['text-opsis-content-positive'],
                danger: ['text-opsis-content-negative'],
                warning: ['text-opsis-content-warning'],
                info: ['text-opsis-content-informative'],
                muted: ['foreground--b'],
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
                className: 'background--b',
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
                className: 'border border--a',
            },
        ],
        defaultVariants: {
            type: 'filled',
            size: 'large',
        },
    },
);

type BadgeProperties = VariantProperties<typeof badgeVariants> & React.HTMLAttributes<HTMLDivElement>;
export const Badge = React.forwardRef<HTMLDivElement, BadgeProperties>(function Badge(
    { variant, size, type, className, children, ...divProperties },
    reference,
) {
    return (
        <div
            ref={reference}
            className={mergeClassNames(
                badgeVariants({
                    size: size,
                    variant: variant,
                    type: type,
                    className: className,
                }),
            )}
            {...divProperties}
        >
            {children}
        </div>
    );
});

Badge.displayName = 'Badge';
