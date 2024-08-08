'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutContentBody
export interface SideNavigationLayoutContentBodyInterface {
    className?: string;
    containerClassName?: string;
    children: React.ReactNode;
    // FIXME: Change to React.forwardRef passing refs like this will create problems.
    scrollAreaReference?: React.RefObject<HTMLDivElement>;
}
export function SideNavigationLayoutContentBody(properties: SideNavigationLayoutContentBodyInterface) {
    // Render the component
    return (
        <ScrollArea
            ref={properties.scrollAreaReference}
            containerClassName={mergeClassNames('mt-16 h-full', properties.containerClassName)}
        >
            {/* This child div is necessary for easily managing multiple page layouts */}
            <div className={properties.className}>{properties.children}</div>
        </ScrollArea>
    );
}

// Export - Default
export default SideNavigationLayoutContentBody;
