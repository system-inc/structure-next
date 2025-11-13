'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import type { ButtonVariant, ButtonSize } from '@structure/source/components/buttons/ButtonTheme';
import { Alert } from '@structure/source/components/notifications/Alert';
import { ImageSelector } from '../selector/ImageSelector';
import { ImageUploaderBase } from './ImageUploaderBase';

// Component - ImageUploader
export interface ImageUploaderProperties {
    className?: string;
    children?: React.ReactNode;
    buttonVariant?: ButtonVariant;
    buttonSize?: ButtonSize;
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
                buttonVariant={properties.buttonVariant || 'A'}
                buttonSize={properties.buttonSize || 'Small'}
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
                                            variant="A"
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
                                            isLoading={childProperties.isUploading}
                                            disabled={childProperties.isUploading}
                                        >
                                            {childProperties.isUploading
                                                ? `Uploading ${childProperties.progress}%`
                                                : 'Upload'}
                                        </Button>

                                        <Button
                                            variant="A"
                                            onClick={clearSelectedFiles}
                                            disabled={childProperties.isUploading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    {/* Progress bar */}
                                    {childProperties.isUploading && childProperties.progress > 0 && (
                                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                                            <div
                                                className="h-full rounded-full bg-blue-500"
                                                style={{ width: `${childProperties.progress}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {childProperties.error && (
                                        <Alert variant="Negative" className="mt-2">
                                            {childProperties.error.message}
                                        </Alert>
                                    )}

                                    {/* Success message */}
                                    {!properties.hideSuccessMessage && uploadSuccess && (
                                        <Alert variant="Positive" className="mt-2">
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
