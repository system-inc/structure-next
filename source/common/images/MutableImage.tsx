// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import Dialog from '@structure/source/common/dialogs/Dialog';
import ContextMenu from '@structure/source/common/menus/ContextMenu';
import PopoverMenu from '@structure/source/common/popovers/PopoverMenu';

// Dependencies - Assets
import WarningIcon from '@structure/assets/icons/status/WarningIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - MutableImage
export interface MutableImageInterface {
    className?: string;
    children?: React.ReactNode;
    imageUrl?: string;
    imageUploadUrl: string;
    imageUploadHttpMethod?: 'POST' | 'PUT';
    imageUploadHeaders?: Record<string, string>;
    imageDeleteUrl?: string;
    imageDeleteHttpMethod?: 'POST' | 'DELETE';
    imageDeleteHeaders?: Record<string, string>;
    minimumImageSizeInBytes?: number;
    maximumImageSizeInBytes?: number;
    minimumImageWidth?: number;
    maximumImageWidth?: number;
    minimumImageHeight?: number;
    maximumImageHeight?: number;
}
export function MutableImage(properties: MutableImageInterface) {
    // Prepare the content
    let content = properties.children;
    if(!content && properties.imageUrl) {
        content = <Image src={properties.imageUrl} alt="Image" />;
    }

    // Render the component
    return (
        // <ContextMenu
        //     items={[
        //         {
        //             content: 'Upload Image',
        //         },
        //         {
        //             content: 'Delete Image',
        //         },
        //     ]}
        // >
        //     <div className={mergeClassNames('', properties.className)}>{content}</div>
        // </ContextMenu>
        <PopoverMenu
            className={mergeClassNames('', properties.className)}
            items={[
                {
                    content: 'Upload Image',
                },
                {
                    content: 'Delete Image',
                },
            ]}
        >
            <div className={mergeClassNames('', properties.className)}>{content}</div>
        </PopoverMenu>
    );
}

// Export - Default
export default MutableImage;
