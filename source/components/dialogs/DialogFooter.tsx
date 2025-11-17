'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer } from '@structure/source/components/drawers/Drawer';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogFooter
export interface DialogFooterProperties {
    className?: string;
    closeButton?: boolean | React.ReactNode; // Auto close button in footer
    children?: React.ReactNode;
}
export function DialogFooter(properties: DialogFooterProperties) {
    const dialogContext = useDialogContext();

    // Determine the close button element
    const closeButtonElement =
        properties.closeButton !== true &&
        properties.closeButton !== undefined &&
        React.isValidElement(properties.closeButton) ? (
            properties.closeButton
        ) : (
            <Button variant="A">Dismiss</Button>
        );

    // Render the component
    return (
        <div
            className={mergeClassNames(
                dialogContext.dialogTheme.configuration.footerClasses,
                dialogContext.isMobile ? 'shrink-0 px-6 pt-4 pb-6' : '',
                properties.className,
            )}
        >
            {properties.children}

            {/* Dismiss Button */}
            {properties.closeButton !== undefined && properties.closeButton !== false && (
                <>
                    {dialogContext.isMobile ? (
                        <Drawer.Close>{closeButtonElement}</Drawer.Close>
                    ) : (
                        <RadixDialog.Close asChild>{closeButtonElement}</RadixDialog.Close>
                    )}
                </>
            )}
        </div>
    );
}
