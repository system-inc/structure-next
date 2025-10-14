// Forward declaration for BaseSchema to avoid circular dependency
interface BaseSchema<T> {
    validate(value: unknown, path?: string[]): Promise<SchemaValidationResult<T>>;
}

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

// Type - ObjectShape
// Shape definition for object schemas - a record of field names to their schemas
export type ObjectShape = Record<string, BaseSchema<unknown>>;

// Type - Validator
// A validator function that can be sync or async and returns validation results
export type Validator = (
    value: unknown,
    path: string[],
) => Promise<Partial<SchemaValidationResult>> | Partial<SchemaValidationResult>;
