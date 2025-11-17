'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogHeader
export interface DialogHeaderProperties {
    className?: string;
    children: React.ReactNode;
}
export function DialogHeader(properties: DialogHeaderProperties) {
    const dialogContext = useDialogContext();

    // Render title content with proper wrapper
    const titleContent =
        typeof properties.children === 'string' ? (
            <div className="font-medium">{properties.children}</div>
        ) : (
            properties.children
        );

    // Mobile: Use Drawer.Header
    if(dialogContext.isMobile) {
        return (
            <Drawer.Header
                className={mergeClassNames(dialogContext.dialogTheme.configuration.headerClasses, properties.className)}
            >
                {titleContent}
            </Drawer.Header>
        );
    }

    // Desktop: Radix Dialog Title
    return (
        <div className={mergeClassNames(dialogContext.dialogTheme.configuration.headerClasses, properties.className)}>
            <RadixDialog.Title asChild>{titleContent}</RadixDialog.Title>
        </div>
    );
}
