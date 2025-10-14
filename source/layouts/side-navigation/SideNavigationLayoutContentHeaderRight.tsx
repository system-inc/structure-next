'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SideNavigationLayoutContentHeaderRight
export interface SideNavigationLayoutContentHeaderRightProperties {
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutContentHeaderRight(properties: SideNavigationLayoutContentHeaderRightProperties) {
    // Render the component
    return (
        // Wrapping the animated.div in another div to prevent the Next JS warning:
        // "Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element"
        <div className="">
            <div className={mergeClassNames('fixed top-0 right-16 flex h-[68px] items-center', properties.className)}>
                {properties.children}
            </div>
        </div>
    );
}
