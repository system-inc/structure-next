// Function to determine if a file is an image
export function isImageFile(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
}
