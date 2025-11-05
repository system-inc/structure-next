'use client';

import React from 'react';
import * as RadixTabPrimitive from '@radix-ui/react-tabs';
import {
    mergeClassNames,
    createVariantClassNames,
    VariantProperties,
} from '@structure/source/utilities/style/ClassName';
import { AnimatePresence, motion } from 'motion/react';

export const tabsVariants = createVariantClassNames(
    // Wrapper defaults
    'z-0 flex items-center gap-1 rounded-full background--2 p-0.5 transition-colors',
    {
        variants: {
            size: {
                large: null, // These are for providing the sizes to the child tabs via context
                'extra-small': null, // These are for providing the sizes to the child tabs via context
            },
        },
        defaultVariants: {
            size: 'large',
        },
    },
);

export const TabsContext = React.createContext<
    VariantProperties<typeof tabsVariants> & { tabGroupId: string; currentValue: string | undefined }
>({ tabGroupId: '', currentValue: undefined });

export const Tabs = React.forwardRef<
    React.ComponentRef<typeof RadixTabPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Root> & VariantProperties<typeof tabsVariants>
>(function ({ className, size, activationMode: activationModeProperty, ...radixTabRootProperties }, reference) {
    const activationMode = activationModeProperty || 'manual';

    const tabGroupId = React.useId();

    return (
        <AnimatePresence mode="popLayout">
            <TabsContext.Provider value={{ size: size, tabGroupId, currentValue: radixTabRootProperties.value }}>
                <RadixTabPrimitive.Root ref={reference} activationMode={activationMode} {...radixTabRootProperties}>
                    <RadixTabPrimitive.List className={mergeClassNames(tabsVariants({ className: className }))}>
                        {radixTabRootProperties.children}
                    </RadixTabPrimitive.List>
                </RadixTabPrimitive.Root>
            </TabsContext.Provider>
        </AnimatePresence>
    );
});
Tabs.displayName = RadixTabPrimitive.Root.displayName;

// TAB ITEM
export const tabItemVariants = createVariantClassNames(
    mergeClassNames(
        // Default
        'group relative cursor-pointer rounded-full content--2 transition-colors',
        // Hover
        'hover:content--0',
        // Active
        'data-[state=active]:content--0',
    ),
    {
        variants: {
            size: {
                large: ['inline-flex gap-3 px-6 py-3 text-sm font-medium', '[&_svg]:size-4'],
                'extra-small': ['inline-flex gap-2 px-6 py-1.5 text-sm', '[&_svg]:size-4'],
            },
            icon: {
                true: null,
                false: null,
            },
        },
        compoundVariants: [
            {
                size: 'large',
                icon: true,
                className: 'px-3.5 py-3.5',
            },
            {
                size: 'extra-small',
                icon: true,
                className: 'px-2 py-2',
            },
        ],
        defaultVariants: {
            size: 'large',
            icon: false,
        },
    },
);

// Component - TabItem
export interface TabItemProperties
    extends Omit<VariantProperties<typeof tabItemVariants>, 'size'>,
        React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Trigger> {}
export const TabItem = React.forwardRef<React.ElementRef<typeof RadixTabPrimitive.Trigger>, TabItemProperties>(
    function ({ className, icon, ...radixTabTriggerProperties }, reference) {
        const tabsContext = React.useContext(TabsContext);
        const isActive = tabsContext.currentValue === radixTabTriggerProperties.value;

        return (
            <RadixTabPrimitive.Trigger ref={reference} {...radixTabTriggerProperties} asChild>
                <motion.button
                    className={mergeClassNames(
                        tabItemVariants({ size: tabsContext.size, icon: icon, className: className }),
                    )}
                >
                    {isActive && (
                        <motion.div
                            layoutId={`tab-${tabsContext.tabGroupId}`}
                            className={mergeClassNames(
                                'absolute inset-0 h-full w-full border border-transparent',
                                'z-0 group-data-[state=active]:border--1 group-data-[state=active]:background--0',
                            )}
                            style={{
                                borderRadius: '99px',
                            }}
                        />
                    )}

                    <div className="z-10">{radixTabTriggerProperties.children}</div>
                </motion.button>
            </RadixTabPrimitive.Trigger>
        );
    },
);
TabItem.displayName = RadixTabPrimitive.Trigger.displayName;
