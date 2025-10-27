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

// Interface - SchemaError
// Validation error with path for nested schemas
export interface SchemaError {
    // Path to the field that failed validation, e.g., ['user', 'email'] for nested.user.email
    path: string[];
    // Unique identifier for the error type, e.g., 'invalidEmailAddress', 'tooShort'
    identifier: string;
    // Human-readable error message
    message: string;
    // Optional reference to the validation rule that produced this error
    validationRule?: {
        identifier: string;
        parameters?: Record<string, unknown>;
    };
}

// Interface - SchemaSuccess
// Validation success (for progressive validation UX showing what passed)
export interface SchemaSuccess {
    // Path to the field that passed validation
    path: string[];
    // Unique identifier for the success type, e.g., 'validEmailAddress', 'longEnough'
    identifier: string;
    // Human-readable success message
    message: string;
    // Optional reference to the validation rule that produced this success
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
    errors: SchemaError[];
    // All validation successes (useful for progressive validation UX)
    successes: SchemaSuccess[];
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
