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
