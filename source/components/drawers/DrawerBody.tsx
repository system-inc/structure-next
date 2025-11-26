'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Context
import { useDrawerContext } from './DrawerContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerBody
export interface DrawerBodyProperties {
    className?: string;
    children: React.ReactNode;
}
export function DrawerBody(properties: DrawerBodyProperties) {
    const drawerContext = useDrawerContext();

    // Get variant-specific body classes (undefined if no variant)
    const variantBodyClasses = drawerContext.variant
        ? drawerContext.drawerTheme.variantBodyClasses?.[drawerContext.variant]
        : undefined;

    // Render the component
    return (
        <div
            className={mergeClassNames(
                drawerContext.drawerTheme.configuration.bodyBaseClasses,
                variantBodyClasses,
                properties.className,
            )}
        >
            {properties.children}
        </div>
    );
}
