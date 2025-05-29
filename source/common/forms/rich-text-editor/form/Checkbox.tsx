'use client';

import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { cva, VariantProps as VariantProperties } from 'class-variance-authority';

const checkboxVariants = cva(
    [
        'peer relative shrink-0 border shadow-01 bg-opsis-background-tetriary transition-all',
        'hover:shadow-02 hover:border-opsis-action-secondary-hover',
        'active:border-opsis-action-secondary-active',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-opsis-action-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'rounded-extra-small',
    ],
    {
        variants: {
            size: {
                small: 'size-4',
                medium: 'size-5',
            },
        },
        defaultVariants: {
            size: 'small',
        },
    },
);

// Component - Checkbox
const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProperties<typeof checkboxVariants>
>(function ({ className, size, ...checkboxPrimitiveRootProperties }, reference) {
    return (
        <CheckboxPrimitive.Root
            ref={reference}
            className={mergeClassNames(checkboxVariants({ size: size }), className)}
            {...checkboxPrimitiveRootProperties}
        >
            <CheckboxPrimitive.Indicator className={mergeClassNames('flex items-center justify-center text-current')}>
                <CheckIcon className="h-full w-full" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
