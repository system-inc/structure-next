'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogHeader
export interface DialogHeaderProperties {
    className?: string;
    children: React.ReactNode;
}
export function DialogHeader(properties: DialogHeaderProperties) {
    const dialogContext = useDialogContext();

    // Polymorphic DialogTitle based on mobile or desktop
    const DialogTitle = dialogContext.isMobile ? VaulDrawer.Title : RadixDialog.Title;

    // Render the component
    return (
        <div
            className={mergeClassNames(
                dialogContext.dialogTheme.configuration.headerClasses,
                dialogContext.isMobile ? 'shrink-0 px-6 pt-6 pb-4' : '',
                properties.className,
            )}
        >
            {typeof properties.children === 'string' ? (
                <DialogTitle asChild>
                    <div className="font-medium">{properties.children}</div>
                </DialogTitle>
            ) : (
                <DialogTitle asChild>{properties.children}</DialogTitle>
            )}
        </div>
    );
}
