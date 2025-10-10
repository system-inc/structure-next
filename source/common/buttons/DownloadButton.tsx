// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/common/notifications/Notice';
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import DownloadIcon from '@structure/assets/icons/interface/DownloadIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { downloadFile } from '@structure/source/utilities/File';

// Interface - DownloadButtonInterface
export interface DownloadButtonInterface extends Omit<ButtonProperties, 'type'> {
    fileName?: string;
    fileExtension?: string;
    notice?: Omit<NoticeInterface, 'id'>;
}

// Interface - DownloadDataButtonInterface
export interface DownloadDataButtonInterface extends DownloadButtonInterface {
    type: 'data';
    data: string | Blob | File;
}

// Interface - DownloadUrlButtonInterface
export interface DownloadUrlButtonInterface extends DownloadButtonInterface {
    type: 'url';
    url: string;
}

// Component - DownloadButton
export type DownloadButtonProperties = DownloadDataButtonInterface | DownloadUrlButtonInterface;
export function DownloadButton(properties: DownloadButtonProperties) {
    // Hooks
    const notice = useNotice();

    // State
    const [downloadStarted, setDownloadStarted] = React.useState(false);

    // Function to initiate the download
    const onDownload = function () {
        // Build the filename
        const fileName = `${properties.fileName || 'download'}${
            properties.fileExtension ? `.${properties.fileExtension}` : '.txt'
        }`;

        // Use the downloadFile utility
        if(properties.type === 'data') {
            downloadFile({
                fileName: fileName,
                content: properties.data,
                contentType: 'application/octet-stream',
            });
        }
        else if(properties.type === 'url') {
            downloadFile({
                fileName: fileName,
                url: properties.url,
            });
        }

        // Update the state
        setDownloadStarted(true);

        // Show a notice if provided
        if(properties.notice) {
            notice.addNotice(properties.notice);
        }

        // Reset the state after a delay
        setTimeout(function () {
            setDownloadStarted(false);
        }, 1000);
    };

    // Render the component
    return (
        <Button
            className={`${
                downloadStarted
                    ? 'text-emerald-500 hover:text-emerald-500'
                    : 'dark:text-neutral+6 text-neutral hover:text-dark dark:hover:text-light'
            } ${properties.className}`}
            onClick={onDownload}
            icon={downloadStarted ? CheckCircledIcon : DownloadIcon}
            // iconClassName={downloadStarted ? 'h-4 w-4' : 'h-4 w-4 p-[1px]'}
            // {...buttonProperties}
            tip={properties.tip}
            variant={properties.variant || 'unstyled'}
            size={properties.size || 'unstyled'}
            iconClassName={mergeClassNames('h-4 w-4', properties.iconClassName)}
        />
    );
}
