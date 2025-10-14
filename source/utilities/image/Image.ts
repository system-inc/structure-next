// Common geometric interfaces
export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Coordinates extends Position, Size {}

// Common interface for crop area/options
export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Common interface for resize options
export interface ResizeOptions {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
}

// Common options for image processing operations
export interface ImageProcessingOptions {
    format?: 'jpeg' | 'png';
    quality?: number;
    maxSizeBytes?: number;
}

// Interface for image dimensions
export interface ImageDimensions {
    width: number;
    height: number;
}

// Crop shape type for UI components
export type CropShape = 'Rectangle' | 'Round';

// File processing result
export interface FileProcessingResult {
    success: boolean;
    file?: File;
    error?: string;
}

// Image transforms interface for orientation handling
export interface ImageTransforms {
    rotate: number;
    flip: {
        horizontal: boolean;
        vertical: boolean;
    };
    scale: number;
}

// Constants for EXIF orientation
export const ExifOrientationTransforms = {
    // EXIF orientation values and their corresponding transformations
    1: { rotate: 0, flip: { horizontal: false, vertical: false } }, // Default
    2: { rotate: 0, flip: { horizontal: true, vertical: false } }, // Flipped horizontally
    3: { rotate: 180, flip: { horizontal: false, vertical: false } }, // Rotated 180°
    4: { rotate: 180, flip: { horizontal: true, vertical: false } }, // Rotated 180° + flipped horizontally
    5: { rotate: 90, flip: { horizontal: true, vertical: false } }, // Rotated 90° + flipped horizontally
    6: { rotate: 90, flip: { horizontal: false, vertical: false } }, // Rotated 90° clockwise
    7: { rotate: 270, flip: { horizontal: true, vertical: false } }, // Rotated 270° + flipped horizontally
    8: { rotate: 270, flip: { horizontal: false, vertical: false } }, // Rotated 270° clockwise
};

// Utility functions for image and geometric operations
/**
 * Checks if two numbers are approximately equal within a threshold
 * @param a First number
 * @param b Second number
 * @param threshold Maximum allowed difference (default: 0.00001)
 */
export function isApproximatelyEqual(a: number, b: number, threshold = 0.00001): boolean {
    return Math.abs(a - b) < threshold;
}

/**
 * Restricts a value to be within a specified range
 * @param value Value to clamp
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

/**
 * Calculates aspect ratio from width and height
 * @param width Width value
 * @param height Height value
 */
export function calculateAspectRatio(width: number, height: number): number {
    return width / height;
}

/**
 * Validates an aspect ratio or returns a default value
 * @param aspectRatio Aspect ratio to validate
 * @param defaultValue Default value to return if invalid
 */
export function validateAspectRatio(
    aspectRatio: number | { minimum?: number; maximum?: number } | null | undefined,
    defaultValue = 1,
): number {
    // If aspect ratio is a simple number
    if(typeof aspectRatio === 'number') {
        return aspectRatio > 0 ? aspectRatio : defaultValue;
    }

    // If aspect ratio is a range object
    if(aspectRatio && typeof aspectRatio === 'object') {
        // If both min and max are specified, return the average
        if(typeof aspectRatio.minimum === 'number' && typeof aspectRatio.maximum === 'number') {
            return (aspectRatio.minimum + aspectRatio.maximum) / 2;
        }

        // If only minimum is specified
        if(typeof aspectRatio.minimum === 'number') {
            return Math.max(aspectRatio.minimum, defaultValue);
        }

        // If only maximum is specified
        if(typeof aspectRatio.maximum === 'number') {
            return Math.min(aspectRatio.maximum, defaultValue);
        }
    }

    // Default fallback
    return defaultValue;
}

/**
 * Checks if an aspect ratio is within a specified range
 * @param value Aspect ratio to check
 * @param range Aspect ratio range
 */
export function isAspectRatioInRange(
    value: number,
    range: { minimum?: number; maximum?: number } | null | undefined,
): boolean {
    if(!range) return true;

    const { minimum, maximum } = range;

    if(typeof minimum === 'number' && value < minimum) {
        return false;
    }

    if(typeof maximum === 'number' && value > maximum) {
        return false;
    }

    return true;
}

/**
 * Centers coordinates within a boundary
 * @param coordinates Coordinates to center
 * @param boundary Boundary to center within
 */
export function centerCoordinates(coordinates: Coordinates, boundary: Coordinates): Coordinates {
    return {
        x: boundary.x + (boundary.width - coordinates.width) / 2,
        y: boundary.y + (boundary.height - coordinates.height) / 2,
        width: coordinates.width,
        height: coordinates.height,
    };
}

/**
 * Gets the center point of coordinates
 * @param coordinates Coordinates to get center from
 */
export function getCenter(coordinates: Coordinates): Position {
    return {
        x: coordinates.x + coordinates.width / 2,
        y: coordinates.y + coordinates.height / 2,
    };
}

/**
 * Adjusts coordinates to maintain aspect ratio
 * @param coordinates Coordinates to adjust
 * @param aspectRatio Target aspect ratio
 */
export function adjustToAspectRatio(coordinates: Coordinates, aspectRatio: number): Coordinates {
    const currentAspectRatio = coordinates.width / coordinates.height;

    // Already at the correct aspect ratio
    if(isApproximatelyEqual(currentAspectRatio, aspectRatio)) {
        return coordinates;
    }

    // Determine how to adjust based on current aspect ratio
    if(currentAspectRatio > aspectRatio) {
        // Too wide, adjust width
        const newWidth = coordinates.height * aspectRatio;
        return {
            x: coordinates.x + (coordinates.width - newWidth) / 2,
            y: coordinates.y,
            width: newWidth,
            height: coordinates.height,
        };
    }
    else {
        // Too tall, adjust height
        const newHeight = coordinates.width / aspectRatio;
        return {
            x: coordinates.x,
            y: coordinates.y + (coordinates.height - newHeight) / 2,
            width: coordinates.width,
            height: newHeight,
        };
    }
}

/**
 * Calculates transform string for CSS transform property
 * @param transforms Image transforms
 */
export function calculateTransformString(transforms: ImageTransforms): string {
    const { rotate, flip, scale } = transforms;

    const rotateTransform = rotate ? `rotate(${rotate}deg)` : '';
    const flipTransform =
        flip.horizontal || flip.vertical ? `scale(${flip.horizontal ? -1 : 1}, ${flip.vertical ? -1 : 1})` : '';
    const scaleTransform = scale !== 1 ? `scale(${scale})` : '';

    return [rotateTransform, flipTransform, scaleTransform].filter(Boolean).join(' ');
}
