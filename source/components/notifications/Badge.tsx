import React from 'react';
import { cva, VariantProps as VariantProperties } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

export const badgeVariants = cva(
    ['inline-flex items-center justify-center gap-2 rounded-full py-1 transition-colors'],
    {
        variants: {
            variant: {
                success: ['content--positive'],
                danger: ['content--negative'],
                warning: ['content--warning'],
                info: ['content--informative'],
                muted: ['content--1'],
            },
            type: {
                filled: '',
                outline: '',
            },
            size: {
                medium: ['px-2 text-xs font-medium', '[&_svg]:size-3.5'],
                large: ['px-3 text-sm font-medium', '[&_svg]:size-4'],
            },
        },
        compoundVariants: [
            {
                type: 'filled',
                variant: 'success',
                className: 'background--positive',
            },
            {
                type: 'filled',
                variant: 'danger',
                className: 'background--negative',
            },
            {
                type: 'filled',
                variant: 'warning',
                className: 'background--warning',
            },
            {
                type: 'filled',
                variant: 'info',
                className: 'background--informative',
            },
            {
                type: 'filled',
                variant: 'muted',
                className: 'background--1',
            },
            {
                type: 'outline',
                variant: 'success',
                className: 'border border--positive',
            },
            {
                type: 'outline',
                variant: 'danger',
                className: 'border border--negative',
            },
            {
                type: 'outline',
                variant: 'warning',
                className: 'border border--warning',
            },
            {
                type: 'outline',
                variant: 'info',
                className: 'border border--informative',
            },
            {
                type: 'outline',
                variant: 'muted',
                className: 'border border--0',
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
