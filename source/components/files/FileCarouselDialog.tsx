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
            variant="FullScreenWithMargin"
            accessibilityTitle="File Carousel"
            open={properties.open}
            onOpenChange={properties.onOpenChange}
            className=""
            contentScrollAreaClassName="max-h-full"
            content={
                <FileCarousel
                    className={properties.className}
                    files={properties.files}
                    startIndex={properties.startIndex}
                />
            }
        />
    );
}
