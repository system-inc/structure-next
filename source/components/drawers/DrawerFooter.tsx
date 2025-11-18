'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { DrawerClose } from './DrawerClose';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerFooter
export interface DrawerFooterProperties {
    className?: string;
    closeButton?: boolean | React.ReactElement;
    children?: React.ReactNode;
}
export function DrawerFooter(properties: DrawerFooterProperties) {
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
                    <Button variant="A">Dismiss</Button>
                );

            return <DrawerClose>{closeButtonElement}</DrawerClose>;
        }
        return null;
    }

    // Render the component
    return (
        <div
            className={mergeClassNames(
                drawerContext.drawerTheme.configuration.footerClasses,
                'shrink-0 px-6 pt-4 pb-6',
                properties.className,
            )}
        >
            {properties.children}
            {renderCloseButton()}
        </div>
    );
}
