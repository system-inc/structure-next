'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ImageCropper } from './ImageCropper';

// Dependencies - Utilities
import { CropShape } from '@structure/source/utilities/images/Image';
import {
    createImagePreview,
    revokeImagePreview,
    cropImage,
    resizeImage,
} from '@structure/source/utilities/images/ImageProcessing';

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
    onCancel?: () => void;
    onSave?: (imageBlob: Blob) => void;
    outputFormat?: 'jpeg' | 'png';
    outputQuality?: number; // 0.0 to 1.0
    maximumOutputSizeInBytes?: number;
}
export function ImageEditor(properties: ImageEditorInterface) {
    // State
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [cropArea, setCropArea] = React.useState<{ x: number; y: number; width: number; height: number } | null>(
        null,
    );
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | null>(null);

    // Load image on mount
    React.useEffect(
        function () {
            // Create a preview URL if the image is a File
            if(properties.image instanceof File) {
                const url = createImagePreview(properties.image);
                setPreviewUrl(url);
            }
            else {
                setPreviewUrl(properties.image);
            }

            // On unmount
            return function () {
                if(previewUrl && properties.image instanceof File) {
                    revokeImagePreview(previewUrl);
                }
            };
        },
        [properties.image, previewUrl],
    );

    // Reset state when image changes
    React.useEffect(
        function () {
            setCropArea(null);
            setError(null);
            setDimensions(null);
        },
        [properties.image],
    );

    // Handle crop area change
    function handleCropChange(area: { x: number; y: number; width: number; height: number }) {
        setCropArea(area);
    }

    // Handle save
    async function handleSave() {
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
            processedImage = await cropImage(previewUrl, cropArea, {
                format: properties.outputFormat || 'jpeg',
                quality: properties.outputQuality || 0.9,
                maxSizeBytes: properties.maximumOutputSizeInBytes || 1024 * 1024, // 1MB default
            });

            // Then resize if needed
            if(properties.allowResize && dimensions) {
                processedImage = await resizeImage(
                    URL.createObjectURL(processedImage),
                    {
                        width: dimensions.width,
                        height: dimensions.height,
                    },
                    {
                        format: properties.outputFormat || 'jpeg',
                        quality: properties.outputQuality || 0.9,
                        maxSizeBytes: properties.maximumOutputSizeInBytes || 1024 * 1024, // 1MB default
                    },
                );
            }

            // Call the onSave callback with the processed image
            properties.onSave?.(processedImage);
        }
        catch(err) {
            setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
        } finally {
            setLoading(false);
        }
    }

    // Handle dimension change
    function handleDimensionChange(dimension: 'width' | 'height', value: string) {
        const numValue = parseInt(value);

        if(isNaN(numValue) || numValue <= 0) {
            return;
        }

        setDimensions(function (prev) {
            if(!prev) {
                return {
                    width: dimension === 'width' ? numValue : 0,
                    height: dimension === 'height' ? numValue : 0,
                };
            }

            return {
                ...prev,
                [dimension]: numValue,
            };
        });
    }

    // Render the component
    return (
        <div className={`flex flex-col ${properties.className}`}>
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
                    {properties.allowResize && (
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
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        {properties.onCancel && (
                            <Button variant="default" onClick={properties.onCancel} disabled={loading}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            loading={loading}
                            disabled={loading || !cropArea}
                        >
                            Save
                        </Button>
                    </div>
                </>
            ) : (
                <div className="border-neutral-200 dark:border-neutral-700 flex h-64 items-center justify-center rounded-md border">
                    <p className="text-neutral-500">Loading image...</p>
                </div>
            )}
        </div>
    );
}

// Export - Default
export default ImageEditor;
