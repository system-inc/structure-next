'use client'; // This file uses client-only features

// Dependencies - Types
import {
    CropArea,
    ResizeOptions,
    ImageProcessingOptions,
    ImageDimensions,
    ImageTransforms,
    ExifOrientationTransforms,
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
 * Gets the EXIF orientation from an image file
 * @param file File to extract EXIF data from
 * @returns Promise that resolves to the EXIF orientation (1-8) or 1 if not found
 */
export async function getExifOrientation(file: File): Promise<number> {
    // If the browser doesn't support FileReader or ArrayBuffer, return default orientation
    if(!window.FileReader || !window.DataView) {
        return 1;
    }

    // Only process JPEG images (EXIF is specific to JPEG)
    if(!file.type.startsWith('image/jpeg')) {
        return 1;
    }

    // Read only the EXIF header
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function () {
            if(!reader.result || typeof reader.result === 'string') {
                resolve(1);
                return;
            }

            const view = new DataView(reader.result);

            // Check if this is a valid JPEG
            if(view.getUint16(0, false) !== 0xffd8) {
                resolve(1);
                return;
            }

            const length = view.byteLength;
            let offset = 2;

            while(offset < length) {
                // Check for valid EXIF header
                if(view.getUint16(offset, false) === 0xffe1) {
                    if(view.getUint32(offset + 4, false) !== 0x45786966) {
                        resolve(1);
                        return;
                    }

                    const little = view.getUint16(offset + 10, false) === 0x4949;
                    offset += 14;

                    // Get first IFD offset
                    const firstIfdOffset = view.getUint32(offset, little);

                    if(firstIfdOffset < 8) {
                        resolve(1);
                        return;
                    }

                    // Get number of directory entries
                    offset += firstIfdOffset - 8;
                    const entries = view.getUint16(offset, little);
                    offset += 2;

                    // Find orientation tag (0x0112)
                    for(let i = 0; i < entries; i++) {
                        if(view.getUint16(offset, little) === 0x0112) {
                            // Get orientation value
                            const orientation = view.getUint16(offset + 8, little);

                            // Ensure orientation is between 1 and 8
                            if(orientation >= 1 && orientation <= 8) {
                                resolve(orientation);
                                return;
                            }
                        }

                        offset += 12; // Move to the next entry
                    }
                }
                else if(view.getUint16(offset, false) === 0xffe0) {
                    offset += 2 + view.getUint16(offset + 2, false);
                }
                else {
                    break;
                }
            }

            // Default to 1 if no orientation found
            resolve(1);
        };

        reader.onerror = function () {
            resolve(1);
        };

        // Read only the first 64KB where EXIF data is likely to be found
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
}

/**
 * Get image transformations based on EXIF orientation
 * @param orientation EXIF orientation (1-8)
 * @returns ImageTransforms with appropriate rotation and flip values
 */
export function getExifTransforms(orientation: number): ImageTransforms {
    // Get from constant map or return default
    const transforms = ExifOrientationTransforms[orientation as keyof typeof ExifOrientationTransforms];

    if(!transforms) {
        return {
            rotate: 0,
            flip: {
                horizontal: false,
                vertical: false,
            },
            scale: 1,
        };
    }

    return {
        ...transforms,
        scale: 1, // Scale is always 1 initially
    };
}

/**
 * Applies EXIF orientation correction to an image file
 * @param file Image file to process
 * @returns Promise that resolves to object with URL and transform info
 */
export async function applyExifOrientation(file: File): Promise<{
    src: string;
    orientation: number;
    transforms: ImageTransforms;
}> {
    // Get the EXIF orientation
    const orientation = await getExifOrientation(file);

    // Get transforms for this orientation
    const transforms = getExifTransforms(orientation);

    // Create object URL for the file
    const src = URL.createObjectURL(file);

    // Return the URL and transforms
    return {
        src,
        orientation,
        transforms,
    };
}

/**
 * Draws an image with transformations to a canvas
 * @param context Canvas context to draw on
 * @param image Image element to draw
 * @param transforms Transformations to apply
 * @param x X position to draw at
 * @param y Y position to draw at
 * @param width Width to draw
 * @param height Height to draw
 */
export function drawTransformedImage(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    transforms: ImageTransforms,
    x: number,
    y: number,
    width: number,
    height: number,
): void {
    // Save the current canvas state
    context.save();

    // Move to center of where the image will be drawn
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    context.translate(centerX, centerY);

    // Apply rotation
    if(transforms.rotate !== 0) {
        context.rotate((transforms.rotate * Math.PI) / 180);
    }

    // Apply flip
    if(transforms.flip.horizontal || transforms.flip.vertical) {
        context.scale(transforms.flip.horizontal ? -1 : 1, transforms.flip.vertical ? -1 : 1);
    }

    // Apply scale
    if(transforms.scale !== 1) {
        context.scale(transforms.scale, transforms.scale);
    }

    // Draw the image centered
    context.drawImage(image, -width / 2, -height / 2, width, height);

    // Restore the canvas state
    context.restore();
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

    // If cropArea is provided by react-advanced-cropper, it might have different property names
    // We need to normalize them to our expected format
    const normalizedCropArea: CropArea = {
        x: 'left' in cropArea ? (cropArea as any).left : cropArea.x,
        y: 'top' in cropArea ? (cropArea as any).top : cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
    };

    // Load the image
    const image = await loadImage(imageSource);

    // Create a canvas to draw the cropped image
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    if(!canvasContext) {
        throw new Error('Could not get canvas context');
    }

    // Set canvas size to the crop dimensions
    canvas.width = normalizedCropArea.width;
    canvas.height = normalizedCropArea.height;

    // Draw the cropped portion of the image
    canvasContext.drawImage(
        image,
        normalizedCropArea.x,
        normalizedCropArea.y,
        normalizedCropArea.width,
        normalizedCropArea.height,
        0,
        0,
        normalizedCropArea.width,
        normalizedCropArea.height,
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
    let blob!: Blob;
    let continueSizeReduction = true;

    while(continueSizeReduction) {
        blob = await new Promise<Blob>(function (resolve) {
            canvas.toBlob(
                function (result) {
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
            continueSizeReduction = false;
        }
    }

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
