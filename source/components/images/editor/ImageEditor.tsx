'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Alert } from '@structure/source/components/notifications/Alert';
import {
    Cropper,
    CropperRef as CropperReference,
    CropperPreviewRef as CropperPreviewReference,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

// Dependencies - Utilities
import { CropArea, CropShape } from '@structure/source/utilities/image/Image';
import {
    createImagePreview,
    revokeImagePreview,
    cropImage,
    resizeImage,
} from '@structure/source/utilities/image/ImageFile';

// Types used internally by the component
interface ImageDimensions {
    width: number;
    height: number;
}

// Component - ImageEditor
export interface ImageEditorProperties {
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
    loading?: boolean; // Added loading prop to control Save button state
}
export function ImageEditor(properties: ImageEditorProperties) {
    // References
    const lastPreviewUrlReference = React.useRef<string | null>(null);
    const temporaryUrlsReference = React.useRef<string[]>([]);
    const cropperReference = React.useRef<CropperReference>(null);
    const previewReference = React.useRef<CropperPreviewReference>(null);

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
        // No need to call update() as the cropper manages its own updates
    }, []);

    const propertiesAllowResize = properties.allowResize;
    const propertiesOnSave = properties.onSave;
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
                if(propertiesAllowResize && dimensions && dimensions.width && dimensions.height) {
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
                propertiesOnSave?.(processedImage);
            }
            catch(err) {
                setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
            } finally {
                setLoading(false);
            }
        },
        [previewUrl, cropArea, dimensions, outputOptions, propertiesAllowResize, propertiesOnSave],
    );

    const actionButtons = React.useMemo(
        function () {
            return (
                <div className="flex justify-end space-x-2">
                    {properties.onCancel && (
                        <Button
                            variant="A"
                            onClick={properties.onCancel}
                            disabled={loading || properties.loading}
                            aria-label="Cancel image editing"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="A"
                        onClick={handleSave}
                        isLoading={loading || properties.loading}
                        disabled={loading || properties.loading || !cropArea}
                        aria-label="Save edited image"
                    >
                        Save
                    </Button>
                </div>
            );
        },
        [properties.onCancel, loading, properties.loading, cropArea, handleSave],
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
                    {/* Main editing area with cropper and previews */}
                    <div className="mb-4 flex flex-col gap-4">
                        {/* Cropper - takes most of the space */}
                        <div className="grow">
                            <Cropper
                                ref={cropperReference}
                                src={previewUrl}
                                stencilProps={{
                                    aspectRatio: properties.cropAspectRatio
                                        ? {
                                              minimum: properties.cropAspectRatio,
                                              maximum: properties.cropAspectRatio,
                                          }
                                        : undefined,
                                    overlayClassName: properties.cropShape === 'Round' ? 'rounded-full' : 'rounded-md',
                                }}
                                className="rounded-md border border-neutral-200 dark:border-neutral-700"
                                onUpdate={function (cropper) {
                                    // Update the preview
                                    previewReference.current?.update(cropper);

                                    // Convert cropper coordinates to our CropArea format
                                    const coordinates = cropper.getCoordinates();
                                    if(coordinates) {
                                        handleCropChange({
                                            x: coordinates.left,
                                            y: coordinates.top,
                                            width: coordinates.width,
                                            height: coordinates.height,
                                        });
                                    }
                                }}
                            />
                        </div>
                        {/* Action Buttons */}
                        {actionButtons}
                    </div>
                </>
            ) : (
                <div
                    className="flex h-64 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700"
                    aria-live="polite"
                >
                    <p className="content--c">Loading image...</p>
                </div>
            )}
        </div>
    );
}
