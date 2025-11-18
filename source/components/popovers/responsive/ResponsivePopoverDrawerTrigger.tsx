'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Context
import { useResponsivePopoverDrawerContext } from './ResponsivePopoverDrawerContext';

// Component - ResponsivePopoverDrawerTrigger
export interface ResponsivePopoverDrawerTriggerProperties {
    children: React.ReactElement;
}

export function ResponsivePopoverDrawerTrigger(properties: ResponsivePopoverDrawerTriggerProperties) {
    const responsivePopoverDrawerContext = useResponsivePopoverDrawerContext();

    // Mobile: use Drawer.Trigger
    if(responsivePopoverDrawerContext.isMobile) {
        return <Drawer.Trigger>{properties.children}</Drawer.Trigger>;
    }

    // Desktop: render trigger directly (Popover handles it via trigger prop)
    return properties.children;
}
