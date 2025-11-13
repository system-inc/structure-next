'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogFooter
export interface DialogFooterProperties {
    className?: string;
    closeButton?: boolean | React.ReactNode; // Auto close button in footer
    children: React.ReactNode;
}
export function DialogFooter(properties: DialogFooterProperties) {
    const dialogContext = useDialogContext();

    // Mobile or Desktop close component
    const DialogClose = dialogContext.isMobile ? VaulDrawer.Close : RadixDialog.Close;

    // Render the component
    return (
        <div className={mergeClassNames(dialogContext.dialogTheme.configuration.footerClasses, properties.className)}>
            {properties.children}

            {/* Dismiss Button */}
            {properties.closeButton !== undefined && properties.closeButton !== false && (
                <DialogClose asChild>
                    {properties.closeButton !== true && properties.closeButton !== undefined ? (
                        properties.closeButton
                    ) : (
                        <Button variant="A">Dismiss</Button>
                    )}
                </DialogClose>
            )}
        </div>
    );
}
