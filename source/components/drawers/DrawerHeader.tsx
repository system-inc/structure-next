// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerHeader
export interface DrawerHeaderProperties {
    className?: string;
    children: React.ReactNode;
}
export function DrawerHeader(properties: DrawerHeaderProperties) {
    // Render the component - children becomes the title
    return (
        <div className={mergeClassNames('shrink-0 px-6 pt-6 pb-4', properties.className)}>
            {typeof properties.children === 'string' ? (
                <VaulDrawer.Title asChild>
                    <div className="font-medium">{properties.children}</div>
                </VaulDrawer.Title>
            ) : (
                <VaulDrawer.Title asChild>{properties.children}</VaulDrawer.Title>
            )}
        </div>
    );
}
