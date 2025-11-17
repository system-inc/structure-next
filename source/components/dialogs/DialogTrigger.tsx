'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer } from '@structure/source/components/drawers/Drawer';

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
        return <Drawer.Trigger>{properties.children}</Drawer.Trigger>;
    }

    // Desktop
    return (
        <RadixDialog.Trigger asChild>
            {wrapForSlot(properties.children, dialogContext.open ? 'data-state-open' : '')}
        </RadixDialog.Trigger>
    );
}
