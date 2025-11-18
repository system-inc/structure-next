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
        // Default to true if undefined
        if(properties.closeButton === undefined || properties.closeButton !== false) {
            // Determine the close button element
            const closeButtonElement =
                properties.closeButton !== true &&
                properties.closeButton !== undefined &&
                React.isValidElement(properties.closeButton) ? (
                    properties.closeButton
                ) : (
                    <Button variant="A">Dismiss</Button>
                );

            return <DialogClose>{closeButtonElement}</DialogClose>;
        }
        return null;
    }

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
            {renderCloseButton()}
        </div>
    );
}
