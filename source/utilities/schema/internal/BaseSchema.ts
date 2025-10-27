// Dependencies - Schema Types
import { Validator, SchemaValidationResult } from '../Schema';

// Class - BaseSchema
// Abstract base class for all schema types providing validation orchestration and common modifiers
export abstract class BaseSchema<TInput = unknown, TOutput = TInput> {
    protected isOptionalField = false;
    protected isNullableField = false;
    protected validators: Validator[] = [];

    // Abstract methods that each schema type must implement
    abstract parse(value: unknown): TOutput;
    abstract getTypeName(): string;

    // Validate - Main validation orchestration
    async validate(value: unknown, path: string[] = []): Promise<SchemaValidationResult<TOutput>> {
        const result: SchemaValidationResult<TOutput> = {
            valid: true,
            value: value as TOutput,
            errors: [],
            successes: [],
        };

        // Handle optional fields - allow undefined/null
        if(this.isOptionalField && (value === undefined || value === null)) {
            return result;
        }

        // Handle nullable fields - allow null
        if(this.isNullableField && value === null) {
            return result;
        }

        // Required validation - if not optional and value is undefined/null/empty, fail
        if(!this.isOptionalField && (value === undefined || value === null || value === '')) {
            result.valid = false;
            result.errors.push({
                path,
                identifier: 'required',
                message: 'Required.',
            });
            return result;
        }

        // Type check first - use the parse method from the concrete schema type
        try {
            result.value = this.parse(value);
        } catch {
            result.valid = false;
            result.errors.push({
                path,
                identifier: 'invalidType',
                message: `Expected ${this.getTypeName()}, received ${typeof value}`,
            });
            return result;
        }

        // Run all validators sequentially
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

    // Modifier - optional
    // Makes this field optional (can be undefined)
    optional(): BaseSchema<TInput | undefined, TOutput | undefined> {
        this.isOptionalField = true;
        return this as BaseSchema<TInput | undefined, TOutput | undefined>;
    }

    // Modifier - nullable
    // Makes this field nullable (can be null)
    nullable(): BaseSchema<TInput | null, TOutput | null> {
        this.isNullableField = true;
        return this as BaseSchema<TInput | null, TOutput | null>;
    }

    // Type inference helper - used for TypeScript type inference
    // Usage: type MyType = typeof mySchema.infer
    get infer(): TOutput {
        return undefined as unknown as TOutput;
    }

    // Protected helper to add validators
    protected addValidator(identifier: string, validator: Validator): void {
        this.validators.push(validator);
    }
}
