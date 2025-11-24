'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogBody
export interface DialogBodyProperties {
    className?: string;
    scrollAreaClassName?: string;
    children: React.ReactNode;
}
export function DialogBody(properties: DialogBodyProperties) {
    const dialogContext = useDialogContext();

    // Mobile
    if(dialogContext.isMobile) {
        return (
            <div className={mergeClassNames('grow overflow-y-auto', properties.className)}>{properties.children}</div>
        );
    }

    // Desktop
    return (
        <ScrollArea className={mergeClassNames('max-h-[75vh]', properties.scrollAreaClassName)}>
            <div className={properties.className}>{properties.children}</div>
        </ScrollArea>
    );
}
