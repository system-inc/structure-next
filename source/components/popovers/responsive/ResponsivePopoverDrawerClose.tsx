'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Context
import { useResponsivePopoverDrawerContext } from './ResponsivePopoverDrawerContext';

// Component - ResponsivePopoverDrawerClose
export interface ResponsivePopoverDrawerCloseProperties {
    children: React.ReactElement;
}

export function ResponsivePopoverDrawerClose(properties: ResponsivePopoverDrawerCloseProperties) {
    const responsivePopoverDrawerContext = useResponsivePopoverDrawerContext();

    // Mobile: use Drawer.Close
    if(responsivePopoverDrawerContext.isMobile) {
        return <Drawer.Close>{properties.children}</Drawer.Close>;
    }

    // Desktop: wrap in clickable div that closes the popover
    return (
        <div
            onClick={function () {
                responsivePopoverDrawerContext.onOpenChange(false);
            }}
        >
            {properties.children}
        </div>
    );
}
