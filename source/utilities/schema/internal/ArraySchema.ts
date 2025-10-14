// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Dependencies - Schema Types
import { SchemaValidationResult } from '../SchemaTypes';

// Class - ArraySchema
// Schema for validating arrays with item-level validation
export class ArraySchema<TItem> extends BaseSchema<TItem[], TItem[]> {
    constructor(private itemSchema: BaseSchema<TItem>) {
        super();
    }

    parse(value: unknown): TItem[] {
        if(!Array.isArray(value)) {
            throw new Error('Not an array');
        }
        return value as TItem[];
    }

    getTypeName(): string {
        return 'array';
    }

    // Override validate to handle per-item validation
    async validate(value: unknown, path: string[] = []): Promise<SchemaValidationResult<TItem[]>> {
        const result: SchemaValidationResult<TItem[]> = {
            valid: true,
            value: [] as TItem[],
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
                message: 'Expected array, received ' + typeof value,
            });
            return result;
        }

        const arrayValue = value as unknown[];
        const validatedArray: TItem[] = [];

        // Validate each item in the array
        for(let index = 0; index < arrayValue.length; index++) {
            const item = arrayValue[index];
            const itemResult = await this.itemSchema.validate(item, [...path, String(index)]);

            if(!itemResult.valid) {
                result.valid = false;
            }

            result.errors.push(...itemResult.errors);
            result.successes.push(...itemResult.successes);

            validatedArray.push(itemResult.value);
        }

        result.value = validatedArray;

        // Run array-level validators (like minimumLength, maximumLength)
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

    // Validator - minimumLength
    // Ensures array has at least the specified number of items
    minimumLength(length: number): this {
        this.addValidator('minimumLength', function (value: unknown, path) {
            const arrayValue = value as TItem[];
            if(arrayValue.length < length) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooFewItems',
                            message: `Must have at least ${length} item${length === 1 ? '' : 's'}.`,
                            validationRule: { identifier: 'minimumLength', parameters: { length } },
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
                        identifier: 'enoughItems',
                        message: `Has at least ${length} item${length === 1 ? '' : 's'}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - maximumLength
    // Ensures array has at most the specified number of items
    maximumLength(length: number): this {
        this.addValidator('maximumLength', function (value: unknown, path) {
            const arrayValue = value as TItem[];
            if(arrayValue.length > length) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooManyItems',
                            message: `Must have at most ${length} item${length === 1 ? '' : 's'}.`,
                            validationRule: { identifier: 'maximumLength', parameters: { length } },
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
                        identifier: 'withinLimit',
                        message: `Has at most ${length} item${length === 1 ? '' : 's'}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - notEmpty
    // Ensures array has at least one item
    notEmpty(): this {
        this.addValidator('notEmpty', function (value: unknown, path) {
            const arrayValue = value as TItem[];
            if(arrayValue.length === 0) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'emptyArray',
                            message: 'Array cannot be empty.',
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
                        identifier: 'notEmpty',
                        message: 'Array has items.',
                    },
                ],
            };
        });
        return this;
    }
}
