// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Component - DrawerTrigger
export interface DrawerTriggerProperties {
    children: React.ReactElement;
}
export function DrawerTrigger(properties: DrawerTriggerProperties) {
    // Render the component
    return <VaulDrawer.Trigger asChild>{properties.children}</VaulDrawer.Trigger>;
}
