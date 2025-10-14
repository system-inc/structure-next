'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Component - ImageUploadBase
export interface ImageUploaderBaseProperties {
    children: (properties: {
        upload: (file: Blob | File) => Promise<Response>;
        isUploading: boolean;
        progress: number;
        error: Error | null;
    }) => React.ReactNode;
    uploadUrl: string;
    uploadHttpMethod?: 'POST' | 'PUT';
    uploadHeaders?: Record<string, string>;
    withCredentials?: boolean; // Include credentials for cross-origin requests
    onUploadStart?: () => void;
    onUploadProgress?: (progress: number) => void;
    onUploadSuccess?: (response: Response) => void;
    onUploadError?: (error: Error) => void;
}
export function ImageUploaderBase(properties: ImageUploaderBaseProperties) {
    // State
    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [error, setError] = React.useState<Error | null>(null);

    // Function to handle file upload
    async function upload(file: Blob | File): Promise<Response> {
        setIsUploading(true);
        setProgress(0);
        setError(null);

        // Call the onUploadStart callback if provided
        properties.onUploadStart?.();

        try {
            // Get upload method with default
            const uploadMethod = properties.uploadHttpMethod || 'POST';

            // Get upload headers with default
            const uploadHeaders = properties.uploadHeaders || {};

            // Create headers object with content type
            const headers = {
                // Set content type based on the file (if it's a File object)
                'Content-Type': file instanceof File ? file.type : 'application/octet-stream',
                ...uploadHeaders,
            };

            // Use XMLHttpRequest for progress tracking
            const xmlHttpRequest = new XMLHttpRequest();

            // Create a promise to handle the XHR response
            const uploadPromise = new Promise<Response>(function (resolve, reject) {
                // Set up progress tracking
                xmlHttpRequest.upload.addEventListener('progress', function (event) {
                    if(event.lengthComputable) {
                        const progressPercent = Math.round((event.loaded / event.total) * 100);
                        setProgress(progressPercent);
                        properties.onUploadProgress?.(progressPercent);
                    }
                });

                // Handle completion
                xmlHttpRequest.addEventListener('load', function () {
                    if(xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 300) {
                        // Create a Response object from the XHR response
                        const response = new Response(xmlHttpRequest.response, {
                            status: xmlHttpRequest.status,
                            statusText: xmlHttpRequest.statusText,
                            headers: new Headers(
                                xmlHttpRequest
                                    .getAllResponseHeaders()
                                    .split('\r\n')
                                    .filter(Boolean)
                                    .reduce(function (acc: Record<string, string>, header) {
                                        // Parse the header safely
                                        const parts = header.split(': ');
                                        if(parts.length >= 2) {
                                            const name = parts[0];
                                            // Join the remaining parts for the value (in case value contains colons)
                                            const value = parts.slice(1).join(': ');
                                            // Only add to the record if name is defined and not null
                                            if(name && name.length > 0) {
                                                acc[name] = value;
                                            }
                                        }
                                        return acc;
                                    }, {}),
                            ),
                        });

                        properties.onUploadSuccess?.(response);
                        resolve(response);
                    }
                    else {
                        const error = new Error(`Upload failed with status ${xmlHttpRequest.status}`);
                        properties.onUploadError?.(error);
                        reject(error);
                    }
                });

                // Handle errors
                xmlHttpRequest.addEventListener('error', function () {
                    const error = new Error('Network error occurred during upload');
                    properties.onUploadError?.(error);
                    reject(error);
                });

                // Handle timeouts
                xmlHttpRequest.addEventListener('timeout', function () {
                    const error = new Error('Upload timeout');
                    properties.onUploadError?.(error);
                    reject(error);
                });

                // Handle aborts
                xmlHttpRequest.addEventListener('abort', function () {
                    const error = new Error('Upload aborted');
                    properties.onUploadError?.(error);
                    reject(error);
                });
            });

            // Open and send the request
            xmlHttpRequest.open(uploadMethod, properties.uploadUrl, true);

            // Set withCredentials if specified
            xmlHttpRequest.withCredentials =
                properties.withCredentials !== undefined ? properties.withCredentials : true;

            // Set request headers
            Object.entries(headers).forEach(function ([key, value]) {
                xmlHttpRequest.setRequestHeader(key, value);
            });

            // Send the file
            xmlHttpRequest.send(file);

            // Wait for the upload to complete
            const response = await uploadPromise;
            return response;
        }
        catch(error) {
            // Handle any errors not caught by the XHR listeners
            const uploadError = error instanceof Error ? error : new Error('Unknown upload error');
            setError(uploadError);
            throw uploadError;
        } finally {
            // Reset the uploading state
            setIsUploading(false);
        }
    }

    // Render the component using the render prop pattern
    return (
        <>
            {properties.children({
                upload,
                isUploading,
                progress,
                error,
            })}
        </>
    );
}
