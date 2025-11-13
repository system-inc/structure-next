'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogContent
export interface DialogContentProperties {
    className?: string;
    scrollAreaClassName?: string;
    children: React.ReactNode;
}
export function DialogContent(properties: DialogContentProperties) {
    const dialogContext = useDialogContext();

    // Mobile
    if(dialogContext.isMobile) {
        return (
            <div className={mergeClassNames('grow overflow-y-auto px-6', properties.className)}>
                {properties.children}
            </div>
        );
    }

    // Desktop
    return (
        <ScrollArea className={mergeClassNames('max-h-[75vh]', properties.scrollAreaClassName)}>
            <div className={mergeClassNames('px-8 py-6', properties.className)}>{properties.children}</div>
        </ScrollArea>
    );
}
