// Function to determine if a file is an image
export function isImageFile(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
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
