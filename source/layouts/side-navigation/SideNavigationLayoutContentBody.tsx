'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SideNavigationLayoutContentBody
export interface SideNavigationLayoutContentBodyProperties {
    className?: string;
    containerClassName?: string;
    children: React.ReactNode;
}
export function SideNavigationLayoutContentBody(properties: SideNavigationLayoutContentBodyProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('h-full', properties.containerClassName)}>
            {/* This child div is necessary for easily managing multiple page layouts */}
            <div className={mergeClassNames('h-full', properties.className)}>{properties.children}</div>
        </div>
    );
}
