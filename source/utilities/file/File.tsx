// Dependencies - React
import React from 'react';

// Dependencies - Assets
import {
    FileIcon,
    FilePdfIcon,
    ImageIcon,
    MicrosoftExcelLogoIcon,
    MicrosoftPowerpointLogoIcon,
    MicrosoftWordLogoIcon,
    VideoIcon,
    WaveformIcon,
} from '@phosphor-icons/react';

// Function to determine if a file is an image
export function isImageFile(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
}

// Function to get the appropriate icon component for a file type
export function iconForFileType(fileType: string): React.FunctionComponent<React.SVGProps<SVGSVGElement>> {
    switch(true) {
        case fileType.includes('image'):
            return ImageIcon;
        case fileType.includes('pdf'):
            return FilePdfIcon;
        case fileType.includes('audio'):
            return WaveformIcon;
        case fileType.includes('video'):
            return VideoIcon;
        case fileType.includes('word'):
            return MicrosoftWordLogoIcon;
        case fileType.includes('excel'):
            return MicrosoftExcelLogoIcon;
        case fileType.includes('powerpoint'):
            return MicrosoftPowerpointLogoIcon;
        default:
            return FileIcon;
    }
}

// Type for download input - can be string content, Blob, or File
export type DownloadableData = string | Blob | File;

// Interface for download options
export interface DownloadFileOptions {
    fileName: string;
    content?: DownloadableData; // For data downloads
    url?: string; // For URL downloads
    contentType?: string; // MIME type (only used when content is a string)
}

// Function to download a file in the browser
export function downloadFile(options: DownloadFileOptions): void {
    const fileName = options.fileName;
    const fileContent = options.content;
    const fileUrl = options.url;
    const mimeType = options.contentType;

    // Create a temporary link element
    const link = document.createElement('a');

    // Set the href based on whether we have content or a URL
    if(fileUrl) {
        // URL download
        link.href = fileUrl;
    }
    else if(fileContent !== undefined) {
        // Data download - create a Blob URL
        let blob: Blob;

        if(typeof fileContent === 'string') {
            // String content - create Blob with specified content type
            blob = new Blob([fileContent], { type: mimeType || 'application/octet-stream' });
        }
        else {
            // Already a Blob or File
            blob = fileContent;
        }

        link.href = URL.createObjectURL(blob);
    }
    else {
        throw new Error('Either content or url must be provided');
    }

    // Set the download attribute with the filename
    link.download = fileName;

    // Append the link to the document body, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the Blob URL if we created one
    if(fileContent !== undefined && !fileUrl) {
        URL.revokeObjectURL(link.href);
    }
}

// Function to format file size in bytes to human-readable format
export function formatFileSize(bytes: number): string {
    // Handle zero bytes case
    if(bytes === 0) return '0 B';

    // Base for binary calculations (1024 bytes = 1 KB)
    const base = 1024;

    // Array of unit suffixes in ascending order
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    // Calculate which unit to use based on the size
    // Math.log gives us the power, Math.floor rounds down to the nearest integer
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

    // Convert bytes to the appropriate unit and format to 2 decimal places
    const value = bytes / Math.pow(base, unitIndex);
    const formattedValue = parseFloat(value.toFixed(2));

    return formattedValue + ' ' + units[unitIndex];
}
