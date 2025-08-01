'use client';

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps as VariantProperties } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';

export const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
                ghost: 'bg-transparent',
            },
            size: {
                default: 'h-9 px-2 min-w-9',
                sm: 'h-8 px-1.5 min-w-8',
                lg: 'h-10 px-2.5 min-w-10',
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
