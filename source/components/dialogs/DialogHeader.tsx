'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { DialogClose } from './DialogClose';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogHeader
export interface DialogHeaderProperties {
    className?: string;
    closeButton?: boolean | React.ReactElement;
    children: React.ReactNode;
}
export function DialogHeader(properties: DialogHeaderProperties) {
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
                    <Button
                        variant="Ghost"
                        size="IconSmall"
                        icon={XIcon}
                        className={dialogContext.dialogTheme.configuration.closeClasses}
                        aria-label="Close"
                    />
                );

            return <DialogClose>{closeButtonElement}</DialogClose>;
        }
        return null;
    }

    // Get variant-specific header classes (undefined if no variant)
    const variantHeaderClasses = dialogContext.variant
        ? dialogContext.dialogTheme.variantHeaderClasses?.[dialogContext.variant]
        : undefined;

    // Render the component
    return (
        <div
            className={mergeClassNames(
                dialogContext.dialogTheme.configuration.headerBaseClasses,
                variantHeaderClasses,
                properties.className,
            )}
        >
            {renderCloseButton()}
            {properties.children}
        </div>
    );
}
