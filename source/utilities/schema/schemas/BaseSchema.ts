// Dependencies - Schema Types
import { Validator, SchemaValidationResult } from '../Schema';

// Class - BaseSchema
// Abstract base class for all schema types providing validation orchestration and common modifiers
export abstract class BaseSchema<TInput = unknown, TOutput = TInput> {
    protected isOptionalValue = false;
    protected isNullableValue = false;
    protected validators: Validator[] = [];
    protected defaultValue?: TOutput;

    // Abstract methods that each schema type must implement
    abstract parse(value: unknown): TOutput;
    abstract get typeName(): string;

    // Optional getter - only string and array implement this to provide automatic defaults
    // String → '' and Array → [] because "empty" and "undefined" mean the same thing semantically
    // Number/Boolean do NOT auto-default because 0/false are meaningful values distinct from "not set"
    // This forces developers to explicitly choose defaults for number/boolean fields in forms
    // Default implementation returns undefined; string and array schemas override this
    get typeDefault(): TOutput | undefined {
        return undefined;
    }

    // Validate - Main validation orchestration
    async validate(value: unknown, path: string[] = []): Promise<SchemaValidationResult<TOutput>> {
        const result: SchemaValidationResult<TOutput> = {
            valid: true,
            value: value as TOutput,
            errors: [],
            successes: [],
        };

        // Handle optional fields - allow undefined/null
        if(this.isOptionalValue && (value === undefined || value === null)) {
            return result;
        }

        // Handle nullable fields - allow null
        if(this.isNullableValue && value === null) {
            return result;
        }

        // Required validation - if not optional and value is undefined/null/empty, fail
        if(!this.isOptionalValue && (value === undefined || value === null || value === '')) {
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
                message: `Expected ${this.typeName}, received ${typeof value}`,
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
        this.isOptionalValue = true;
        return this as BaseSchema<TInput | undefined, TOutput | undefined>;
    }

    // Public getter - isOptional
    get isOptional(): boolean {
        return this.isOptionalValue;
    }

    // Modifier - nullable
    // Makes this field nullable (can be null)
    nullable(): BaseSchema<TInput | null, TOutput | null> {
        this.isNullableValue = true;
        return this as BaseSchema<TInput | null, TOutput | null>;
    }

    // Modifier - default
    // Sets the default value for this field
    default(value: TOutput): this {
        this.defaultValue = value;
        return this;
    }

    // Method - getDefault
    // Returns the default value for this field
    // Priority: explicit default > type default (string/array only) > undefined
    getDefault(): TOutput | undefined {
        if(this.defaultValue !== undefined) {
            return this.defaultValue;
        }
        return this.typeDefault;
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
