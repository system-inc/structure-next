'use client';

import React from 'react';
import * as RadixTabPrimitive from '@radix-ui/react-tabs';
import { AnimatePresence, motion } from 'motion/react';

// Dependencies - Theme
import { tabsTheme as structureTabsTheme } from '@structure/source/components/navigation/tabs/TabsTheme';
import type {
    TabsVariant,
    TabsSize,
    TabsThemeConfiguration,
} from '@structure/source/components/navigation/tabs/TabsTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Tabs Context - Provides size and theme to TabItems
export const TabsContext = React.createContext<{
    size?: TabsSize;
    tabGroupId: string;
    currentValue: string | undefined;
    theme: TabsThemeConfiguration;
}>({
    tabGroupId: '',
    currentValue: undefined,
    theme: structureTabsTheme,
});

// Base Tabs Properties
export interface BaseTabsProperties {
    className?: string;
    variant?: TabsVariant;
    size?: TabsSize;
}

// Component - Tabs
export interface TabsProperties
    extends BaseTabsProperties,
        Omit<React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Root>, keyof BaseTabsProperties | 'size'> {}

export const Tabs = React.forwardRef<React.ComponentRef<typeof RadixTabPrimitive.Root>, TabsProperties>(function Tabs(
    { className, variant, size, activationMode: activationModeProperty, ...radixTabRootProperties },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const tabsTheme = mergeComponentTheme(structureTabsTheme, componentTheme?.Tabs);

    // Apply defaults from theme if not provided
    const effectiveVariant = variant || tabsTheme.configuration.defaultVariant.variant;
    const effectiveSize = size || tabsTheme.configuration.defaultVariant.size;

    // Default activation mode
    const activationMode = activationModeProperty || 'manual';

    // Generate unique ID for this tab group (for animation layoutId)
    const tabGroupId = React.useId();

    // Create variant class names function using the merged theme
    const tabsVariantClassNames = createVariantClassNames(tabsTheme.configuration.baseClasses, {
        variants: {
            variant: tabsTheme.variants,
            size: tabsTheme.sizes,
        },
        defaultVariants: tabsTheme.configuration.defaultVariant,
    });

    // Compute final className
    const computedClassName = mergeClassNames(
        tabsVariantClassNames({
            variant: effectiveVariant,
            size: effectiveSize,
        }),
        className,
    );

    return (
        <AnimatePresence mode="popLayout">
            <TabsContext.Provider
                value={{
                    size: effectiveSize,
                    tabGroupId,
                    currentValue: radixTabRootProperties.value,
                    theme: tabsTheme,
                }}
            >
                <RadixTabPrimitive.Root ref={reference} activationMode={activationMode} {...radixTabRootProperties}>
                    <RadixTabPrimitive.List className={computedClassName}>
                        {radixTabRootProperties.children}
                    </RadixTabPrimitive.List>
                </RadixTabPrimitive.Root>
            </TabsContext.Provider>
        </AnimatePresence>
    );
});
Tabs.displayName = RadixTabPrimitive.Root.displayName;

// Type - Icon can be either a component reference or pre-rendered JSX
export type TabItemIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Base TabItem Properties
export interface BaseTabItemProperties {
    className?: string;
    iconSize?: TabsSize; // Independent icon sizing (takes precedence over size-derived icon size)
}

// Icon properties
// Icons can be either:
// - React.FunctionComponent: Auto-sized based on tab size variant
// - React.ReactNode: Pre-rendered JSX with full control over styling
// Render order: iconLeft → icon → children → iconRight
export interface TabItemIconProperties {
    iconLeft?: TabItemIconType;
    icon?: TabItemIconType;
    iconRight?: TabItemIconType;
    children?: React.ReactNode;
}

// Component - TabItem
export interface TabItemProperties
    extends BaseTabItemProperties,
        TabItemIconProperties,
        Omit<
            React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Trigger>,
            keyof BaseTabItemProperties | keyof TabItemIconProperties | 'asChild'
        > {}

export const TabItem = React.forwardRef<React.ElementRef<typeof RadixTabPrimitive.Trigger>, TabItemProperties>(
    function TabItem(
        { className, icon, iconLeft, iconRight, iconSize, children, ...radixTabTriggerProperties },
        reference,
    ) {
        const tabsContext = React.useContext(TabsContext);
        const isActive = tabsContext.currentValue === radixTabTriggerProperties.value;

        // Get icon size className from theme based on iconSize (takes precedence) or size
        const iconSizeClassName = iconSize
            ? tabsContext.theme.iconSizes[iconSize]
            : tabsContext.size
              ? tabsContext.theme.iconSizes[tabsContext.size]
              : tabsContext.theme.configuration.defaultVariant.size
                ? tabsContext.theme.iconSizes[tabsContext.theme.configuration.defaultVariant.size]
                : undefined;

        // Get size classes from theme (inherited from Tabs parent via context)
        const sizeClasses = tabsContext.size ? tabsContext.theme.sizes[tabsContext.size] : '';

        // Compute TabItem className
        const tabItemClassName = mergeClassNames(
            tabsContext.theme.configuration.itemBaseClasses,
            sizeClasses,
            className,
        );

        // Determine tab item content
        // Render order: iconLeft → icon → children → iconRight
        const content = (
            <>
                {iconLeft && themeIcon(iconLeft, iconSizeClassName)}
                {icon && themeIcon(icon, iconSizeClassName)}
                {children}
                {iconRight && themeIcon(iconRight, iconSizeClassName)}
            </>
        );

        return (
            <RadixTabPrimitive.Trigger ref={reference} {...radixTabTriggerProperties} asChild>
                <motion.button className={tabItemClassName}>
                    {isActive && (
                        <motion.div
                            layoutId={`tab-${tabsContext.tabGroupId}`}
                            className={tabsContext.theme.configuration.itemActiveClasses}
                            style={{
                                borderRadius: '99px',
                            }}
                        />
                    )}

                    <div className="z-10">{content}</div>
                </motion.button>
            </RadixTabPrimitive.Trigger>
        );
    },
);
TabItem.displayName = RadixTabPrimitive.Trigger.displayName;
