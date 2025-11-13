'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';

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
        return <VaulDrawer.Close asChild>{properties.children}</VaulDrawer.Close>;
    }

    // Desktop
    return <RadixDialog.Close asChild>{properties.children}</RadixDialog.Close>;
}
