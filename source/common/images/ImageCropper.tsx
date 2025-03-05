'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Next.js
import Image from 'next/image';

// Dependencies - Utilities
import { CropArea, CropShape } from '@structure/source/utilities/images/Image';

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

    // State
    const [zoom, setZoom] = React.useState(1);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [, setImageSize] = React.useState({ width: 0, height: 0 });
    const [, setContainerSize] = React.useState({ width: 0, height: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = React.useState({ x: 0, y: 0 });

    // Calculate crop area size based on container and aspect ratio
    const getCropAreaSize = React.useCallback(
        function () {
            if(!containerReference.current) return { width: 0, height: 0 };

            const container = containerReference.current;
            let width = container.clientWidth;
            let height = container.clientHeight;

            const aspectRatio = properties.aspectRatio || 1;

            if(aspectRatio > 1) {
                height = width / aspectRatio;
            }
            else {
                width = height * aspectRatio;
            }

            // Ensure crop area fits within container
            if(width > container.clientWidth) {
                width = container.clientWidth;
                height = width / aspectRatio;
            }

            if(height > container.clientHeight) {
                height = container.clientHeight;
                width = height * aspectRatio;
            }

            return { width, height };
        },
        [properties.aspectRatio],
    );

    // Calculate crop area position centered in container
    const getCropAreaPosition = React.useCallback(
        function () {
            if(!containerReference.current) return { x: 0, y: 0 };

            const container = containerReference.current;
            const { width, height } = getCropAreaSize();

            return {
                x: (container.clientWidth - width) / 2,
                y: (container.clientHeight - height) / 2,
            };
        },
        [getCropAreaSize],
    );

    // Center the image in the crop area
    const propertiesOnChange = properties.onChange;
    const centerImage = React.useCallback(
        function () {
            if(!containerReference.current || !imageReference.current) return;

            const cropArea = getCropAreaSize();
            const cropPosition = getCropAreaPosition();

            // Calculate the center position for the image
            const newPosition = {
                x: cropPosition.x + cropArea.width / 2 - (imageReference.current.naturalWidth * zoom) / 2,
                y: cropPosition.y + cropArea.height / 2 - (imageReference.current.naturalHeight * zoom) / 2,
            };

            setPosition(newPosition);

            // Report crop area to parent component
            if(propertiesOnChange) {
                propertiesOnChange({
                    x: (cropPosition.x - newPosition.x) / zoom,
                    y: (cropPosition.y - newPosition.y) / zoom,
                    width: cropArea.width / zoom,
                    height: cropArea.height / zoom,
                });
            }
        },
        [zoom, getCropAreaSize, getCropAreaPosition, propertiesOnChange],
    );

    // Initialize container and crop area dimensions when component mounts
    React.useEffect(
        function () {
            if(containerReference.current) {
                setContainerSize({
                    width: containerReference.current.clientWidth,
                    height: containerReference.current.clientHeight,
                });

                // Center image initially
                centerImage();
            }

            function handleResize() {
                if(containerReference.current) {
                    setContainerSize({
                        width: containerReference.current.clientWidth,
                        height: containerReference.current.clientHeight,
                    });
                    centerImage();
                }
            }

            window.addEventListener('resize', handleResize);
            return function () {
                window.removeEventListener('resize', handleResize);
            };
        },
        [centerImage],
    );

    // Handle image load to get natural dimensions
    function handleImageLoad() {
        if(imageReference.current) {
            setImageSize({
                width: imageReference.current.naturalWidth,
                height: imageReference.current.naturalHeight,
            });
            centerImage();
        }
    }

    // Handle mouse down to start dragging
    function handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
        setIsDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
        setInitialPosition({ ...position });
    }

    // Handle touch start for mobile
    function handleTouchStart(event: React.TouchEvent) {
        if(event.touches.length === 1 && event.touches[0]) {
            event.preventDefault();
            setIsDragging(true);
            setDragStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
            setInitialPosition({ ...position });
        }
    }

    // Handle mouse move while dragging
    function handleMouseMove(event: React.MouseEvent) {
        if(!isDragging) return;

        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;

        const newPosition = {
            x: initialPosition.x + deltaX,
            y: initialPosition.y + deltaY,
        };

        setPosition(newPosition);

        // Report crop area to parent component
        if(properties.onChange) {
            const cropPosition = getCropAreaPosition();
            const cropArea = getCropAreaSize();

            properties.onChange({
                x: (cropPosition.x - newPosition.x) / zoom,
                y: (cropPosition.y - newPosition.y) / zoom,
                width: cropArea.width / zoom,
                height: cropArea.height / zoom,
            });
        }
    }

    // Handle touch move for mobile
    function handleTouchMove(event: React.TouchEvent) {
        if(!isDragging || event.touches.length !== 1 || !event.touches[0]) return;

        const deltaX = event.touches[0].clientX - dragStart.x;
        const deltaY = event.touches[0].clientY - dragStart.y;

        const newPosition = {
            x: initialPosition.x + deltaX,
            y: initialPosition.y + deltaY,
        };

        setPosition(newPosition);

        // Report crop area to parent component
        if(properties.onChange) {
            const cropPosition = getCropAreaPosition();
            const cropArea = getCropAreaSize();

            properties.onChange({
                x: (cropPosition.x - newPosition.x) / zoom,
                y: (cropPosition.y - newPosition.y) / zoom,
                width: cropArea.width / zoom,
                height: cropArea.height / zoom,
            });
        }
    }

    // Handle mouse up to stop dragging
    function handleMouseUp() {
        setIsDragging(false);
    }

    // Handle touch end for mobile
    function handleTouchEnd() {
        setIsDragging(false);
    }

    // Handle zoom change
    function handleZoomChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newZoom = parseFloat(event.target.value);

        // Calculate crop area and position
        const cropArea = getCropAreaSize();
        const cropPosition = getCropAreaPosition();

        // If we have both the image and crop area, calculate a new position that maintains
        // the center point of the visible area as we zoom
        if(imageReference.current && cropArea.width > 0 && cropArea.height > 0) {
            // Calculate the center point of the crop area in image coordinates
            const centerXInImage = (cropPosition.x - position.x) / zoom + cropArea.width / (2 * zoom);
            const centerYInImage = (cropPosition.y - position.y) / zoom + cropArea.height / (2 * zoom);

            // Calculate new position based on the new zoom level
            const newPositionX = cropPosition.x + cropArea.width / 2 - centerXInImage * newZoom;
            const newPositionY = cropPosition.y + cropArea.height / 2 - centerYInImage * newZoom;

            // Set the new position
            setPosition({ x: newPositionX, y: newPositionY });

            // Report crop area to parent component
            if(properties.onChange) {
                properties.onChange({
                    x: (cropPosition.x - newPositionX) / newZoom,
                    y: (cropPosition.y - newPositionY) / newZoom,
                    width: cropArea.width / newZoom,
                    height: cropArea.height / newZoom,
                });
            }
        }
        else {
            // Fallback to the old behavior if we can't calculate the center point
            centerImage();
        }

        // Set the new zoom level
        setZoom(newZoom);

        // Notify parent component
        if(properties.onZoomChange) {
            properties.onZoomChange(newZoom);
        }
    }

    // Calculate crop area styles
    const cropAreaSize = getCropAreaSize();
    const cropAreaPosition = getCropAreaPosition();

    // Render component
    return (
        <div className="flex flex-col gap-4">
            <div
                ref={containerReference}
                className={`bg-neutral-900 relative overflow-hidden ${properties.className || ''}`}
                style={{
                    height: '300px',
                    userSelect: 'none',
                    touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Hidden image element for reference/loading */}
                <div className="absolute opacity-0" style={{ width: 1, height: 1, overflow: 'hidden' }}>
                    <Image
                        ref={imageReference}
                        src={properties.image}
                        alt="Hidden reference"
                        onLoad={handleImageLoad}
                        width={1}
                        height={1}
                        style={{
                            pointerEvents: 'none',
                        }}
                        draggable={false}
                        unoptimized
                    />
                </div>

                {/* Main image (visible everywhere with proper zoom) */}
                <div className="absolute h-full w-full overflow-hidden">
                    <Image
                        src={properties.image}
                        alt="Crop preview background"
                        fill
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            transformOrigin: '0 0',
                            opacity: 0.5, // Darkened background
                            pointerEvents: 'none',
                            objectFit: 'none',
                        }}
                        draggable={false}
                        unoptimized
                        priority
                    />
                </div>

                {/* Dark overlay for the whole area except crop area */}
                <div className="absolute inset-0">
                    {/* Cutout for the crop area */}
                    <div
                        style={{
                            position: 'absolute',
                            left: cropAreaPosition.x,
                            top: cropAreaPosition.y,
                            width: cropAreaSize.width,
                            height: cropAreaSize.height,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                            borderRadius: properties.cropShape === 'Round' ? '50%' : '0',
                        }}
                    >
                        {/* Brightened image within crop area */}
                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <Image
                                    src={properties.image}
                                    alt="Crop preview"
                                    fill
                                    style={{
                                        transform: `translate(${position.x - cropAreaPosition.x}px, ${
                                            position.y - cropAreaPosition.y
                                        }px) scale(${zoom})`,
                                        transformOrigin: '0 0',
                                        opacity: 1, // Full brightness in crop area
                                        pointerEvents: 'none',
                                        objectFit: 'none',
                                    }}
                                    draggable={false}
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>

                        {/* Grid overlay */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
                                backgroundSize: `${cropAreaSize.width / 3}px ${cropAreaSize.height / 3}px`,
                                borderRadius: 'inherit',
                            }}
                        />
                    </div>
                </div>

                {/* Square crop outline */}
                <div
                    className="pointer-events-none absolute"
                    style={{
                        left: cropAreaPosition.x,
                        top: cropAreaPosition.y,
                        width: cropAreaSize.width,
                        height: cropAreaSize.height,
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                    }}
                />

                {/* Circle outline for round crop */}
                {properties.cropShape === 'Round' && (
                    <div
                        className="pointer-events-none absolute"
                        style={{
                            left: cropAreaPosition.x,
                            top: cropAreaPosition.y,
                            width: cropAreaSize.width,
                            height: cropAreaSize.height,
                            border: '2px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '50%',
                        }}
                    />
                )}
            </div>

            {/* Zoom control */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Zoom:</span>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="flex-1"
                    aria-label="Zoom level"
                />
                <span className="min-w-[2.5rem] text-sm font-medium">{zoom.toFixed(1)}x</span>
            </div>
        </div>
    );
}

// Export - Default
export default ImageCropper;
