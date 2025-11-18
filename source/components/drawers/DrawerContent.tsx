'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - DrawerContent
export interface DrawerContentProperties {
    className?: string;
    accessibilityTitle?: string; // Optional accessibility title (screen reader only)
    accessibilityDescription: string; // Required for accessibility, can be empty string if title is self-explanatory
    onOpenAutoFocus?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
    children?: React.ReactNode;
}
export function DrawerContent(properties: DrawerContentProperties) {
    const drawerContext = useDrawerContext();

    // Title element for accessibility (screen reader only)
    const accessibilityTitleElement = properties.accessibilityTitle ? (
        <VaulDrawer.Title className="sr-only">{properties.accessibilityTitle}</VaulDrawer.Title>
    ) : null;

    // Description element for accessibility
    const accessibilityDescriptionElement = properties.accessibilityDescription ? (
        <VaulDrawer.Description className="sr-only">{properties.accessibilityDescription}</VaulDrawer.Description>
    ) : null;

    // Render the component
    return (
        <VaulDrawer.Content
            className={properties.className}
            onOpenAutoFocus={function (event) {
                if(properties.onOpenAutoFocus) {
                    properties.onOpenAutoFocus(event);
                }
                else {
                    event.preventDefault();
                    focusFirstFocusableElement(`[data-drawer-id="${drawerContext.drawerId}"]`);
                }
            }}
            onCloseAutoFocus={properties.onCloseAutoFocus}
            data-drawer-id={drawerContext.drawerId}
        >
            {accessibilityTitleElement}
            {accessibilityDescriptionElement}
            {properties.children}
        </VaulDrawer.Content>
    );
}
