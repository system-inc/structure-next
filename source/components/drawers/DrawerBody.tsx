'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerBody
export interface DrawerBodyProperties {
    className?: string;
    children: React.ReactNode;
}
export function DrawerBody(properties: DrawerBodyProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('grow overflow-y-auto px-6', properties.className)}>{properties.children}</div>
    );
}
