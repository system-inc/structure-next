// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/components/notifications/Notice';
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import DownloadIcon from '@structure/assets/icons/interface/DownloadIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { downloadFile } from '@structure/source/utilities/file/File';

// Interface - DownloadButtonInterface
export interface DownloadButtonInterface extends NonLinkButtonProperties {
    fileName?: string;
    fileExtension?: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
}

// Interface - DownloadDataButtonInterface
export interface DownloadDataButtonInterface extends DownloadButtonInterface {
    downloadSource: 'Data';
    data: string | Blob | File;
}

// Interface - DownloadUrlButtonInterface
export interface DownloadUrlButtonInterface extends DownloadButtonInterface {
    downloadSource: 'Url';
    url: string;
}

// Component - DownloadButton
export type DownloadButtonProperties = DownloadDataButtonInterface | DownloadUrlButtonInterface;
export function DownloadButton({
    fileName,
    fileExtension,
    noticeData,
    className,
    downloadSource,
    ...buttonProperties
}: DownloadButtonProperties) {
    // Hooks
    const notice = useNotice();

    // State
    const [downloadStarted, setDownloadStarted] = React.useState(false);

    // Function to initiate the download
    const onDownload = function () {
        // Build the filename
        const builtFileName = `${fileName || 'download'}${fileExtension ? `.${fileExtension}` : '.txt'}`;

        // Use the downloadFile utility
        if(downloadSource === 'Data') {
            downloadFile({
                fileName: builtFileName,
                content: (buttonProperties as DownloadDataButtonInterface).data,
                contentType: 'application/octet-stream',
            });
        }
        else if(downloadSource === 'Url') {
            downloadFile({
                fileName: builtFileName,
                url: (buttonProperties as DownloadUrlButtonInterface).url,
            });
        }

        // Update the state
        setDownloadStarted(true);

        // Show a notice if provided
        if(noticeData) {
            notice.addNotice(noticeData);
        }

        // Reset the state after a delay
        setTimeout(function () {
            setDownloadStarted(false);
        }, 1000);
    };

    // Render the component
    const IconComponent = downloadStarted ? CheckCircledIcon : DownloadIcon;

    return (
        <Button
            className={mergeClassNames(
                downloadStarted
                    ? 'text-emerald-500 hover:text-emerald-500'
                    : 'hover:text-dark dark:hover:text-light foreground--c',
                className,
            )}
            icon={IconComponent}
            {...buttonProperties}
            onClick={onDownload}
        />
    );
}
