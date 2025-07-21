'use client';

import React from 'react';
import * as RadixTabPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps as VariantProperties } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { AnimatePresence, motion } from 'motion/react';

export const tabsVariants = cva(
    [
        // Wrapper defaults
        'rounded-full transition-colors bg-opsis-background-secondary p-0.5 flex items-center gap-1 z-0',
    ],
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
    React.ElementRef<typeof RadixTabPrimitive.Root>,
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
export const tabItemVariants = cva(
    [
        // Default
        'text-opsis-content-secondary rounded-full transition-colors relative group',
        // Hover
        'hover:text-opsis-content-primary',
        // Active
        'data-[state=active]:text-opsis-action-general-dark',
    ],
    {
        variants: {
            size: {
                large: ['px-6 py-3 text-sm font-medium inline-flex gap-3', '[&_svg]:size-4'],
                'extra-small': ['px-6 py-1.5 inline-flex gap-2 text-sm', '[&_svg]:size-4'],
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
        const { size, tabGroupId, currentValue } = React.useContext(TabsContext);
        const isActive = currentValue === radixTabTriggerProperties.value;

        return (
            <RadixTabPrimitive.Trigger ref={reference} {...radixTabTriggerProperties} asChild>
                <motion.button className={mergeClassNames(tabItemVariants({ size, icon: icon, className: className }))}>
                    {isActive && (
                        <motion.div
                            layoutId={`tab-${tabGroupId}`}
                            className={mergeClassNames(
                                'absolute inset-0 h-full w-full border border-transparent',
                                'group-data-[state=active]:border-opsis-border-primary group-data-[state=active]:bg-opsis-background-primary z-0',
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
