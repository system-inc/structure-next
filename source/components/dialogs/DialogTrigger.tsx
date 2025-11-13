'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Component - DialogTrigger
export interface DialogTriggerProperties {
    children: React.ReactElement;
}
export function DialogTrigger(properties: DialogTriggerProperties) {
    const dialogContext = useDialogContext();

    // Mobile
    if(dialogContext.isMobile) {
        return <VaulDrawer.Trigger asChild>{properties.children}</VaulDrawer.Trigger>;
    }

    // Desktop
    return (
        <RadixDialog.Trigger asChild>
            {wrapForSlot(properties.children, dialogContext.open ? 'data-state-open' : '')}
        </RadixDialog.Trigger>
    );
}
