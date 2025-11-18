'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Component - DrawerTrigger
export interface DrawerTriggerProperties {
    children: React.ReactElement;
}
export function DrawerTrigger(properties: DrawerTriggerProperties) {
    const drawerContext = useDrawerContext();

    // Render the component
    return (
        <VaulDrawer.Trigger asChild>
            {wrapForSlot(properties.children, drawerContext.open ? 'data-state-open' : '')}
        </VaulDrawer.Trigger>
    );
}
