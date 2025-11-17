// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerFooter
export interface DrawerFooterProperties {
    className?: string;
    children?: React.ReactNode;
}
export function DrawerFooter(properties: DrawerFooterProperties) {
    // Render the component
    // Note: Footer sits outside the scrollable content area in DrawerContent
    return <div className={mergeClassNames('background--0', properties.className)}>{properties.children}</div>;
}
