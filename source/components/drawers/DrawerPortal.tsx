// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Component - DrawerPortal
export interface DrawerPortalProperties {
    children?: React.ReactNode;
}
export function DrawerPortal(properties: DrawerPortalProperties) {
    // Render the component
    return <VaulDrawer.Portal>{properties.children}</VaulDrawer.Portal>;
}
