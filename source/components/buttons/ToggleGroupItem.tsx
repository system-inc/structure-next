'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

// Dependencies - Main Components
import { Tip } from '@structure/source/components/popovers/Tip';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';

// Dependencies - Theme
import { toggleTheme as structureToggleTheme } from '@structure/source/components/buttons/ToggleTheme';
import type { ToggleVariant, ToggleSize } from '@structure/source/components/buttons/ToggleTheme';
import type { ToggleGroupVariant } from '@structure/source/components/buttons/ToggleGroupTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Context for ToggleGroup
const ToggleGroupContext = React.createContext<{
    groupVariant?: ToggleGroupVariant; // The ToggleGroup's own variant
    itemVariant?: ToggleVariant; // Explicit item variant override
    itemSize?: ToggleSize; // Explicit item size override
}>({
    groupVariant: undefined,
    itemVariant: undefined,
    itemSize: undefined,
});

// Hook to access ToggleGroup context
export const useToggleGroupContext = function () {
    return React.useContext(ToggleGroupContext);
};

// Export context provider for use in ToggleGroup.tsx
export const ToggleGroupContextProvider = ToggleGroupContext.Provider;

// Type for icon props - can be either a component reference or pre-rendered JSX
export type ToggleGroupItemIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Base ToggleGroupItem Properties
export interface BaseToggleGroupItemProperties {
    className?: string;
    variant?: ToggleVariant;
    size?: ToggleSize;
    iconSize?: ToggleSize; // Independent icon sizing
    disabled?: boolean;
    tip?: React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'trigger' | 'content'>;
}

// Icon properties
// Icons can be either:
// - React.FunctionComponent: Auto-sized based on toggle size variant
// - React.ReactNode: Pre-rendered JSX with full control over styling
// Render order: iconLeft → icon → children → iconRight
export interface ToggleGroupItemIconProperties {
    iconLeft?: ToggleGroupItemIconType;
    icon?: ToggleGroupItemIconType;
    iconRight?: ToggleGroupItemIconType;
    children?: React.ReactNode;
}

// Component - ToggleGroupItem
export type ToggleGroupItemProperties = BaseToggleGroupItemProperties &
    ToggleGroupItemIconProperties &
    Omit<
        React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
        keyof BaseToggleGroupItemProperties | keyof ToggleGroupItemIconProperties
    >;

export const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    ToggleGroupItemProperties
>(function ToggleGroupItem(
    {
        // ToggleGroupItem-specific properties
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

        // All other properties spread to Radix ToggleGroup.Item
        ...toggleGroupItemProperties
    },
    reference,
) {
    // Get context from parent ToggleGroup
    const toggleGroupContext = useToggleGroupContext();

    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const toggleTheme = mergeComponentTheme(structureToggleTheme, componentTheme?.Toggle);

    // Use context variant/size as fallback, then explicit props, then theme defaults
    const effectiveVariant = variant || toggleGroupContext.itemVariant;
    const effectiveSize = size || toggleGroupContext.itemSize;

    // Get icon size className from theme based on iconSize (takes precedence) or size
    const iconSizeClassName = iconSize
        ? toggleTheme.iconSizes[iconSize]
        : effectiveSize
          ? toggleTheme.iconSizes[effectiveSize]
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
        defaultVariants: effectiveVariant ? toggleTheme.configuration.defaultVariant : {},
    });

    // Segmented control styling when ToggleGroup has variant="A"
    const segmentedControlClassNames =
        toggleGroupContext.groupVariant === 'A'
            ? mergeClassNames(
                  // Base sizing and layout
                  'flex-1 px-3 py-1.5 text-sm font-medium',
                  // Rounded corners only on edges to fit within parent container
                  'first:rounded-l-lg last:rounded-r-lg',
                  // Selected state (on)
                  'data-[state=on]:background-content--3 data-[state=on]:content--10',
                  // Unselected state (off)
                  'data-[state=off]:bg-transparent data-[state=off]:content--1',
              )
            : undefined;

    // Compute final className using the merged theme
    const computedClassName = mergeClassNames(
        toggleVariantClassNames({
            variant: effectiveVariant,
            size: effectiveSize,
        }),
        toggleTheme.configuration.focusClasses, // Always applied
        disabled && toggleTheme.configuration.disabledClasses, // Conditional
        segmentedControlClassNames, // Segmented control styling when groupVariant="A"
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
        <ToggleGroupPrimitive.Item
            ref={reference}
            disabled={disabled}
            className={computedClassName}
            {...toggleGroupItemProperties}
        >
            {content}
        </ToggleGroupPrimitive.Item>
    );

    // Wrap with tip if provided
    if(tip) {
        return <Tip variant="Tip" {...tipProperties} trigger={component} content={tip} />;
    }

    return component;
});

// Set display name for debugging
ToggleGroupItem.displayName = 'ToggleGroupItem';
