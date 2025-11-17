'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Component - DialogClose
export interface DialogCloseProperties {
    children: React.ReactElement;
}

export function DialogClose(properties: DialogCloseProperties) {
    const dialogContext = useDialogContext();

    // Mobile
    if(dialogContext.isMobile) {
        return <Drawer.Close>{properties.children}</Drawer.Close>;
    }

    // Desktop
    return <RadixDialog.Close asChild>{properties.children}</RadixDialog.Close>;
}
