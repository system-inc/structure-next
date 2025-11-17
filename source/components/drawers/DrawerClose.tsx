// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Component - DrawerClose
export interface DrawerCloseProperties {
    children: React.ReactElement;
}
export function DrawerClose(properties: DrawerCloseProperties) {
    // Render the component
    return <VaulDrawer.Close asChild>{properties.children}</VaulDrawer.Close>;
}
