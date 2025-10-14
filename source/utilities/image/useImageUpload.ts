'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { cropImage, resizeImage } from '@structure/source/utilities/image/ImageFile';

// Dependencies - Types
import { CropArea, ResizeOptions } from '@structure/source/utilities/image/Image';

// Interface - UseImageUploadOptions
interface UseImageUploadOptions {
    url: string;
    httpMethod?: 'POST' | 'PUT';
    headers?: Record<string, string>;
    withCredentials?: boolean; // Include credentials for cross-origin requests
    autoUpload?: boolean; // Auto-upload when a file is selected
    outputFormat?: 'jpeg' | 'png'; // Format for image output (if processing is used)
    outputQuality?: number; // Quality for image output (0.0 to 1.0)
    maximumOutputSizeInBytes?: number;
    onSuccess?: (response: Response) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
}

// Interface - UseImageUploadReturn
interface UseImageUploadReturn {
    file: File | null;
    isUploading: boolean;
    progress: number; // Upload progress (0-100)
    error: Error | null; // Error if one occurred
    response: Response | null; // Response from the server
    selectFile: (file: File) => void; // Select a file for upload (can trigger auto-upload)
    clearFile: () => void; // Clear the selected file and reset state
    upload: () => Promise<Response | null>; // Upload the currently selected file
    // Process and upload the file with cropping
    cropAndUpload: (cropOptions: CropArea) => Promise<Response | null>;
    // Process and upload the file with resizing
    resizeAndUpload: (resizeOptions: ResizeOptions) => Promise<Response | null>;
    // Process and upload the file with both cropping and resizing
    processAndUpload: (cropOptions: CropArea, resizeOptions?: ResizeOptions) => Promise<Response | null>;
    // Abort the current upload
    abort: () => void;
}

