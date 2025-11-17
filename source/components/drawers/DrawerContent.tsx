'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - DrawerContent
export interface DrawerContentProperties {
    className?: string;
    accessibilityDescription: string; // Required for accessibility, can be empty string if title is self-explanatory
    onOpenAutoFocus?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
    children?: React.ReactNode;
}
export function DrawerContent(properties: DrawerContentProperties) {
    const drawerContext = useDrawerContext();

    // Get the theme classes for this side and variant
    const sideTheme = drawerContext.drawerTheme.sides[drawerContext.side ?? 'Bottom'];
    const variantClasses = drawerContext.variant ? drawerContext.drawerTheme.variants[drawerContext.variant] : '';

    // Combine base wrapper classes with variant and side-specific wrapper classes
    const wrapperClasses = mergeClassNames(
        drawerContext.drawerTheme.configuration.baseWrapperClasses,
        variantClasses,
        sideTheme.wrapperClasses,
        properties.className,
    );

    // Description element for accessibility
    const accessibilityDescriptionElement = properties.accessibilityDescription ? (
        <VaulDrawer.Description className="sr-only">{properties.accessibilityDescription}</VaulDrawer.Description>
    ) : null;

    // Render the component
    return (
        <VaulDrawer.Content
            className={wrapperClasses}
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
            {accessibilityDescriptionElement}
            {properties.children}
        </VaulDrawer.Content>
    );
}
