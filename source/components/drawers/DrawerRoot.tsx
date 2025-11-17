'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Theme
import { drawerTheme as structureDrawerTheme } from './DrawerTheme';
import type { DrawerSide } from './DrawerTheme';

// Dependencies - Context
import { DrawerContext, DrawerNestedContext, useIsNestedDrawer } from './DrawerContext';

// Component - DrawerRoot
export interface DrawerRootProperties {
    // Behavior
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    shouldScaleBackground?: boolean;

    // Theme
    side?: DrawerSide;

    // Compound components
    children?: React.ReactNode;
}
export function DrawerRoot(properties: DrawerRootProperties) {
    // Use the structure drawer theme (projects can override via DrawerTheme.ts in their project)
    const drawerTheme = structureDrawerTheme;

    // Determine side with default from configuration
    const side = properties.side ?? drawerTheme.configuration.defaultSide;

    // Generate unique ID for accessibility
    const drawerId = React.useId();

    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Function to handle the open state change
    function onOpenChange(newOpen: boolean) {
        properties.onOpenChange?.(newOpen);
        setOpen(newOpen);
    }

    // On mount and when properties.open changes, update internal state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Check if this drawer is nested
    const isNestedDrawer = useIsNestedDrawer();

    // Select the appropriate Vaul component
    const DrawerRootComponent = isNestedDrawer ? VaulDrawer.NestedRoot : VaulDrawer.Root;

    // Determine the direction for Vaul (lowercase required by Vaul API)
    const direction = (side ?? 'Bottom').toLowerCase() as 'top' | 'bottom' | 'left' | 'right';

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        drawerId,
        drawerTheme,
        side,
        isNested: isNestedDrawer,
    };

    // Render the component
    return (
        <DrawerContext.Provider value={contextValue}>
            <DrawerRootComponent
                direction={direction}
                open={open}
                onOpenChange={onOpenChange}
                shouldScaleBackground={properties.shouldScaleBackground ?? false}
                modal={properties.modal}
            >
                <DrawerNestedContext.Provider value={{ value: isNestedDrawer ? 2 : 1 }}>
                    {properties.children}
                </DrawerNestedContext.Provider>
            </DrawerRootComponent>
        </DrawerContext.Provider>
    );
}
