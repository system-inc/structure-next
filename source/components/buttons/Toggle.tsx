'use client';

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import {
    mergeClassNames,
    createVariantClassNames,
    VariantProperties,
} from '@structure/source/utilities/style/ClassName';

export const toggleVariants = createVariantClassNames(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:background--2 hover:content--1 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:background--3 data-[state=on]:content--0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'border--3 hover:background--3 hover:content--0 border bg-transparent shadow-sm',
                ghost: 'bg-transparent',
            },
            size: {
                default: 'h-9 min-w-9 px-2',
                sm: 'h-8 min-w-8 px-1.5',
                lg: 'h-10 min-w-10 px-2.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProperties<typeof toggleVariants>
>(function ({ variant, size, className, ...togglePrimitiveRootProperties }, reference) {
    return (
        <TogglePrimitive.Root
            ref={reference}
            className={mergeClassNames(
                toggleVariants({
                    variant: variant,
                    size: size,
                    className: className,
                }),
            )}
            {...togglePrimitiveRootProperties}
        />
    );
});

Toggle.displayName = TogglePrimitive.Root.displayName;
