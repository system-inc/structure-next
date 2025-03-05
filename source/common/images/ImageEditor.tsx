'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ImageCropper } from './ImageCropper';

// Dependencies - Utilities
import { CropArea, CropShape } from '@structure/source/utilities/images/Image';
import {
    createImagePreview,
    revokeImagePreview,
    cropImage,
    resizeImage,
} from '@structure/source/utilities/images/ImageProcessing';

// Types used internally by the component
interface ImageDimensions {
    width: number;
    height: number;
}

// Component - ImageEditor
export interface ImageEditorInterface {
    className?: string;
    image: File | string; // File or URL
    cropAspectRatio?: number;
    cropShape?: CropShape;
    allowResize?: boolean;
    minimumWidth?: number;
    maximumWidth?: number;
    minimumHeight?: number;
    maximumHeight?: number;
    outputFormat?: 'jpeg' | 'png';
    outputQuality?: number; // 0.0 to 1.0
    maximumOutputSizeInBytes?: number;
    onCancel?: () => void;
    onSave?: (imageBlob: Blob) => void;
}
export function ImageEditor(properties: ImageEditorInterface) {
    // References
    const lastPreviewUrlReference = React.useRef<string | null>(null);
    const temporaryUrlsReference = React.useRef<string[]>([]);

    // State
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [cropArea, setCropArea] = React.useState<CropArea | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [dimensions, setDimensions] = React.useState<ImageDimensions | null>(null);

    // Process options with defaults
    const outputOptions = React.useMemo(
        function () {
            return {
                format: properties.outputFormat || 'jpeg',
                quality: properties.outputQuality || 0.9,
                maxSizeBytes: properties.maximumOutputSizeInBytes || 1024 * 1024, // 1MB default
            };
        },
        [properties.outputFormat, properties.outputQuality, properties.maximumOutputSizeInBytes],
    );

    // Load image on mount and create preview URL
    React.useEffect(
        function () {
            let isMounted = true;

            // Create a preview URL if the image is a File
            async function setupImage() {
                try {
                    // Clean up any existing preview
                    if(lastPreviewUrlReference.current) {
                        revokeImagePreview(lastPreviewUrlReference.current);
                        lastPreviewUrlReference.current = null;
                    }

                    // Create new preview if needed
                    if(properties.image instanceof File) {
                        const url = createImagePreview(properties.image);
                        lastPreviewUrlReference.current = url;

                        if(isMounted) {
                            setPreviewUrl(url);
                        }
                    }
                    else {
                        if(isMounted) {
                            setPreviewUrl(properties.image);
                        }
                    }
                }
                catch(err) {
                    if(isMounted) {
                        setError(err instanceof Error ? err.message : 'Failed to load image');
                    }
                }
            }

            setupImage();

            // Reset state when image changes
            setCropArea(null);
            setError(null);
            setDimensions(null);

            // On unmount or when image changes
            return function () {
                isMounted = false;

                // Clean up preview URL
                if(lastPreviewUrlReference.current) {
                    revokeImagePreview(lastPreviewUrlReference.current);
                    lastPreviewUrlReference.current = null;
                }

                // Clean up any temporary URLs
                temporaryUrlsReference.current.forEach(function (url) {
                    URL.revokeObjectURL(url);
                });
                temporaryUrlsReference.current = [];
            };
        },
        [properties.image],
    );

    // Functions
    const handleCropChange = React.useCallback(function (area: CropArea) {
        setCropArea(area);
    }, []);

    const handleDimensionChange = React.useCallback(function (dimension: 'width' | 'height', value: string) {
        const integerValue = parseInt(value);

        if(isNaN(integerValue) || integerValue <= 0) {
            return;
        }

        setDimensions(function (prev) {
            if(!prev) {
                return {
                    width: dimension === 'width' ? integerValue : 0,
                    height: dimension === 'height' ? integerValue : 0,
                };
            }

            return {
                ...prev,
                [dimension]: integerValue,
            };
        });
    }, []);

    const handleSave = React.useCallback(
        async function () {
            if(!previewUrl || !cropArea) {
                setError('No image or crop area defined');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Process image (crop and optionally resize)
                let processedImage: Blob;

                // First crop the image
                processedImage = await cropImage(previewUrl, cropArea, outputOptions);

                // Then resize if needed
                if(properties.allowResize && dimensions && dimensions.width && dimensions.height) {
                    // Create a temporary object URL for the cropped image
                    const tempUrl = URL.createObjectURL(processedImage);
                    // Keep track of temporary URLs for cleanup
                    temporaryUrlsReference.current.push(tempUrl);

                    // Resize the image
                    processedImage = await resizeImage(
                        tempUrl,
                        {
                            width: dimensions.width,
                            height: dimensions.height,
                        },
                        outputOptions,
                    );

                    // Clean up the temporary URL immediately
                    URL.revokeObjectURL(tempUrl);
                    temporaryUrlsReference.current = temporaryUrlsReference.current.filter((url) => url !== tempUrl);
                }

                // Call the onSave callback with the processed image
                properties.onSave?.(processedImage);
            }
            catch(err) {
                setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
            } finally {
                setLoading(false);
            }
        },
        [previewUrl, cropArea, properties.allowResize, dimensions, properties.onSave, outputOptions],
    );

    // Render components
    const resizeControls = React.useMemo(
        function () {
            if(!properties.allowResize) return null;

            return (
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="width" className="mb-1 block text-sm font-medium">
                            Width
                        </label>
                        <input
                            id="width"
                            type="number"
                            className="border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 w-full rounded-md border p-2"
                            placeholder="Width in pixels"
                            min={properties.minimumWidth}
                            max={properties.maximumWidth}
                            onChange={function (e) {
                                handleDimensionChange('width', e.target.value);
                            }}
                            aria-label="Image width in pixels"
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="mb-1 block text-sm font-medium">
                            Height
                        </label>
                        <input
                            id="height"
                            type="number"
                            className="border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 w-full rounded-md border p-2"
                            placeholder="Height in pixels"
                            min={properties.minimumHeight}
                            max={properties.maximumHeight}
                            onChange={function (e) {
                                handleDimensionChange('height', e.target.value);
                            }}
                            aria-label="Image height in pixels"
                        />
                    </div>
                </div>
            );
        },
        [
            properties.allowResize,
            properties.minimumWidth,
            properties.maximumWidth,
            properties.minimumHeight,
            properties.maximumHeight,
            handleDimensionChange,
        ],
    );

    const actionButtons = React.useMemo(
        function () {
            return (
                <div className="flex justify-end space-x-2">
                    {properties.onCancel && (
                        <Button
                            variant="default"
                            onClick={properties.onCancel}
                            disabled={loading}
                            aria-label="Cancel image editing"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={loading}
                        disabled={loading || !cropArea}
                        aria-label="Save edited image"
                    >
                        Save
                    </Button>
                </div>
            );
        },
        [properties.onCancel, loading, cropArea, handleSave],
    );

    // Render the component
    return (
        <div className={`flex flex-col ${properties.className || ''}`} role="region" aria-label="Image editor">
            {error && (
                <Alert variant="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {previewUrl ? (
                <>
                    {/* Image Cropper */}
                    <ImageCropper
                        image={previewUrl}
                        aspectRatio={properties.cropAspectRatio}
                        cropShape={properties.cropShape}
                        onChange={handleCropChange}
                        className="mb-4"
                    />

                    {/* Resize Controls (if enabled) */}
                    {resizeControls}

                    {/* Action Buttons */}
                    {actionButtons}
                </>
            ) : (
                <div
                    className="border-neutral-200 dark:border-neutral-700 flex h-64 items-center justify-center rounded-md border"
                    aria-live="polite"
                >
                    <p className="text-neutral-500">Loading image...</p>
                </div>
            )}
        </div>
    );
}

// Export - Default
export default ImageEditor;
