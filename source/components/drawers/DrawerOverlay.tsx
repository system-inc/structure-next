'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerOverlay
export interface DrawerOverlayProperties {
    className?: string;
}
export function DrawerOverlay(properties: DrawerOverlayProperties) {
    const drawerContext = useDrawerContext();

    // Render the component
    return (
        <VaulDrawer.Overlay
            className={mergeClassNames(drawerContext.drawerTheme.configuration.overlayClasses, properties.className)}
        />
    );
}
