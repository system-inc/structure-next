'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';

// Dependencies - Main Components
import { Popover } from '@structure/source/components/popovers/Popover';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';
import { Drawer } from '@structure/source/components/drawers/Drawer';
import type { DrawerProperties } from '@structure/source/components/drawers/Drawer';

// Dependencies - Theme
import type { PopoverVariant } from '@structure/source/components/popovers/PopoverTheme';
import type { DrawerVariant } from '@structure/source/components/drawers/DrawerTheme';

// Dependencies - Context
import { ResponsivePopoverDrawerContext } from './ResponsivePopoverDrawerContext';

// Component - ResponsivePopoverDrawerRoot
export interface ResponsivePopoverDrawerRootProperties {
    // Required accessibility (for Drawer)
    accessibilityTitle: string;
    accessibilityDescription: string;

    // Content (trigger prop OR children with compound components)
    trigger?: React.ReactElement;
    content?: React.ReactNode;
    children?: React.ReactNode;

    // State
    open?: boolean;
    onOpenChange?: (open: boolean) => void;

    // Theme
    variant?: PopoverVariant | DrawerVariant; // Accepts variants from both Popover and Drawer

    // Pass-through props
    popoverProperties?: Partial<Omit<PopoverProperties, 'trigger' | 'content' | 'open' | 'onOpenChange' | 'variant'>>;
    drawerProperties?: Partial<
        Omit<
            DrawerProperties,
            | 'trigger'
            | 'children'
            | 'open'
            | 'onOpenChange'
            | 'accessibilityTitle'
            | 'accessibilityDescription'
            | 'variant'
        >
    >;

    // Styling
    className?: string;
}
export function ResponsivePopoverDrawerRoot(properties: ResponsivePopoverDrawerRootProperties) {
    // Hooks
    const isMobile = useIsMobile();

    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Function to handle the open state change
    function onOpenChange(newOpen: boolean) {
        properties.onOpenChange?.(newOpen);
        setOpen(newOpen);
    }

    // On mount, set the open state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        isMobile,
    };

    // Render the component
    return (
        <ResponsivePopoverDrawerContext.Provider value={contextValue}>
            {isMobile ? (
                // Mobile: Drawer
                <Drawer
                    accessibilityTitle={properties.accessibilityTitle}
                    accessibilityDescription={properties.accessibilityDescription}
                    trigger={properties.trigger}
                    open={open}
                    onOpenChange={onOpenChange}
                    variant={properties.variant as DrawerVariant}
                    className={properties.className}
                    {...properties.drawerProperties}
                >
                    {properties.content ?? properties.children}
                </Drawer>
            ) : (
                // Desktop: Popover
                <Popover
                    trigger={properties.trigger!}
                    content={properties.content ?? properties.children}
                    open={open}
                    onOpenChange={onOpenChange}
                    variant={properties.variant as PopoverVariant}
                    contentClassName={properties.className}
                    {...properties.popoverProperties}
                />
            )}
        </ResponsivePopoverDrawerContext.Provider>
    );
}
