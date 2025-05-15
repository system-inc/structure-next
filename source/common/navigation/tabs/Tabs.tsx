'use client';

import * as React from 'react';
import * as RadixTabPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { AnimatePresence, motion } from 'motion/react';

const tabsVariants = cva(
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

const TabsContext = React.createContext<
    VariantProps<typeof tabsVariants> & { tabGroupId: string; currentValue: string | undefined }
>({ tabGroupId: '', currentValue: undefined });

const Tabs = React.forwardRef<
    React.ElementRef<typeof RadixTabPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Root> & VariantProps<typeof tabsVariants>
>(({ className, size, activationMode = 'manual', ...props }, ref) => {
    const tabGroupId = React.useId();

    return (
        <AnimatePresence mode="popLayout">
            <TabsContext.Provider value={{ size, tabGroupId, currentValue: props.value }}>
                <RadixTabPrimitive.Root ref={ref} activationMode={activationMode} {...props}>
                    <RadixTabPrimitive.List className={mergeClassNames(tabsVariants({ className }))}>
                        {props.children}
                    </RadixTabPrimitive.List>
                </RadixTabPrimitive.Root>
            </TabsContext.Provider>
        </AnimatePresence>
    );
});
Tabs.displayName = RadixTabPrimitive.Root.displayName;

// TAB ITEM
const tabItemVariants = cva(
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

interface TabItemProps
    extends Omit<VariantProps<typeof tabItemVariants>, 'size'>,
        React.ComponentPropsWithoutRef<typeof RadixTabPrimitive.Trigger> {}
const TabItem = React.forwardRef<React.ElementRef<typeof RadixTabPrimitive.Trigger>, TabItemProps>(
    ({ className, icon, ...props }, ref) => {
        const { size, tabGroupId, currentValue } = React.useContext(TabsContext);
        const isActive = currentValue === props.value;

        return (
            <RadixTabPrimitive.Trigger ref={ref} {...props} asChild>
                <motion.button className={mergeClassNames(tabItemVariants({ size, icon, className }))}>
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

                    <div className="z-10">{props.children}</div>
                </motion.button>
            </RadixTabPrimitive.Trigger>
        );
    },
);
TabItem.displayName = RadixTabPrimitive.Trigger.displayName;

export { Tabs, tabsVariants, TabItem, tabItemVariants };
