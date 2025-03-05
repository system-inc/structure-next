'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Next.js
import Image from 'next/image';

// Dependencies - Utilities
import { CropArea, CropShape } from '@structure/source/utilities/images/Image';

// Types used internally by the component
interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface DragState {
    isDragging: boolean;
    start: Position;
    initialPosition: Position;
}

// Component - ImageCropper
export interface ImageCropperInterface {
    className?: string;
    image: string;
    aspectRatio?: number;
    cropShape?: CropShape;
    onChange?: (cropArea: CropArea) => void;
    onZoomChange?: (zoom: number) => void;
}
export function ImageCropper(properties: ImageCropperInterface) {
    // References
    const containerReference = React.useRef<HTMLDivElement>(null);
    const imageReference = React.useRef<HTMLImageElement>(null);
    const updateTimeoutReference = React.useRef<number | null>(null);
    const centeringTimeoutReference = React.useRef<number | null>(null);
    const lastDragUpdateTimeReference = React.useRef(0);
    const stateReference = React.useRef({
        containerSize: { width: 0, height: 0 },
        imageSize: { width: 0, height: 0 },
        lastReportedCropData: null as CropArea | null,
        isProcessingUpdate: false,
        previousImage: properties.image,
    });

    // State
    const [zoom, setZoom] = React.useState(1);
    const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });
    const [dragState, setDragState] = React.useState<DragState>({
        isDragging: false,
        start: { x: 0, y: 0 },
        initialPosition: { x: 0, y: 0 },
    });

    // Force render utility to update UI after references change
    const [, forceRender] = React.useState({});
    const forceUpdate = React.useCallback(function () {
        forceRender({});
    }, []);

    // Calculate crop area size based on container and aspect ratio
    const getCropAreaSize = React.useCallback(
        function (): Size {
            // Use the containerSizeReference
            const { width: containerWidth, height: containerHeight } = stateReference.current.containerSize;

            // If container dimensions not available yet, read from DOM
            if(containerWidth === 0 || containerHeight === 0) {
                if(containerReference.current) {
                    stateReference.current.containerSize = {
                        width: containerReference.current.clientWidth,
                        height: containerReference.current.clientHeight,
                    };
                    // Recursive call with updated values
                    return getCropAreaSize();
                }
                return { width: 0, height: 0 };
            }

            // Start with the container size
            let width = containerWidth;
            let height = containerHeight;

            // Get aspect ratio, default to 1 if not provided
            const aspectRatio = properties.aspectRatio || 1;

            // Calculate dimensions based on aspect ratio
            if(aspectRatio > 1) {
                height = width / aspectRatio;
            }
            else {
                width = height * aspectRatio;
            }

            // Ensure crop area fits within container
            if(width > containerWidth) {
                width = containerWidth;
                height = width / aspectRatio;
            }

            if(height > containerHeight) {
                height = containerHeight;
                width = height * aspectRatio;
            }

            return { width, height };
        },
        [properties.aspectRatio],
    );

    // Calculate crop area position to center it in the container
    const getCropAreaPosition = React.useCallback(
        function (): Position {
            const { width: containerWidth, height: containerHeight } = stateReference.current.containerSize;

            // If container dimensions not available yet, read from DOM
            if(containerWidth === 0 || containerHeight === 0) {
                if(containerReference.current) {
                    stateReference.current.containerSize = {
                        width: containerReference.current.clientWidth,
                        height: containerReference.current.clientHeight,
                    };
                    // Recursive call with updated values
                    return getCropAreaPosition();
                }
                return { x: 0, y: 0 };
            }

            // Get the crop area size
            const { width, height } = getCropAreaSize();

            // Center the crop area in the container
            return {
                x: (containerWidth - width) / 2,
                y: (containerHeight - height) / 2,
            };
        },
        [getCropAreaSize],
    );

    // Report crop area to parent with debouncing and filtering
    const reportCropAreaToParent = React.useCallback(
        function (currentPosition: Position) {
            // Skip if no onChange handler or already processing
            if(!properties.onChange || stateReference.current.isProcessingUpdate) {
                return;
            }

            // Skip if no valid image or container
            if(
                !containerReference.current ||
                !imageReference.current ||
                !imageReference.current.complete ||
                imageReference.current.naturalWidth === 0
            ) {
                return;
            }

            // Set processing flag to prevent recursive updates
            stateReference.current.isProcessingUpdate = true;

            try {
                // Calculate crop area
                const cropAreaSize = getCropAreaSize();
                const cropAreaPosition = getCropAreaPosition();

                // Only proceed if we have valid dimensions
                if(cropAreaSize.width > 0 && cropAreaSize.height > 0) {
                    // Calculate crop data in image coordinates
                    const cropData: CropArea = {
                        x: (cropAreaPosition.x - currentPosition.x) / zoom,
                        y: (cropAreaPosition.y - currentPosition.y) / zoom,
                        width: cropAreaSize.width / zoom,
                        height: cropAreaSize.height / zoom,
                    };

                    // Always report the first crop area to enable the Save button immediately
                    const isFirstCrop = !stateReference.current.lastReportedCropData;

                    // Check if crop data has significantly changed
                    const lastData = stateReference.current.lastReportedCropData;
                    const hasSignificantChange =
                        isFirstCrop ||
                        !lastData ||
                        Math.abs(lastData.x - cropData.x) > 1 ||
                        Math.abs(lastData.y - cropData.y) > 1 ||
                        Math.abs(lastData.width - cropData.width) > 1 ||
                        Math.abs(lastData.height - cropData.height) > 1;

                    if(hasSignificantChange) {
                        // Store new crop data for future comparison
                        stateReference.current.lastReportedCropData = { ...cropData };

                        // Cancel any pending updates
                        if(updateTimeoutReference.current !== null) {
                            window.clearTimeout(updateTimeoutReference.current);
                        }

                        // For the first crop, report immediately
                        if(isFirstCrop) {
                            properties.onChange?.(cropData);
                        }
                        else {
                            // Debounce the update to parent
                            updateTimeoutReference.current = window.setTimeout(function () {
                                properties.onChange?.(cropData);
                                updateTimeoutReference.current = null;
                            }, 100);
                        }
                    }
                }
            } finally {
                // Clear processing flag after a short delay
                window.setTimeout(function () {
                    stateReference.current.isProcessingUpdate = false;
                }, 10);
            }
        },
        [getCropAreaSize, getCropAreaPosition, properties.onChange, zoom],
    );

    // Center the image in the crop area
    const centerImage = React.useCallback(
        function () {
            // Skip if image is not valid
            if(
                !imageReference.current ||
                !imageReference.current.complete ||
                imageReference.current.naturalWidth === 0
            ) {
                return;
            }

            // Update container size measurements
            if(containerReference.current) {
                stateReference.current.containerSize = {
                    width: containerReference.current.clientWidth,
                    height: containerReference.current.clientHeight,
                };
            }

            // Skip if image and zoom haven't changed
            if(stateReference.current.previousImage === properties.image && stateReference.current.isProcessingUpdate) {
                return;
            }

            // Update tracked values
            stateReference.current.previousImage = properties.image;
            stateReference.current.isProcessingUpdate = true;

            try {
                // Get image dimensions
                const imageWidth = imageReference.current.naturalWidth;
                const imageHeight = imageReference.current.naturalHeight;

                // Store image dimensions
                stateReference.current.imageSize = {
                    width: imageWidth,
                    height: imageHeight,
                };

                // Calculate crop area position and size
                const cropArea = getCropAreaSize();
                const cropPosition = getCropAreaPosition();

                // Calculate the centered position for the image
                let newPosition;

                // If the image has a different aspect ratio than the crop area,
                // we need to fit it nicely
                if(imageWidth > 0 && imageHeight > 0 && cropArea.width > 0 && cropArea.height > 0) {
                    // Calculate image aspect ratio
                    const imageAspectRatio = imageWidth / imageHeight;
                    // Calculate crop area aspect ratio
                    const cropAspectRatio = cropArea.width / cropArea.height;

                    // Default to centering the image
                    newPosition = {
                        x: cropPosition.x + cropArea.width / 2 - (imageWidth * zoom) / 2,
                        y: cropPosition.y + cropArea.height / 2 - (imageHeight * zoom) / 2,
                    };

                    // If image aspect ratio is wider than crop area, fill height
                    if(imageAspectRatio > cropAspectRatio) {
                        // Calculate zoom to fill crop area height
                        const fitZoom = cropArea.height / imageHeight;
                        if(fitZoom > zoom) {
                            // Only apply if it would make the image bigger
                            setZoom(fitZoom);
                            // Recalculate position with new zoom
                            newPosition = {
                                x: cropPosition.x + cropArea.width / 2 - (imageWidth * fitZoom) / 2,
                                y: cropPosition.y,
                            };
                        }
                    }
                    else {
                        // Image is taller than crop area, fill width
                        const fitZoom = cropArea.width / imageWidth;
                        if(fitZoom > zoom) {
                            // Only apply if it would make the image bigger
                            setZoom(fitZoom);
                            // Recalculate position with new zoom
                            newPosition = {
                                x: cropPosition.x,
                                y: cropPosition.y + cropArea.height / 2 - (imageHeight * fitZoom) / 2,
                            };
                        }
                    }
                }
                else {
                    // Default centering if we don't have valid dimensions
                    newPosition = {
                        x: cropPosition.x + cropArea.width / 2 - (imageWidth * zoom) / 2,
                        y: cropPosition.y + cropArea.height / 2 - (imageHeight * zoom) / 2,
                    };
                }

                // Update the position state
                setPosition(newPosition);

                // Report to parent immediately - this enables the save button
                reportCropAreaToParent(newPosition);

                // Clear processing flag after a delay
                window.setTimeout(function () {
                    stateReference.current.isProcessingUpdate = false;
                }, 50);
            }
            catch(error) {
                // Reset processing flag in case of error
                stateReference.current.isProcessingUpdate = false;
                console.error('Error centering image:', error);
            }
        },
        [zoom, getCropAreaSize, getCropAreaPosition, properties.image, reportCropAreaToParent],
    );

    // Initialize container dimensions and handle resize
    React.useEffect(
        function () {
            function updateContainerSize() {
                if(containerReference.current) {
                    stateReference.current.containerSize = {
                        width: containerReference.current.clientWidth,
                        height: containerReference.current.clientHeight,
                    };
                    forceUpdate();
                }
            }

            // Perform initial measurement
            updateContainerSize();

            // Handle window resize
            function handleResize() {
                updateContainerSize();
                // Center the image after container size changes
                centerImage();
            }

            // Set up resize listener
            window.addEventListener('resize', handleResize);

            // Cleanup function
            return function () {
                window.removeEventListener('resize', handleResize);

                // Clear any pending timeouts
                if(updateTimeoutReference.current !== null) {
                    window.clearTimeout(updateTimeoutReference.current);
                    updateTimeoutReference.current = null;
                }

                if(centeringTimeoutReference.current !== null) {
                    window.clearTimeout(centeringTimeoutReference.current);
                    centeringTimeoutReference.current = null;
                }
            };
        },
        [centerImage, forceUpdate],
    );

    // Handle image loading and changes
    React.useEffect(
        function () {
            let isCurrentEffect = true;

            function handleImageLoad() {
                if(!isCurrentEffect) return;

                if(
                    imageReference.current &&
                    imageReference.current.complete &&
                    imageReference.current.naturalWidth > 0
                ) {
                    // Store image dimensions
                    stateReference.current.imageSize = {
                        width: imageReference.current.naturalWidth,
                        height: imageReference.current.naturalHeight,
                    };

                    // Center the image after a slight delay
                    if(centeringTimeoutReference.current !== null) {
                        window.clearTimeout(centeringTimeoutReference.current);
                    }

                    centeringTimeoutReference.current = window.setTimeout(function () {
                        if(isCurrentEffect) {
                            centerImage();
                        }
                        centeringTimeoutReference.current = null;
                    }, 50);
                }
            }

            // Check if image is already loaded
            const imageElement = imageReference.current;
            if(imageElement) {
                if(imageElement.complete && imageElement.naturalWidth > 0) {
                    handleImageLoad();
                }
                else {
                    // Set up load event listener
                    imageElement.addEventListener('load', handleImageLoad);
                }
            }

            // Cleanup function
            return function () {
                isCurrentEffect = false;

                if(imageElement) {
                    imageElement.removeEventListener('load', handleImageLoad);
                }

                if(centeringTimeoutReference.current !== null) {
                    window.clearTimeout(centeringTimeoutReference.current);
                    centeringTimeoutReference.current = null;
                }
            };
        },
        [centerImage, properties.image],
    );

    // Event handlers for user interaction
    const handlePointerStart = React.useCallback(
        function (clientX: number, clientY: number) {
            setDragState({
                isDragging: true,
                start: { x: clientX, y: clientY },
                initialPosition: position,
            });
        },
        [position],
    );

    const handlePointerMove = React.useCallback(
        function (clientX: number, clientY: number) {
            if(!dragState.isDragging) return;

            // Throttle updates for performance
            const now = Date.now();
            const MIN_DRAG_UPDATE_INTERVAL = 20; // 50fps maximum
            if(now - lastDragUpdateTimeReference.current < MIN_DRAG_UPDATE_INTERVAL) {
                return;
            }
            lastDragUpdateTimeReference.current = now;

            // Calculate position delta
            const deltaX = clientX - dragState.start.x;
            const deltaY = clientY - dragState.start.y;

            // Calculate new position
            const newPosition = {
                x: dragState.initialPosition.x + deltaX,
                y: dragState.initialPosition.y + deltaY,
            };

            // Update position state
            setPosition(newPosition);

            // Throttle reporting to parent
            if(updateTimeoutReference.current === null) {
                updateTimeoutReference.current = window.setTimeout(function () {
                    reportCropAreaToParent(newPosition);
                    updateTimeoutReference.current = null;
                }, 50);
            }
        },
        [dragState, reportCropAreaToParent],
    );

    const handlePointerEnd = React.useCallback(function () {
        setDragState((prev) => ({
            ...prev,
            isDragging: false,
        }));
    }, []);

    // Mouse event handlers
    const handleMouseDown = React.useCallback(
        function (event: React.MouseEvent) {
            event.preventDefault();
            handlePointerStart(event.clientX, event.clientY);
        },
        [handlePointerStart],
    );

    const handleMouseMove = React.useCallback(
        function (event: React.MouseEvent) {
            handlePointerMove(event.clientX, event.clientY);
        },
        [handlePointerMove],
    );

    // Touch event handlers
    const handleTouchStart = React.useCallback(
        function (event: React.TouchEvent) {
            if(event.touches.length === 1 && event.touches[0]) {
                event.preventDefault();
                handlePointerStart(event.touches[0].clientX, event.touches[0].clientY);
            }
        },
        [handlePointerStart],
    );

    const handleTouchMove = React.useCallback(
        function (event: React.TouchEvent) {
            if(event.touches.length === 1 && event.touches[0]) {
                handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
            }
        },
        [handlePointerMove],
    );

    // Handle zoom slider change
    const handleZoomChange = React.useCallback(
        function (event: React.ChangeEvent<HTMLInputElement>) {
            if(stateReference.current.isProcessingUpdate) {
                return; // Prevent recursive updates
            }

            const newZoom = parseFloat(event.target.value);
            if(isNaN(newZoom) || newZoom === zoom) {
                return; // Skip invalid or unchanged zoom
            }

            stateReference.current.isProcessingUpdate = true;

            try {
                // Get crop area dimensions and position
                const cropArea = getCropAreaSize();
                const cropPosition = getCropAreaPosition();

                // Only proceed if we have valid image and crop area
                if(imageReference.current && cropArea.width > 0 && cropArea.height > 0) {
                    // Calculate the center point of the visible image area
                    const centerXInImage = (cropPosition.x - position.x) / zoom + cropArea.width / (2 * zoom);
                    const centerYInImage = (cropPosition.y - position.y) / zoom + cropArea.height / (2 * zoom);

                    // Calculate new position to maintain the center point
                    const newPositionX = cropPosition.x + cropArea.width / 2 - centerXInImage * newZoom;
                    const newPositionY = cropPosition.y + cropArea.height / 2 - centerYInImage * newZoom;

                    // Update state
                    setPosition({ x: newPositionX, y: newPositionY });
                    setZoom(newZoom);

                    // Notify parent with a delay to avoid update loops
                    window.setTimeout(function () {
                        // Report crop area update to parent
                        reportCropAreaToParent({ x: newPositionX, y: newPositionY });

                        // Notify parent about zoom change
                        if(properties.onZoomChange) {
                            properties.onZoomChange(newZoom);
                        }

                        // Clear processing flag
                        stateReference.current.isProcessingUpdate = false;
                    }, 50);
                }
                else {
                    // Fallback if crop area or image not ready
                    setZoom(newZoom);

                    // Recenter after zoom change
                    window.setTimeout(function () {
                        centerImage();
                        stateReference.current.isProcessingUpdate = false;
                    }, 50);
                }
            }
            catch(error) {
                // Reset processing flag in case of error
                stateReference.current.isProcessingUpdate = false;
                console.error('Error changing zoom:', error);
            }
        },
        [
            zoom,
            position,
            getCropAreaSize,
            getCropAreaPosition,
            reportCropAreaToParent,
            properties.onZoomChange,
            centerImage,
        ],
    );

    // Calculate crop area dimensions for rendering
    const cropAreaSize = getCropAreaSize();
    const cropAreaPosition = getCropAreaPosition();

    // Render the cropper component
    return (
        <div className="flex flex-col gap-4">
            {/* Main container with crop area */}
            <div
                ref={containerReference}
                className={`bg-neutral-900 relative overflow-hidden ${properties.className || ''}`}
                style={{
                    height: '300px',
                    userSelect: 'none',
                    touchAction: 'none',
                }}
                role="application"
                aria-label="Image cropper"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handlePointerEnd}
                onMouseLeave={handlePointerEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handlePointerEnd}
                onTouchCancel={handlePointerEnd}
            >
                {/* Hidden image for loading and reference */}
                <div className="absolute opacity-0" style={{ width: 1, height: 1, overflow: 'hidden' }}>
                    <Image
                        ref={imageReference}
                        src={properties.image}
                        alt="Hidden reference"
                        width={1}
                        height={1}
                        style={{ pointerEvents: 'none' }}
                        draggable={false}
                        unoptimized
                        priority
                    />
                </div>

                {/* Background image with darkened opacity */}
                <div className="absolute h-full w-full overflow-hidden">
                    <Image
                        src={properties.image}
                        alt="Crop preview background"
                        fill
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            transformOrigin: '0 0',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            objectFit: 'none',
                        }}
                        draggable={false}
                        unoptimized
                        priority
                    />
                </div>

                {/* Crop area overlay with semi-transparent background */}
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    {/* Crop area cutout - this creates the "window" through which we see the cropped portion */}
                    <div
                        style={{
                            position: 'absolute',
                            left: cropAreaPosition.x,
                            top: cropAreaPosition.y,
                            width: cropAreaSize.width,
                            height: cropAreaSize.height,
                            overflow: 'hidden',
                            borderRadius: properties.cropShape === 'Round' ? '50%' : '0',
                        }}
                    >
                        {/* Visible image within crop area at full brightness */}
                        <Image
                            src={properties.image}
                            alt="Crop preview"
                            style={{
                                position: 'absolute',
                                left: position.x - cropAreaPosition.x,
                                top: position.y - cropAreaPosition.y,
                                width: `${imageReference.current?.naturalWidth || 0}px`,
                                height: `${imageReference.current?.naturalHeight || 0}px`,
                                transform: `scale(${zoom})`,
                                transformOrigin: '0 0',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                pointerEvents: 'none',
                            }}
                            width={imageReference.current?.naturalWidth || 1000}
                            height={imageReference.current?.naturalHeight || 1000}
                            draggable={false}
                            unoptimized
                            priority
                        />

                        {/* Grid overlay to help with alignment */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
                                backgroundSize: `${cropAreaSize.width / 3}px ${cropAreaSize.height / 3}px`,
                            }}
                        />
                    </div>
                </div>

                {/* Rectangular outline showing crop boundaries */}
                <div
                    className="pointer-events-none absolute"
                    style={{
                        left: cropAreaPosition.x,
                        top: cropAreaPosition.y,
                        width: cropAreaSize.width,
                        height: cropAreaSize.height,
                        border: '2px solid rgba(255, 255, 255, 0.9)',
                        borderRadius: properties.cropShape === 'Round' ? '50%' : '0',
                        boxShadow:
                            properties.cropShape === 'Round'
                                ? 'inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 0 1px rgba(0,0,0,0.3)'
                                : 'inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 0 1px rgba(0,0,0,0.3)',
                    }}
                    aria-hidden="true"
                />
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-4">
                <span id="zoom-label" className="text-sm font-medium">
                    Zoom:
                </span>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="flex-1"
                    aria-labelledby="zoom-label"
                    aria-valuemin={1}
                    aria-valuemax={3}
                    aria-valuenow={zoom}
                />
                <span className="min-w-[2.5rem] text-sm font-medium" aria-hidden="true">
                    {zoom.toFixed(1)}x
                </span>
            </div>
        </div>
    );
}

// Export - Default
export default ImageCropper;
