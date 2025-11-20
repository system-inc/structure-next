'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Theme
import { tabsTheme as structureTabsTheme } from '@structure/source/components/navigation/tabs/TabsTheme';
import type {
    TabsVariant,
    TabsSize,
    TabsThemeConfiguration,
} from '@structure/source/components/navigation/tabs/TabsTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Main Components
import * as RadixTabPrimitive from '@radix-ui/react-tabs';

// Dependencies - Animation
import { AnimatePresence } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - TabItem
import { TabItem } from '@structure/source/components/navigation/tabs/TabItem';

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

export const TabsRoot = React.forwardRef<React.ComponentRef<typeof RadixTabPrimitive.Root>, TabsProperties>(
    function Tabs(
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
        // Note: Only variants are applied to Tabs wrapper, sizes are applied to TabItems
        const tabsVariantClassNames = createVariantClassNames(tabsTheme.configuration.baseClasses, {
            variants: {
                variant: tabsTheme.variants,
            },
            defaultVariants: tabsTheme.configuration.defaultVariant,
        });

        // Compute final className
        const computedClassName = mergeClassNames(
            tabsVariantClassNames({
                variant: effectiveVariant,
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
    },
);
TabsRoot.displayName = RadixTabPrimitive.Root.displayName;

// Create Tabs with TabItem as a property for composition pattern
export const Tabs = Object.assign(TabsRoot, {
    TabItem: TabItem,
});
