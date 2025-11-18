// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { FileCarousel, FileCarouselProperties } from './FileCarousel';

// Component - FileCarouselDialog
export interface FileCarouselDialogProperties extends FileCarouselProperties {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    startIndex?: number;
}
export function FileCarouselDialog(properties: FileCarouselDialogProperties) {
    return (
        <Dialog
            variant="A"
            size="FullScreen"
            accessibilityTitle="File Carousel"
            accessibilityDescription="View and navigate through attached files"
            body={
                <FileCarousel
                    className={properties.className}
                    files={properties.files}
                    startIndex={properties.startIndex}
                />
            }
            open={properties.open}
            onOpenChange={properties.onOpenChange}
        />
    );
}
