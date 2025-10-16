'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Slot } from '@radix-ui/react-slot';
import { Tip } from '@structure/source/components/popovers/Tip';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';

// Dependencies - Theme
import { buttonTheme as structureButtonTheme } from '@structure/source/components/buttons/ButtonTheme';
import type { ButtonBaseVariant, ButtonBaseSize } from '@structure/source/components/buttons/ButtonTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Base Button Properties
export interface BaseButtonProperties {
    className?: string;
    variant?: ButtonBaseVariant;
    size?: ButtonBaseSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    isLoading?: boolean;
    tip?: string | React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'children' | 'content'>;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
    children?: React.ReactNode;
}

// Mutually exclusive icon variants
export type ButtonIconVariant =
    | { icon: React.ReactNode; iconLeft?: never; iconRight?: never; children?: never } // Icon-only (no text)
    | { iconLeft: React.ReactNode; icon?: never; iconRight?: never } // Left icon + text
    | { iconRight: React.ReactNode; icon?: never; iconLeft?: never } // Right icon + text
    | { icon?: never; iconLeft?: never; iconRight?: never }; // No icons

// Mutually exclusive link patterns
export type ButtonLinkVariant =
    | { asChild: true; href?: never; target?: never } // asChild only (no href or target)
    | { href: string; target?: string; asChild?: never } // Link with href and optional target
    | { asChild?: never; href?: never; target?: never }; // Regular button (no href or target)

// Helper type to distributively apply Omit to each union member
// This preserves discriminated union structure when creating wrapper components
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

// Helper for wrapper components that need to preserve discriminated union type safety
// Excludes link variants (asChild/href) and distributively omits specified keys
// This maintains mutual exclusivity of icon/children variants at the call site
export type ButtonWrapperProperties<OmitKeys extends keyof ButtonProperties> = DistributiveOmit<
    Extract<ButtonProperties, { asChild?: never; href?: never }>, // Filter out link variants
    OmitKeys // Omit the keys the wrapper controls
>;

// Component - Button
export type ButtonProperties = BaseButtonProperties &
    ButtonIconVariant &
    ButtonLinkVariant &
    Omit<
        React.HTMLAttributes<HTMLElement>,
        keyof BaseButtonProperties | keyof ButtonIconVariant | keyof ButtonLinkVariant
    >;
export const Button = React.forwardRef<HTMLElement, ButtonProperties>(function Button(
    {
        // Button-specific properties
        variant,
        size,
        icon,
        iconLeft,
        iconRight,
        isLoading,
        tip,
        tipProperties,
        asChild,

        // DOM properties we handle specially
        disabled, // Handled specially for Link (aria-disabled) and click prevention
        href, // Triggers Link rendering instead of button
        target, // Passed to Link when href is present
        type = 'button', // Only applies to <button>, not <Link> or Slot
        className, // Merged with variant classes
        children, // Wrapped with icons/spinner, passed to Slot/Link/button
        onClick, // Prevented when disabled, passed through otherwise

        // All other DOM properties spread to underlying element
        ...domProperties
    },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    // Layouts can opt into using the project's Button styles, otherwise will default to structure styles
    const buttonTheme = mergeComponentTheme(structureButtonTheme, componentTheme?.Button);

    // Create button variant class names function using the merged theme
    const buttonVariantClassNames = createVariantClassNames(buttonTheme.configuration.baseClasses, {
        variants: {
            variant: buttonTheme.variants,
            size: buttonTheme.sizes,
        },
        defaultVariants: buttonTheme.configuration.defaultVariant,
    });

    // Compute final className using the merged theme
    const computedClassName = buttonVariantClassNames({
        variant, // Primary, Secondary, Ghost, etc.
        size, // Small, Medium, Large, etc.
        class: mergeClassNames(
            icon && buttonTheme.configuration.iconOnlyClasses, // Square aspect ratio for icon-only
            buttonTheme.configuration.focusClasses, // Always applied
            disabled && buttonTheme.configuration.disabledClasses, // Conditional
            className, // User overrides (last = highest priority)
        ),
    });

    // Common properties for all variants
    const commonProperties = {
        ...domProperties,
        className: computedClassName,
        onClick: disabled ? (event: React.MouseEvent<HTMLElement>) => event.preventDefault() : onClick,
    };

    // Determine button content
    let content: React.ReactNode;

    // Icon-only button
    if(icon) {
        content = <span className="inline-flex">{icon}</span>;
    }
    // Icon + text button
    else if(iconLeft || iconRight || isLoading) {
        content = (
            <>
                {iconLeft && <span className="inline-flex">{iconLeft}</span>}
                {children}
                {isLoading && <SpinnerIcon className="h-4 w-4 animate-spin" />}
                {!isLoading && iconRight && <span className="inline-flex">{iconRight}</span>}
            </>
        );
    }
    // Text-only button
    else {
        content = children;
    }

    // Render different component based on properties
    let component: React.ReactNode;

    // If asChild, use Radix Slot for composition
    if(asChild) {
        component = (
            <Slot ref={reference as React.Ref<HTMLElement>} {...commonProperties}>
                {children}
            </Slot>
        );
    }
    // If href is set, render as Next.js Link
    else if(href) {
        component = (
            <Link
                ref={reference as React.Ref<HTMLAnchorElement>}
                href={href}
                target={target}
                aria-disabled={disabled ? 'true' : undefined}
                {...commonProperties}
            >
                {content}
            </Link>
        );
    }
    // Otherwise, render as a button
    else {
        component = (
            <button
                ref={reference as React.Ref<HTMLButtonElement>}
                type={type}
                disabled={disabled}
                {...commonProperties}
            >
                {content}
            </button>
        );
    }

    // Wrap with Tip if provided
    if(tip) {
        return (
            <Tip {...tipProperties} content={tip}>
                {component}
            </Tip>
        );
    }

    return component;
});

// Set display name for debugging
Button.displayName = 'Button';
