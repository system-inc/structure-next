'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';

// Dependencies - Context
import { useDialogContext } from './DialogContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DialogContent
export interface DialogContentProperties {
    className?: string;
    scrollAreaClassName?: string;
    accessibilityDescription: string; // Required for accessibility, can be empty string if title is self-explanatory
    children: React.ReactNode;
}
export function DialogContent(properties: DialogContentProperties) {
    const dialogContext = useDialogContext();

    // Use Radix description element for accessibility for both mobile drawer and desktop dialog
    const accessibilityDescriptionElement = properties.accessibilityDescription ? (
        <RadixDialog.Description className="sr-only">{properties.accessibilityDescription}</RadixDialog.Description>
    ) : null;

    // Mobile
    if(dialogContext.isMobile) {
        return (
            <>
                {accessibilityDescriptionElement}
                <div className={mergeClassNames('grow overflow-y-auto px-6', properties.className)}>
                    {properties.children}
                </div>
            </>
        );
    }

    // Desktop
    return (
        <>
            {accessibilityDescriptionElement}
            <ScrollArea className={mergeClassNames('max-h-[75vh]', properties.scrollAreaClassName)}>
                <div className={properties.className}>{properties.children}</div>
            </ScrollArea>
        </>
    );
}
