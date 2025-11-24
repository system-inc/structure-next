'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Tabs Context
import { TabsContext } from '@structure/source/components/navigation/tabs/Tabs';

// Dependencies - Main Components
import * as RadixTabPrimitive from '@radix-ui/react-tabs';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TabItem
export interface TabItemProperties
    extends Omit<React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Trigger>, 'asChild'> {
    className?: string;
    children: React.ReactNode;
}
export const TabItem = React.forwardRef<React.ComponentRef<typeof RadixTabPrimitive.Trigger>, TabItemProperties>(
    function TabItem({ className, children, ...radixTabTriggerProperties }, reference) {
        const tabsContext = React.useContext(TabsContext);
        const isActive = tabsContext.currentValue === radixTabTriggerProperties.value;

        // Get variant-specific classes
        const variantItemClasses = tabsContext.variant
            ? tabsContext.theme.variantItemClasses[tabsContext.variant]
            : undefined;

        const variantActiveClasses = tabsContext.variant
            ? tabsContext.theme.variantItemActiveClasses[tabsContext.variant]
            : undefined;

        const wrapperClasses = tabsContext.variant
            ? tabsContext.theme.variantItemWrapperClasses[tabsContext.variant]
            : undefined;

        // Compute TabItem className (base + variant-specific + custom)
        const tabItemClassName = mergeClassNames(
            tabsContext.theme.configuration.itemBaseClasses,
            variantItemClasses,
            className,
        );

        // Compute active indicator className (base + variant-specific)
        const activeIndicatorClassName = mergeClassNames(
            tabsContext.theme.configuration.itemActiveClasses,
            variantActiveClasses,
        );

        // Wrap children if variant specifies wrapper classes
        const content = wrapperClasses ? <div className={wrapperClasses}>{children}</div> : children;

        return (
            <RadixTabPrimitive.Trigger ref={reference} {...radixTabTriggerProperties} asChild>
                <motion.div className={tabItemClassName}>
                    {isActive && variantActiveClasses && (
                        <motion.div layoutId={`tab-${tabsContext.tabGroupId}`} className={activeIndicatorClassName} />
                    )}
                    {content}
                </motion.div>
            </RadixTabPrimitive.Trigger>
        );
    },
);
TabItem.displayName = RadixTabPrimitive.Trigger.displayName;
