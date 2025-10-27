// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Class - FileSchema
// Schema for validating File objects with MIME type and size constraints
export class FileSchema extends BaseSchema<File, File> {
    private mimeTypesValue?: string[];
    private maximumSizeInBytesValue?: number;
    private minimumSizeInBytesValue?: number;

    parse(value: unknown): File {
        if(!(value instanceof File)) {
            throw new Error('Not a File.');
        }
        return value;
    }

    get typeName(): string {
        return 'file';
    }

    // Getter - allowedMimeTypes
    // Returns the array of allowed MIME types if mimeType() was called
    get allowedMimeTypes(): string[] | undefined {
        return this.mimeTypesValue;
    }

    // Getter - allowedMaximumSizeInBytes
    // Returns the maximum file size in bytes if maximumSizeInBytes() was called
    get allowedMaximumSizeInBytes(): number | undefined {
        return this.maximumSizeInBytesValue;
    }

    // Getter - allowedMinimumSizeInBytes
    // Returns the minimum file size in bytes if minimumSizeInBytes() was called
    get allowedMinimumSizeInBytes(): number | undefined {
        return this.minimumSizeInBytesValue;
    }

    // Validator - mimeType
    // Ensures file MIME type is one of the allowed types
    mimeType(allowedTypes: string[]): this {
        this.mimeTypesValue = allowedTypes;
        this.addValidator('mimeType', function (value: unknown, path) {
            const fileValue = value as File;
            if(!allowedTypes.includes(fileValue.type)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'invalidMimeType',
                            message: `File type must be one of: ${allowedTypes.join(', ')}`,
                            validationRule: { identifier: 'mimeType', parameters: { allowedTypes } },
                        },
                    ],
                    successes: [],
                };
            }
            return {
                valid: true,
                errors: [],
                successes: [
                    {
                        path,
                        identifier: 'validMimeType',
                        message: 'Valid file type.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - maximumSizeInBytes
    // Ensures file size does not exceed the specified number of bytes
    maximumSizeInBytes(bytes: number): this {
        this.maximumSizeInBytesValue = bytes;
        this.addValidator('maximumSizeInBytes', function (value: unknown, path) {
            const fileValue = value as File;
            if(fileValue.size > bytes) {
                const mb = (bytes / (1024 * 1024)).toFixed(1);
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'fileTooLarge',
                            message: `File must be smaller than ${mb} MB.`,
                            validationRule: { identifier: 'maximumSize', parameters: { bytes } },
                        },
                    ],
                    successes: [],
                };
            }
            return {
                valid: true,
                errors: [],
                successes: [
                    {
                        path,
                        identifier: 'validSize',
                        message: 'File size is valid.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - minimumSizeInBytes
    // Ensures file size is at least the specified number of bytes
    minimumSizeInBytes(bytes: number): this {
        this.minimumSizeInBytesValue = bytes;
        this.addValidator('minimumSizeInBytes', function (value: unknown, path) {
            const fileValue = value as File;
            if(fileValue.size < bytes) {
                const kb = (bytes / 1024).toFixed(1);
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'fileTooSmall',
                            message: `File must be at least ${kb} KB.`,
                            validationRule: { identifier: 'minimumSize', parameters: { bytes } },
                        },
                    ],
                    successes: [],
                };
            }
            return {
                valid: true,
                errors: [],
                successes: [
                    {
                        path,
                        identifier: 'validSize',
                        message: 'File size is valid.',
                    },
                ],
            };
        });
        return this;
    }
}
