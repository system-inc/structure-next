'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { DialogClose } from './DialogClose';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogFooter
export interface DialogFooterProperties {
    className?: string;
    closeButton?: boolean | React.ReactElement;
    children?: React.ReactNode;
}
export function DialogFooter(properties: DialogFooterProperties) {
    const dialogContext = useDialogContext();

    // Render close button
    function renderCloseButton() {
        // Default to false in composition mode (user has full control)
        // Convenience mode explicitly passes true via DialogRoot
        if(properties.closeButton === true || React.isValidElement(properties.closeButton)) {
            // Determine the close button element
            const closeButtonElement = React.isValidElement(properties.closeButton) ? (
                properties.closeButton
            ) : (
                <Button variant="A">Dismiss</Button>
            );

            return <DialogClose>{closeButtonElement}</DialogClose>;
        }
        return null;
    }

    // Get variant-specific footer classes (undefined if no variant)
    const variantFooterClasses = dialogContext.variant
        ? dialogContext.dialogTheme.variantFooterClasses?.[dialogContext.variant]
        : undefined;

    // Render the component
    return (
        <div
            className={mergeClassNames(
                dialogContext.dialogTheme.configuration.footerBaseClasses,
                variantFooterClasses,
                properties.className,
            )}
        >
            {properties.children}
            {renderCloseButton()}
        </div>
    );
}
