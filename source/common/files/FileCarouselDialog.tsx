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
            variant="unstyled"
            open={properties.open}
            onOpenChange={properties.onOpenChange}
            content={
                <div className="min-h-[300px] min-w-[300px] rounded-lg bg-background p-6">
                    <FileCarousel
                        files={properties.files}
                        className={properties.className}
                        startIndex={properties.startIndex}
                    />
                </div>
            }
        />
    );
}

export default FileCarouselDialog;
