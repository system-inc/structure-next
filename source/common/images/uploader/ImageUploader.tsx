'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ImageSelector } from '../selector/ImageSelector';
import { ImageUploaderBase } from './ImageUploaderBase';

// Component - ImageUploader
export interface ImageUploaderProperties {
    className?: string;
    children?: React.ReactNode;
    buttonVariant?: 'primary' | 'default' | 'destructive';
    buttonSize?: 'default' | 'sm' | 'lg';
    uploadUrl: string;
    uploadHttpMethod?: 'POST' | 'PUT';
    uploadHeaders?: Record<string, string>;
    withCredentials?: boolean; // Include credentials for cross-origin requests
    variant?: 'Button' | 'DropZone' | 'Simple';
    maximumFileSizeInBytes?: number;
    accept?: string; // File input accept attribute
    allowMultipleFileSelection?: boolean; // Allow multiple file selection
    hideSuccessMessage?: boolean;
    onSuccess?: (response: Response) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
    processFile?: (file: File) => Promise<Blob | File>;
}
export function ImageUploader(properties: ImageUploaderProperties) {
    // State
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);

    // Handle file selection
    function handleFileSelected(file: File) {
        if(properties.allowMultipleFileSelection) {
            setSelectedFiles(function (prev) {
                return [...prev, file];
            });
        }
        else {
            setSelectedFiles([file]);
        }
    }

    // Handle upload success
    function handleUploadSuccess(response: Response) {
        setUploadSuccess(true);
        properties.onSuccess?.(response);

        // Reset success message after a delay
        setTimeout(function () {
            setUploadSuccess(false);
        }, 3000);
    }

    // Handle upload error
    function handleUploadError(error: Error) {
        properties.onError?.(error);
    }

    // Clear selected files
    function clearSelectedFiles() {
        setSelectedFiles([]);
    }

    // Render the component
    return (
        <div className={properties.className || ''}>
            <ImageSelector
                onFileSelected={handleFileSelected}
                maximumFileSizeInBytes={properties.maximumFileSizeInBytes}
                accept={properties.accept}
                allowMultipleFileSelection={properties.allowMultipleFileSelection}
                variant={properties.variant || 'Button'}
                buttonVariant={properties.buttonVariant || 'primary'}
                buttonSize={properties.buttonSize || 'default'}
            >
                {properties.children}
            </ImageSelector>

            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 text-sm">
                        {selectedFiles.length === 1 && selectedFiles[0]
                            ? `Selected: ${selectedFiles[0].name}`
                            : `Selected ${selectedFiles.length} files`}
                    </p>

                    <ImageUploaderBase
                        uploadUrl={properties.uploadUrl}
                        uploadHttpMethod={properties.uploadHttpMethod || 'POST'}
                        uploadHeaders={properties.uploadHeaders || {}}
                        onUploadProgress={properties.onProgress}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        withCredentials={properties.withCredentials !== undefined ? properties.withCredentials : true}
                    >
                        {function (childProperties) {
                            return (
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="primary"
                                            onClick={async function () {
                                                try {
                                                    // Process and upload each file
                                                    for(const file of selectedFiles) {
                                                        const processedFile = properties.processFile
                                                            ? await properties.processFile(file)
                                                            : file;
                                                        await childProperties.upload(processedFile);
                                                    }

                                                    // Clear the selected files after successful upload
                                                    clearSelectedFiles();
                                                } catch {
                                                    // Error will be handled by the onUploadError callback
                                                }
                                            }}
                                            loading={childProperties.isUploading}
                                            disabled={childProperties.isUploading}
                                        >
                                            {childProperties.isUploading
                                                ? `Uploading ${childProperties.progress}%`
                                                : 'Upload'}
                                        </Button>

                                        <Button
                                            variant="default"
                                            onClick={clearSelectedFiles}
                                            disabled={childProperties.isUploading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    {/* Progress bar */}
                                    {childProperties.isUploading && childProperties.progress > 0 && (
                                        <div className="bg-neutral-200 dark:bg-neutral-700 mt-2 h-2 w-full overflow-hidden rounded-full">
                                            <div
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${childProperties.progress}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {childProperties.error && (
                                        <Alert variant="error" className="mt-2">
                                            {childProperties.error.message}
                                        </Alert>
                                    )}

                                    {/* Success message */}
                                    {!properties.hideSuccessMessage && uploadSuccess && (
                                        <Alert variant="success" className="mt-2">
                                            Upload successful!
                                        </Alert>
                                    )}
                                </div>
                            );
                        }}
                    </ImageUploaderBase>
                </div>
            )}
        </div>
    );
}
