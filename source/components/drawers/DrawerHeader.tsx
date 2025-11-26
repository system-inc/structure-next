'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { DrawerClose } from './DrawerClose';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerHeader
export interface DrawerHeaderProperties {
    className?: string;
    closeButton?: boolean | React.ReactElement;
    children: React.ReactNode;
}
export function DrawerHeader(properties: DrawerHeaderProperties) {
    const drawerContext = useDrawerContext();

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
                        className={drawerContext.drawerTheme.configuration.closeClasses}
                        aria-label="Close"
                    />
                );

            return <DrawerClose>{closeButtonElement}</DrawerClose>;
        }
        return null;
    }

    // Get variant-specific header classes (undefined if no variant)
    const variantHeaderClasses = drawerContext.variant
        ? drawerContext.drawerTheme.variantHeaderClasses?.[drawerContext.variant]
        : undefined;

    // Render the component
    return (
        <div
            className={mergeClassNames(
                drawerContext.drawerTheme.configuration.headerBaseClasses,
                variantHeaderClasses,
                properties.className,
            )}
        >
            {renderCloseButton()}
            {properties.children}
        </div>
    );
}
