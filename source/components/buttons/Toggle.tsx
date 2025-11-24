'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixToggle from '@radix-ui/react-toggle';
import { Tip } from '@structure/source/components/popovers/Tip';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';

// Dependencies - Theme
import { toggleTheme as structureToggleTheme } from '@structure/source/components/buttons/ToggleTheme';
import type { ToggleVariant, ToggleSize } from '@structure/source/components/buttons/ToggleTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Base Toggle Properties
export interface BaseToggleProperties {
    className?: string;
    variant?: ToggleVariant;
    size?: ToggleSize;
    iconSize?: ToggleSize; // Independent icon sizing
    disabled?: boolean;
    tip?: React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'trigger' | 'content'>;
    isPressed?: React.ComponentPropsWithoutRef<typeof RadixToggle.Root>['pressed'];
    onIsPressedChange?: React.ComponentPropsWithoutRef<typeof RadixToggle.Root>['onPressedChange'];
}

// Type - Icon can be either a component reference or pre-rendered JSX
export type ToggleIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Icon properties
// Icons can be either:
// - React.FunctionComponent: Auto-sized based on toggle size variant
// - React.ReactNode: Pre-rendered JSX with full control over styling
// Render order: iconLeft → icon → children → iconRight
export interface ToggleIconProperties {
    iconLeft?: ToggleIconType;
    icon?: ToggleIconType;
    iconRight?: ToggleIconType;
    children?: React.ReactNode;
}

// Component - Toggle
export type ToggleProperties = BaseToggleProperties &
    ToggleIconProperties &
    Omit<
        React.ComponentPropsWithoutRef<typeof RadixToggle.Root>,
        keyof BaseToggleProperties | keyof ToggleIconProperties
    >;
export const Toggle = React.forwardRef<React.ElementRef<typeof RadixToggle.Root>, ToggleProperties>(function Toggle(
    {
        // Toggle-specific properties
        variant,
        size,
        iconSize,
        icon,
        iconLeft,
        iconRight,

        // DOM properties we handle specially
        disabled,
        className,
        children,
        tip,
        tipProperties,

        // Renamed Radix properties
        isPressed,
        onIsPressedChange,

        // All other properties spread to Radix Toggle
        ...toggleProperties
    },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const toggleTheme = mergeTheme(structureToggleTheme, componentTheme?.Toggle);

    // Get icon size className from theme based on iconSize (takes precedence) or size
    const iconSizeClassName = iconSize
        ? toggleTheme.iconSizes[iconSize]
        : size
          ? toggleTheme.iconSizes[size]
          : toggleTheme.configuration.defaultVariant.size
            ? toggleTheme.iconSizes[toggleTheme.configuration.defaultVariant.size]
            : undefined;

    // Create toggle variant class names function using the merged theme
    const toggleVariantClassNames = createVariantClassNames(toggleTheme.configuration.baseClasses, {
        variants: {
            variant: toggleTheme.variants,
            size: toggleTheme.sizes,
        },
        // Only apply default size when variant is provided
        defaultVariants: variant ? toggleTheme.configuration.defaultVariant : {},
    });

    // Compute final className using the merged theme
    const computedClassName = mergeClassNames(
        toggleVariantClassNames({
            variant: variant,
            size: size,
        }),
        toggleTheme.configuration.focusClasses, // Always applied
        disabled && toggleTheme.configuration.disabledClasses, // Conditional
        className, // User overrides (last = highest priority)
    );

    // Determine toggle content
    // Render order: iconLeft → icon → children → iconRight
    const content = (
        <>
            {iconLeft && themeIcon(iconLeft, iconSizeClassName)}
            {icon && themeIcon(icon, iconSizeClassName)}
            {children}
            {iconRight && themeIcon(iconRight, iconSizeClassName)}
        </>
    );

    // Render the component
    const component = (
        <RadixToggle.Root
            ref={reference}
            disabled={disabled}
            className={computedClassName}
            pressed={isPressed}
            onPressedChange={onIsPressedChange}
            {...toggleProperties}
        >
            {content}
        </RadixToggle.Root>
    );

    // Wrap with tip if provided
    if(tip) {
        return <Tip variant="Tip" {...tipProperties} trigger={component} content={tip} />;
    }

    return component;
});

// Set display name for debugging
Toggle.displayName = 'Toggle';
