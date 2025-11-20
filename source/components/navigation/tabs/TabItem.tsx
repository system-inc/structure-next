'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Tabs Context
import { TabsContext } from '@structure/source/components/navigation/tabs/Tabs';

// Dependencies - Theme
import type { TabsSize } from '@structure/source/components/navigation/tabs/TabsTheme';
import { themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Main Components
import * as RadixTabPrimitive from '@radix-ui/react-tabs';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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

export const TabItem = React.forwardRef<React.ComponentRef<typeof RadixTabPrimitive.Trigger>, TabItemProperties>(
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
                            className={mergeClassNames(tabsContext.theme.configuration.itemActiveClasses)}
                        />
                    )}
                    <span className="relative z-10">{content}</span>
                </motion.button>
            </RadixTabPrimitive.Trigger>
        );
    },
);
TabItem.displayName = RadixTabPrimitive.Trigger.displayName;
