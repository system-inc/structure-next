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

    // Get variant-specific body classes (undefined if no variant)
    const variantBodyClasses = dialogContext.variant
        ? dialogContext.dialogTheme.variantBodyClasses?.[dialogContext.variant]
        : undefined;

    const bodyClassName = mergeClassNames(
        dialogContext.dialogTheme.configuration.bodyBaseClasses,
        variantBodyClasses,
        properties.className,
    );

    // Mobile
    if(dialogContext.isMobile) {
        return <div className={bodyClassName}>{properties.children}</div>;
    }

    // Desktop with ScrollArea
    return (
        <ScrollArea className={mergeClassNames('max-h-[75vh]', properties.scrollAreaClassName)}>
            <div className={bodyClassName}>{properties.children}</div>
        </ScrollArea>
    );
}
