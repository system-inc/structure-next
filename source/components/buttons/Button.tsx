'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Slot } from '@radix-ui/react-slot';
import { Tip } from '@structure/source/components/popovers/Tip';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';

// Dependencies - Theme
import { buttonTheme as structureButtonTheme } from '@structure/source/components/buttons/ButtonTheme';
import type { ButtonVariant, ButtonSize } from '@structure/source/components/buttons/ButtonTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Base Button Properties
export interface BaseButtonProperties {
    className?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconSize?: ButtonSize; // Independent icon sizing (takes precedence over size-derived icon size)
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    isLoading?: boolean;
    tip?: React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'trigger' | 'content'>;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}

// Type - Icon can be either a component reference or pre-rendered JSX
export type ButtonIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Icon properties
// Icons can be either:
// - React.FunctionComponent: Auto-sized based on button size variant
// - React.ReactNode: Pre-rendered JSX with full control over styling
// Render order: iconLeft → icon → children → iconRight
export interface ButtonIconProperties {
    iconLeft?: ButtonIconType;
    icon?: ButtonIconType;
    iconRight?: ButtonIconType;
    children?: React.ReactNode;
}

// Mutually exclusive link patterns
export type ButtonLinkVariant =
    | { asChild: true; href?: never; target?: never } // asChild only (no href or target)
    | { href: string; target?: string; asChild?: never } // Link with href and optional target
    | { asChild?: never; href?: never; target?: never }; // Regular button (no href or target)

// Helper for wrapper components that are always buttons (never links or slots)
export type NonLinkButtonProperties = Omit<ButtonProperties, 'asChild' | 'href' | 'target'>;

// Component - Button
export type ButtonProperties = BaseButtonProperties &
    ButtonIconProperties &
    ButtonLinkVariant &
    Omit<
        React.HTMLAttributes<HTMLElement>,
        keyof BaseButtonProperties | keyof ButtonIconProperties | keyof ButtonLinkVariant
    >;
export const Button = React.forwardRef<HTMLElement, ButtonProperties>(function Button(
    {
        // Button-specific properties
        variant,
        size,
        iconSize,
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

    // Get icon size className from theme based on iconSize (takes precedence) or size
    const iconSizeClassName = iconSize
        ? buttonTheme.iconSizes[iconSize]
        : size
          ? buttonTheme.iconSizes[size]
          : buttonTheme.configuration.defaultVariant.size
            ? buttonTheme.iconSizes[buttonTheme.configuration.defaultVariant.size]
            : undefined;

    // Create button variant class names function using the merged theme
    const buttonVariantClassNames = createVariantClassNames(buttonTheme.configuration.baseClasses, {
        variants: {
            variant: buttonTheme.variants,
            size: buttonTheme.sizes,
        },
        // Only apply default size when variant is provided
        defaultVariants: variant ? buttonTheme.configuration.defaultVariant : {},
    });

    // Auto-disable when isLoading unless explicitly overridden
    // disabled={false} isLoading={true} → NOT disabled (explicit override)
    // disabled={undefined} isLoading={true} → disabled (auto-disable)
    // disabled={true} → disabled (explicit disable)
    const isDisabled = disabled ?? isLoading;

    // Compute final className using the merged theme
    const computedClassName = mergeClassNames(
        buttonVariantClassNames({
            variant, // Primary, Secondary, Ghost, etc.
            size, // Small, Base, Large, etc.
        }),
        buttonTheme.configuration.focusClasses, // Always applied
        isDisabled && buttonTheme.configuration.disabledClasses, // Conditional
        className, // User overrides (last = highest priority)
    );

    // Common properties for all variants
    const commonProperties = {
        ...domProperties,
        className: computedClassName,
        onClick: isDisabled ? (event: React.MouseEvent<HTMLElement>) => event.preventDefault() : onClick,
    };

    // Determine button content
    // Render order: iconLeft → icon → children → iconRight (→ isLoading spinner)
    const content = (
        <>
            {iconLeft && themeIcon(iconLeft, iconSizeClassName)}
            {icon && themeIcon(icon, iconSizeClassName)}
            {children}
            {isLoading && <SpinnerIcon className={mergeClassNames(iconSizeClassName, 'animate-spin')} />}
            {!isLoading && iconRight && themeIcon(iconRight, iconSizeClassName)}
        </>
    );

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
                aria-disabled={isDisabled ? 'true' : undefined}
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
                disabled={isDisabled}
                {...commonProperties}
            >
                {content}
            </button>
        );
    }

    // Return a Tip if provided
    if(tip) {
        return <Tip variant="Tip" {...tipProperties} trigger={component} content={tip} />;
    }
    else {
        return component;
    }
});

// Set display name for debugging
Button.displayName = 'Button';
