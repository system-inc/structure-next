// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Dependencies - Schema Types
import { SchemaValidationResult } from '../Schema';

// Type - ObjectShape
// Shape definition for object schemas - a record of field names to their schemas
export type ObjectShape = Record<string, BaseSchema<unknown>>;

// Class - ObjectSchema
// Schema for validating objects with per-property validation
export class ObjectSchema<T extends ObjectShape> extends BaseSchema<
    { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never },
    { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never }
> {
    constructor(public shape: T) {
        super();
    }

    parse(value: unknown): { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never } {
        if(typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new Error('Not an object');
        }
        return value as { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never };
    }

    get typeName(): string {
        return 'object';
    }

    // Override validate to handle per-property validation
    async validate(
        value: unknown,
        path: string[] = [],
    ): Promise<SchemaValidationResult<{ [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never }>> {
        const result: SchemaValidationResult<{
            [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never;
        }> = {
            valid: true,
            value: {} as { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never },
            errors: [],
            successes: [],
        };

        // Handle optional fields
        if(this.isOptionalField && (value === undefined || value === null)) {
            return result;
        }

        // Type check
        try {
            result.value = this.parse(value);
        } catch {
            result.valid = false;
            result.errors.push({
                path,
                identifier: 'invalidType',
                message: 'Expected object, received ' + typeof value,
            });
            return result;
        }

        const valueObject = value as Record<string, unknown>;
        const outputObject: Record<string, unknown> = {};

        // Validate each property defined in the shape
        for(const [key, schema] of Object.entries(this.shape)) {
            const propertyValue = valueObject[key];
            const propertyResult = await schema.validate(propertyValue, [...path, key]);

            if(!propertyResult.valid) {
                result.valid = false;
            }

            result.errors.push(...propertyResult.errors);
            result.successes.push(...propertyResult.successes);

            outputObject[key] = propertyResult.value;
        }

        result.value = outputObject as { [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never };

        // Run object-level validators if any were added
        for(const validator of this.validators) {
            const validatorResult = await validator(result.value, path);

            if(validatorResult.valid === false) {
                result.valid = false;
            }

            if(validatorResult.errors) {
                result.errors.push(...validatorResult.errors);
            }

            if(validatorResult.successes) {
                result.successes.push(...validatorResult.successes);
            }
        }

        return result;
    }

    // Method - getDefaults
    // Returns an object with default values for all fields in the schema
    getDefaults(): Partial<{ [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never }> {
        const defaults: Record<string, unknown> = {};

        for(const [key, fieldSchema] of Object.entries(this.shape)) {
            const defaultValue = fieldSchema.getDefault();
            if(defaultValue !== undefined) {
                defaults[key] = defaultValue;
            }
        }

        return defaults as Partial<{ [K in keyof T]: T[K] extends BaseSchema<unknown, infer O> ? O : never }>;
    }
}
