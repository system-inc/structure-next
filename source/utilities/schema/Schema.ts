// Dependencies - Schema Implementations
import { StringSchema } from './schemas/StringSchema';
import { NumberSchema } from './schemas/NumberSchema';
import { BooleanSchema } from './schemas/BooleanSchema';
import { FileSchema } from './schemas/FileSchema';
import { ArraySchema } from './schemas/ArraySchema';
import { ObjectSchema, type ObjectShape } from './schemas/ObjectSchema';
import { BaseSchema } from './schemas/BaseSchema';

// Type - Validator
// A validator function that can be sync or async and returns validation results
export type Validator = (
    value: unknown,
    path: string[],
) => Promise<Partial<SchemaValidationResult>> | Partial<SchemaValidationResult>;

// Interface - ValidationResult
// Validation result with path for nested schemas (used for both errors and successes)
export interface ValidationResult {
    // Path to the field, e.g., ['user', 'email'] for nested.user.email
    path: string[];
    // Unique identifier for the result type, e.g., 'invalidEmailAddress', 'tooShort', 'validEmailAddress'
    identifier: string;
    // Human-readable message
    message: string;
    // Optional reference to the validation rule that produced this result
    validationRule?: {
        identifier: string;
        parameters?: Record<string, unknown>;
    };
}

// Interface - SchemaValidationResult
// Complete validation result containing the validated value, validity status, and all errors/successes
export interface SchemaValidationResult<T = unknown> {
    // Whether the validation passed (true) or failed (false)
    valid: boolean;
    // The validated/parsed value
    value: T;
    // All validation errors (empty array if valid)
    errors: ValidationResult[];
    // All validation successes (useful for progressive validation UX)
    successes: ValidationResult[];
}

// Schema - Main Namespace Export
// The primary API for defining validation schemas
export const schema = {
    // Primitive types
    string: function (): StringSchema {
        return new StringSchema();
    },

    number: function (): NumberSchema {
        return new NumberSchema();
    },

    boolean: function (): BooleanSchema {
        return new BooleanSchema();
    },

    // Complex types
    array: function <T>(itemSchema: BaseSchema<T>): ArraySchema<T> {
        return new ArraySchema(itemSchema);
    },

    object: function <T extends ObjectShape>(shape: T): ObjectSchema<T> {
        return new ObjectSchema(shape);
    },

    // Special types
    file: function (): FileSchema {
        return new FileSchema();
    },

    // Utility functions
    optional: function <T>(schemaInstance: BaseSchema<T>): BaseSchema<T | undefined> {
        return schemaInstance.optional();
    },

    nullable: function <T>(schemaInstance: BaseSchema<T>): BaseSchema<T | null> {
        return schemaInstance.nullable();
    },
};
