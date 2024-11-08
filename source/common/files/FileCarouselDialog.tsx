// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { FileCarousel, FileCarouselInterface } from './FileCarousel';

// Component - FileCarouselDialog
export interface FileCarouselDialogInterface extends FileCarouselInterface {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    startIndex?: number;
}
export function FileCarouselDialog(properties: FileCarouselDialogInterface) {
    return (
        <Dialog
            variant="fullScreenWithMargin"
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

// Export - Default
export default FileCarouselDialog;
