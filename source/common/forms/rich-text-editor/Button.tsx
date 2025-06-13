import React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps as VariantProperties } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';

const buttonVariants = cva(
    // DEFAULTS -- These are parts of the component that should not change based on different properties/variants
    [
        // Wrapper defaults
        'inline-flex items-center justify-center gap-2 rounded-full transition-colors',
        // Text defaults
        'whitespace-nowrap font-medium',
        // SVG defaults
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        // Focus defaults
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-blue focus:transition',
        // Disabled defaults
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-opsis-content-disabled',
    ],
    {
        variants: {
            variant: {
                primary: [
                    // Base colors
                    'bg-opsis-action-primary text-opsis-action-general-light',
                    // States
                    // Hover
                    'hover:bg-opsis-action-primary-hover',
                    // Pressed
                    'active:bg-opsis-action-primary-pressed',
                    // Disabled
                    'disabled:bg-opsis-action-general-disabled',
                    // Data state open from Radix components
                    'data-[state=open]:bg-opsis-action-primary-hover',
                    // Data state active
                    'data-[state=active]:bg-opsis-action-primary-hover',
                ],
                secondary: [
                    // Base colors
                    'bg-opsis-background-primary border border-opsis-border-primary text-opsis-action-primary',
                    // States
                    // Hover
                    'hover:border-opsis-action-secondary-hover',
                    // Pressed
                    'active:border-opsis-action-secondary-pressed',
                    // Disabled
                    'disabled:border-opsis-action-secondary-disabled disabled:text-opsis-content-disabled',
                    // Data state open from Radix components
                    'data-[state=open]:border-opsis-action-secondary-hover',
                    // Data state active
                    'data-[state=active]:border-opsis-action-secondary-hover',
                ],
                ghost: [
                    // Base colors
                    'text-opsis-action-general-dark',
                    // States
                    // Hover
                    'hover:bg-opsis-action-ghost-hover',
                    // Pressed
                    'active:bg-black/10',
                    // Disabled
                    'disabled:text-opsis-content-disabled disabled:hover:bg-transparent',
                    // If data state open from Radix components
                    'data-[state=open]:bg-opsis-action-ghost-hover',
                    // Data state active
                    'data-[state=active]:bg-opsis-action-ghost-hover',
                ],
            },
            size: {
                large: 'px-6 py-2.5 text-base',
                medium: 'py-2.5 px-5 text-sm',
                small: 'py-2 px-3 text-sm',
                'extra-small': 'py-1 px-2 text-sm',
                'extra-extra-small': 'py-1 px-3 text-sm',
            },
            // Supports boolean variants (e.g., <Button icon />) separate from the main variant because we want to be able to use both at the same time
            // This is useful for when we want to use the icon variant with a different variant (e.g., <Button icon variant="secondary" />)
            icon: {
                true: 'aspect-square',
                false: null,
            },
        },
        compoundVariants: [
            // Fixed size for icon buttons
            {
                icon: true, // On the condition that the icon prop is true
                size: 'large', // and the size prop is 'large'
                className: 'h-11 w-11', // apply a fixed height and width to the button (44px)
            },
            {
                icon: true,
                size: 'medium',
                className: 'h-10 w-10',
            },
            {
                icon: true,
                size: 'small',
                className: 'h-9 w-9',
            },
            {
                icon: true,
                size: 'extra-small',
                className: 'h-8 w-8',
            },
        ],
        defaultVariants: {
            variant: 'primary',
            size: 'medium',
            icon: false,
        },
    },
);

// Component - Button
export interface ButtonProperties
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProperties<typeof buttonVariants> {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProperties>(function (
    { className, variant, size, icon, asChild, children, iconLeft, iconRight, ...buttonProperties },
    reference,
) {
    const asChildValue = asChild !== undefined ? asChild : false;

    if((iconLeft || iconRight) && icon) {
        throw new Error(
            'Button: Cannot use both iconLeft/iconRight and icon props at the same time\n\nButton Content: ' + children,
        );
    }

    const Component = asChildValue ? Slot : 'button';

    return (
        <Component
            className={mergeClassNames(buttonVariants({ variant: variant, size: size, icon: icon }), className)}
            ref={reference}
            type="button" // Default to button type (avoids accidental form submissions)
            {...buttonProperties}
        >
            {iconLeft}
            <Slottable>{children}</Slottable>
            {iconRight}
        </Component>
    );
});
Button.displayName = 'Button';
