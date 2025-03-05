// Dependencies - Types
import {
    CropArea,
    ResizeOptions,
    ImageProcessingOptions,
    ImageDimensions,
} from '@structure/source/utilities/images/Image';

/**
 * Creates a preview URL for an image file
 * @param file The image file to create a preview for
 * @returns A URL string that can be used as the src for an image
 */
export function createImagePreview(file: File): string {
    if(!file) {
        throw new Error('No file provided to createImagePreview');
    }

    return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free up memory
 * @param previewUrl The URL to revoke
 */
export function revokeImagePreview(previewUrl: string): void {
    if(previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
    }
}

/**
 * Loads an image from a source (URL or File)
 * @param source The image source (File or URL string)
 * @returns A Promise that resolves to an HTMLImageElement
 */
export async function loadImage(source: File | string): Promise<HTMLImageElement> {
    return new Promise(function (resolve, reject) {
        const image = new Image();

        image.onload = function () {
            resolve(image);
        };
        image.onerror = function () {
            reject(new Error('Failed to load image'));
        };

        if(typeof source === 'string') {
            image.src = source;
        }
        else {
            image.src = URL.createObjectURL(source);
        }
    });
}

/**
 * Crops an image based on the provided crop area
 * @param imageSource The source image (File or URL string)
 * @param cropArea The area to crop (x, y, width, height)
 * @param options Processing options (format, quality, maxSize)
 * @returns A Promise that resolves to a Blob containing the cropped image
 */
export async function cropImage(
    imageSource: File | string,
    cropArea: CropArea,
    options: ImageProcessingOptions = {},
): Promise<Blob> {
    // Default options
    const {
        format = 'jpeg',
        quality = 1.0,
        maxSizeBytes = 1024 * 1024, // 1MB default max size
    } = options;

    // Load the image
    const image = await loadImage(imageSource);

    // Create a canvas to draw the cropped image
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    if(!canvasContext) {
        throw new Error('Could not get canvas context');
    }

    // Set canvas size to the crop dimensions
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Draw the cropped portion of the image
    canvasContext.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
    );

    // If it's a file source, revoke the object URL
    if(typeof imageSource !== 'string') {
        URL.revokeObjectURL(image.src);
    }

    // Convert to blob with specified format and quality
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

    // Get the blob with adaptive quality to meet size constraints
    return adaptiveQualityBlob(canvas, mimeType, quality, maxSizeBytes);
}

/**
 * Resizes an image to the specified dimensions
 * @param imageSource The source image (File or URL string)
 * @param dimensions The target dimensions (width and/or height)
 * @param options Processing options (format, quality, maxSize)
 * @returns A Promise that resolves to a Blob containing the resized image
 */
export async function resizeImage(
    imageSource: File | string,
    dimensions: ResizeOptions,
    options: ImageProcessingOptions = {},
): Promise<Blob> {
    // Default options
    const {
        format = 'jpeg',
        quality = 0.9,
        maxSizeBytes = 1024 * 1024, // 1MB default max size
    } = options;

    const { width, height, maintainAspectRatio = true } = dimensions;

    // Load the image
    const image = await loadImage(imageSource);

    // Create a canvas to draw the resized image
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    if(!canvasContext) {
        throw new Error('Could not get canvas context');
    }

    // Calculate new dimensions
    let newWidth = width || 0;
    let newHeight = height || 0;

    if(maintainAspectRatio) {
        const aspectRatio = image.width / image.height;

        if(width && !height) {
            newWidth = width;
            newHeight = width / aspectRatio;
        }
        else if(height && !width) {
            newHeight = height;
            newWidth = height * aspectRatio;
        }
        else if(width && height) {
            // Use the dimension that results in the smallest image
            const byWidth = { width, height: width / aspectRatio };
            const byHeight = { width: height * aspectRatio, height };

            if(byWidth.width * byWidth.height <= byHeight.width * byHeight.height) {
                newWidth = byWidth.width;
                newHeight = byWidth.height;
            }
            else {
                newWidth = byHeight.width;
                newHeight = byHeight.height;
            }
        }
        else {
            // No dimensions provided, use original
            newWidth = image.width;
            newHeight = image.height;
        }
    }
    else {
        // Don't maintain aspect ratio, use provided dimensions
        newWidth = width || image.width;
        newHeight = height || image.height;
    }

    // Set canvas size to the new dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the resized image
    canvasContext.drawImage(image, 0, 0, newWidth, newHeight);

    // If it's a file source, revoke the object URL
    if(typeof imageSource !== 'string') {
        URL.revokeObjectURL(image.src);
    }

    // Convert to blob with specified format and quality
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

    // Get the blob with adaptive quality to meet size constraints
    return adaptiveQualityBlob(canvas, mimeType, quality, maxSizeBytes);
}

/**
 * Creates a blob from canvas with adaptive quality to meet size constraints
 * @param canvas The canvas element
 * @param mimeType The mime type (image/jpeg or image/png)
 * @param initialQuality The initial quality (0.0 to 1.0)
 * @param maximumSizeInBytes Maximum size in bytes
 * @returns A Promise that resolves to a Blob
 */
async function adaptiveQualityBlob(
    canvas: HTMLCanvasElement,
    mimeType: string,
    initialQuality: number,
    maximumSizeInBytes: number,
): Promise<Blob> {
    // For PNG, quality doesn't apply
    if(mimeType === 'image/png') {
        return new Promise(function (resolve) {
            canvas.toBlob((blob) => {
                resolve(blob!);
            }, mimeType);
        });
    }

    // For JPEG, adapt quality to meet size constraint
    let quality = initialQuality;
    let blob: Blob;

    do {
        blob = await new Promise<Blob>(function (resolve) {
            canvas.toBlob(
                (result) => {
                    resolve(result!);
                },
                mimeType,
                quality,
            );
        });

        // If blob is too large and quality can be reduced further
        if(blob.size > maximumSizeInBytes && quality > 0.1) {
            quality -= 0.1;
        }
        else {
            break;
        }
    } while(true);

    return blob;
}

/**
 * Determines if a file is an image based on its MIME type
 * @param file The file to check
 * @returns True if the file is an image
 */
export function isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
}

/**
 * Gets the dimensions of an image
 * @param imageSource The source image (File or URL string)
 * @returns A Promise that resolves to the image dimensions
 */
export async function getImageDimensions(imageSource: File | string): Promise<ImageDimensions> {
    const image = await loadImage(imageSource);

    // If it's a file source, revoke the object URL
    if(typeof imageSource !== 'string') {
        URL.revokeObjectURL(image.src);
    }

    return {
        width: image.width,
        height: image.height,
    };
}
