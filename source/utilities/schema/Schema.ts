// Dependencies - Schema Implementations
import { StringSchema } from './internal/StringSchema';
import { NumberSchema } from './internal/NumberSchema';
import { BooleanSchema } from './internal/BooleanSchema';
import { FileSchema } from './internal/FileSchema';
import { ArraySchema } from './internal/ArraySchema';
import { ObjectSchema } from './internal/ObjectSchema';
import { BaseSchema } from './internal/BaseSchema';

// Dependencies - Types
import { ObjectShape } from './SchemaTypes';

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

// Re-export types for consumer usage
export type { SchemaValidationResult, SchemaError, SchemaSuccess } from './SchemaTypes';
export { BaseSchema } from './internal/BaseSchema';
export { schemaResolver } from './SchemaResolver';