// Hook - useImageUpload
// Hook for handling image uploads with optional processing (crop, resize)
export function useImageUpload(options: UseImageUploadOptions): UseImageUploadReturn {
    // Extract options with defaults
    const method = options.httpMethod || 'POST';
    const withCredentials = options.withCredentials !== undefined ? options.withCredentials : true;
    const autoUpload = options.autoUpload !== undefined ? options.autoUpload : false;
    const outputFormat = options.outputFormat || 'jpeg';
    const outputQuality = options.outputQuality !== undefined ? options.outputQuality : 0.9;
    const maxOutputSizeBytes =
        options.maximumOutputSizeInBytes !== undefined ? options.maximumOutputSizeInBytes : 1024 * 1024; // 1MB default

    // State
    const [file, setFile] = React.useState<File | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [error, setError] = React.useState<Error | null>(null);
    const [response, setResponse] = React.useState<Response | null>(null);

    // Refs
    const abortControllerReference = React.useRef<AbortController | null>(null);

    // Reset state
    const resetState = React.useCallback(function () {
        setProgress(0);
        setError(null);
        setResponse(null);
    }, []);

    // Clear file and reset state
    const clearFile = React.useCallback(
        function () {
            setFile(null);
            resetState();
        },
        [resetState],
    );

    // Abort current upload
    const abort = React.useCallback(function () {
        if(abortControllerReference.current) {
            abortControllerReference.current.abort();
            abortControllerReference.current = null;
        }
    }, []);

    // Basic upload function
    const uploadBlob = React.useCallback(
        async function (blob: Blob | File): Promise<Response | null> {
            setIsUploading(true);
            setProgress(0);
            setError(null);
            setResponse(null);

            // Create a new abort controller
            abortControllerReference.current = new AbortController();

            try {
                // Use XMLHttpRequest for progress tracking
                const xmlHttpRequest = new XMLHttpRequest();

                // Create a promise to handle the XHR response
                const uploadPromise = new Promise<Response>(function (resolve, reject) {
                    // Set up progress tracking
                    xmlHttpRequest.upload.addEventListener('progress', function (event) {
                        if(event.lengthComputable) {
                            const progressPercent = Math.round((event.loaded / event.total) * 100);
                            setProgress(progressPercent);
                            options.onProgress?.(progressPercent);
                        }
                    });

                    // Handle completion
                    xmlHttpRequest.addEventListener('load', function () {
                        if(xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 300) {
                            // Create a Response object from the XHR response
                            const uploadResponse = new Response(xmlHttpRequest.response, {
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

                            setResponse(uploadResponse);
                            options.onSuccess?.(uploadResponse);
                            resolve(uploadResponse);
                        }
                        else {
                            const uploadError = new Error(`Upload failed with status ${xmlHttpRequest.status}`);
                            setError(uploadError);
                            options.onError?.(uploadError);
                            reject(uploadError);
                        }
                    });

                    // Handle errors
                    xmlHttpRequest.addEventListener('error', function () {
                        const uploadError = new Error('Network error occurred during upload');
                        setError(uploadError);
                        options.onError?.(uploadError);
                        reject(uploadError);
                    });

                    // Handle timeouts
                    xmlHttpRequest.addEventListener('timeout', function () {
                        const uploadError = new Error('Upload timeout');
                        setError(uploadError);
                        options.onError?.(uploadError);
                        reject(uploadError);
                    });

                    // Handle aborts
                    xmlHttpRequest.addEventListener('abort', function () {
                        const uploadError = new Error('Upload aborted');
                        setError(uploadError);
                        options.onError?.(uploadError);
                        reject(uploadError);
                    });
                });

                // Open and send the request
                xmlHttpRequest.open(method, options.url, true);

                // Set withCredentials if specified
                xmlHttpRequest.withCredentials = withCredentials;

                // Set content type based on the file
                const contentType = blob instanceof File ? blob.type : 'application/octet-stream';

                // Set request headers
                Object.entries({ 'Content-Type': contentType, ...options.headers }).forEach(function (entry) {
                    const [key, value] = entry;
                    xmlHttpRequest.setRequestHeader(key, value);
                });

                // Send the file
                xmlHttpRequest.send(blob);

                // Wait for the upload to complete
                const uploadResponse = await uploadPromise;
                return uploadResponse;
            }
            catch(err) {
                // Handle any errors not caught by the XHR listeners
                if(err instanceof Error && err.name !== 'AbortError') {
                    const uploadError = err;
                    setError(uploadError);
                    options.onError?.(uploadError);
                }
                return null;
            } finally {
                // Reset the uploading state and abort controller
                setIsUploading(false);
                abortControllerReference.current = null;
            }
        },
        [method, withCredentials, options],
    );

    // Select a file and optionally upload it
    const selectFile = React.useCallback(
        function (selectedFile: File) {
            setFile(selectedFile);
            resetState();

            if(autoUpload) {
                uploadBlob(selectedFile);
            }
        },
        [autoUpload, resetState, uploadBlob],
    );

    // Upload the current file
    const upload = React.useCallback(
        async function (): Promise<Response | null> {
            if(!file) {
                setError(new Error('No file selected'));
                return null;
            }

            return uploadBlob(file);
        },
        [file, uploadBlob],
    );

    // Process and upload with cropping
    const cropAndUpload = React.useCallback(
        async function (cropOptions: CropArea): Promise<Response | null> {
            if(!file) {
                setError(new Error('No file selected'));
                return null;
            }

            try {
                setIsUploading(true);

                // Crop the image
                const croppedImage = await cropImage(file, cropOptions, {
                    format: outputFormat,
                    quality: outputQuality,
                    maxSizeBytes: maxOutputSizeBytes,
                });

                // Upload the cropped image
                return uploadBlob(croppedImage);
            }
            catch(err) {
                const processingError = err instanceof Error ? err : new Error('Image processing failed');
                setError(processingError);
                options.onError?.(processingError);
                return null;
            }
        },
        [file, outputFormat, outputQuality, maxOutputSizeBytes, uploadBlob, options],
    );

    // Process and upload with resizing
    const resizeAndUpload = React.useCallback(
        async function (resizeOptions: ResizeOptions): Promise<Response | null> {
            if(!file) {
                setError(new Error('No file selected'));
                return null;
            }

            try {
                setIsUploading(true);

                // Resize the image
                const resizedImage = await resizeImage(file, resizeOptions, {
                    format: outputFormat,
                    quality: outputQuality,
                    maxSizeBytes: maxOutputSizeBytes,
                });

                // Upload the resized image
                return uploadBlob(resizedImage);
            }
            catch(err) {
                const processingError = err instanceof Error ? err : new Error('Image processing failed');
                setError(processingError);
                options.onError?.(processingError);
                return null;
            }
        },
        [file, outputFormat, outputQuality, maxOutputSizeBytes, uploadBlob, options],
    );

    // Process and upload with both cropping and resizing
    const processAndUpload = React.useCallback(
        async function (cropOptions: CropArea, resizeOptions?: ResizeOptions): Promise<Response | null> {
            if(!file) {
                setError(new Error('No file selected'));
                return null;
            }

            try {
                setIsUploading(true);

                // First crop the image
                const croppedImage = await cropImage(file, cropOptions, {
                    format: outputFormat,
                    quality: outputQuality,
                    maxSizeBytes: maxOutputSizeBytes,
                });

                // Then resize if needed
                if(resizeOptions) {
                    const resizedImage = await resizeImage(URL.createObjectURL(croppedImage), resizeOptions, {
                        format: outputFormat,
                        quality: outputQuality,
                        maxSizeBytes: maxOutputSizeBytes,
                    });

                    // Upload the resized image
                    return uploadBlob(resizedImage);
                }

                // Upload the cropped image
                return uploadBlob(croppedImage);
            }
            catch(err) {
                const processingError = err instanceof Error ? err : new Error('Image processing failed');
                setError(processingError);
                options.onError?.(processingError);
                return null;
            }
        },
        [file, outputFormat, outputQuality, maxOutputSizeBytes, uploadBlob, options],
    );

    return {
        file,
        isUploading,
        progress,
        error,
        response,
        selectFile,
        clearFile,
        upload,
        cropAndUpload,
        resizeAndUpload,
        processAndUpload,
        abort,
    };
}
