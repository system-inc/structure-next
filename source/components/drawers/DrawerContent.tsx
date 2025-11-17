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
    onOpenAutoFocus?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
    children?: React.ReactNode;
}
export function DrawerContent(properties: DrawerContentProperties) {
    const drawerContext = useDrawerContext();

    // Get the theme classes for this side
    const sideTheme = drawerContext.drawerTheme.sides[drawerContext.side ?? 'Bottom'];

    // Combine base wrapper classes with side-specific wrapper classes
    const wrapperClasses = mergeClassNames(
        drawerContext.drawerTheme.configuration.baseWrapperClasses,
        sideTheme.wrapperClasses,
        properties.className,
    );

    // Combine base content classes with side-specific content classes
    const contentClasses = mergeClassNames(
        drawerContext.drawerTheme.configuration.baseContentClasses,
        sideTheme.contentClasses,
    );

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
            <div className={contentClasses}>{properties.children}</div>
        </VaulDrawer.Content>
    );
}
