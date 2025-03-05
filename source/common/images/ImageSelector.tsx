'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Assets
import ImageIcon from '@structure/assets/icons/content/ImageIcon.svg';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { ButtonVariants } from '@structure/source/common/buttons/ButtonVariants';
import { ButtonSizes } from '@structure/source/common/buttons/ButtonSizes';
import { Alert } from '@structure/source/common/notifications/Alert';

// Dependencies - Utilities
import { isImageFile } from '@structure/source/utilities/images/ImageProcessing';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ImageSelector
export interface ImageSelectorInterface {
    className?: string;
    children?: React.ReactNode;
    variant?: 'Button' | 'DropZone' | 'Simple';
    buttonVariant?: keyof typeof ButtonVariants;
    buttonSize?: keyof typeof ButtonSizes;
    accept?: string; // e.g., "image/*" or ".jpg,.png"
    maximumFileSizeInBytes?: number;
    allowMultipleFileSelection?: boolean;
    onFileSelected: (file: File) => void;
}
export function ImageSelector(properties: ImageSelectorInterface) {
    // References
    const fileInputReference = React.useRef<HTMLInputElement>(null);

    // State
    const [dragActive, setDragActive] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Handle click to trigger file input
    function handleClick() {
        if(fileInputReference.current) {
            fileInputReference.current.click();
        }
    }

    // Handle file selection from input
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if(!files || files.length === 0) return;

        const isMultiple =
            properties.allowMultipleFileSelection !== undefined ? properties.allowMultipleFileSelection : false;
        const selectedFiles = isMultiple ? Array.from(files) : [files[0]];

        // Ensure no undefined values
        processFiles(
            selectedFiles.filter(function (file): file is File {
                return file !== undefined;
            }),
        );

        // Reset the input value so the same file can be selected again
        event.target.value = '';
    }

    // Handle drag events
    function handleDrag(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();

        if(event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        }
        else if(event.type === 'dragleave') {
            setDragActive(false);
        }
    }

    // Handle drop event
    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const droppedFiles = event.dataTransfer.files;
        if(!droppedFiles || droppedFiles.length === 0) return;

        const isMultiple =
            properties.allowMultipleFileSelection !== undefined ? properties.allowMultipleFileSelection : false;
        const selectedFiles = isMultiple ? Array.from(droppedFiles) : [droppedFiles[0]];
        // Ensure no undefined values
        processFiles(
            selectedFiles.filter(function (file): file is File {
                return file !== undefined;
            }),
        );
    }

    // Process selected files
    function processFiles(files: File[]) {
        setError(null);

        // Filter for image files and ensure they're defined
        const imageFiles = files.filter(function (file): file is File {
            return file !== undefined && isImageFile(file);
        });

        if(imageFiles.length === 0) {
            setError('Please select valid image files.');
            return;
        }

        // Get maximum file size with default
        const maxFileSize =
            properties.maximumFileSizeInBytes !== undefined ? properties.maximumFileSizeInBytes : 10 * 1024 * 1024; // 10MB default

        // Check file size
        const oversizedFiles = imageFiles.filter(function (file) {
            return file.size > maxFileSize;
        });

        if(oversizedFiles.length > 0) {
            setError(`File size exceeds the maximum allowed (${Math.round(maxFileSize / 1024 / 1024)}MB).`);
            return;
        }

        // Handle selected files
        if(imageFiles.length > 0) {
            const isMultiple =
                properties.allowMultipleFileSelection !== undefined ? properties.allowMultipleFileSelection : false;

            if(isMultiple) {
                imageFiles.forEach(function (file) {
                    properties.onFileSelected(file);
                });
            }
            else if(imageFiles[0]) {
                // Extra check to ensure file is defined
                properties.onFileSelected(imageFiles[0]);
            }
        }
    }

    // Render variant: Simple
    if(properties.variant === 'Simple') {
        return (
            <div className={properties.className}>
                <input
                    type="file"
                    ref={fileInputReference}
                    accept={properties.accept || 'image/*'}
                    multiple={properties.allowMultipleFileSelection}
                    onChange={handleFileChange}
                    className="border-neutral-200 dark:border-neutral-700 w-full cursor-pointer rounded-md border bg-transparent p-2 text-sm"
                />
                {error && (
                    <Alert variant="error" className="mt-2">
                        {error}
                    </Alert>
                )}
            </div>
        );
    }

    // Render variant: Button
    if(properties.variant === 'Button') {
        return (
            <div className={properties.className}>
                <input
                    type="file"
                    ref={fileInputReference}
                    accept={properties.accept || 'image/*'}
                    multiple={properties.allowMultipleFileSelection}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button
                    variant={properties.buttonVariant || 'primary'}
                    size={properties.buttonSize || 'default'}
                    onClick={handleClick}
                    icon={properties.children ? undefined : ImageIcon}
                >
                    {properties.children || 'Select Image'}
                </Button>
                {error && (
                    <Alert variant="error" className="mt-2">
                        {error}
                    </Alert>
                )}
            </div>
        );
    }

    // Get maximum file size with default
    const maximumFileSizeInBytes =
        properties.maximumFileSizeInBytes !== undefined ? properties.maximumFileSizeInBytes : 10 * 1024 * 1024; // 10MB default
    const acceptType = properties.accept || 'image/*';
    const isMultiple =
        properties.allowMultipleFileSelection !== undefined ? properties.allowMultipleFileSelection : false;

    // Render variant: DropZone (default)
    return (
        <div className={properties.className}>
            <input
                type="file"
                ref={fileInputReference}
                accept={acceptType}
                multiple={isMultiple}
                onChange={handleFileChange}
                className="hidden"
            />
            <div
                className={mergeClassNames(
                    'flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
                    dragActive
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                        : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600',
                )}
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <ImageIcon className="text-neutral-400 dark:text-neutral-500 mb-2 h-10 w-10" />
                    <p className="mb-1 text-sm font-medium">
                        {dragActive ? 'Drop files here' : 'Drag and drop files here or click to browse'}
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                        {isMultiple ? 'Upload images' : 'Upload an image'} {acceptType.replace('*', '')} (max{' '}
                        {Math.round(maximumFileSizeInBytes / 1024 / 1024)}MB)
                    </p>
                </div>
            </div>
            {error && (
                <Alert variant="error" className="mt-2">
                    {error}
                </Alert>
            )}
        </div>
    );
}

// Export - Default
export default ImageSelector;
