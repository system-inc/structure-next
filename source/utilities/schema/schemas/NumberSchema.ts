// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Class - NumberSchema
// Schema for validating number values with various number-specific validators
export class NumberSchema extends BaseSchema<number, number> {
    parse(value: unknown): number {
        if(typeof value !== 'number' || isNaN(value)) {
            throw new Error('Not a number');
        }
        return value;
    }

    get typeName(): string {
        return 'number';
    }

    // Validator - minimum
    // Ensures number is at least the specified value
    minimum(minimumValue: number): this {
        this.addValidator('minimum', function (value: unknown, path) {
            const numberValue = value as number;
            if(numberValue < minimumValue) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooSmall',
                            message: `Must be at least ${minimumValue}.`,
                            validationRule: { identifier: 'minimum', parameters: { minimumValue } },
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
                        identifier: 'meetsMinimum',
                        message: `Meets minimum value of ${minimumValue}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - maximum
    // Ensures number is at most the specified value
    maximum(maximumValue: number): this {
        this.addValidator('maximum', function (value: unknown, path) {
            const numberValue = value as number;
            if(numberValue > maximumValue) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooLarge',
                            message: `Must be at most ${maximumValue}.`,
                            validationRule: { identifier: 'maximum', parameters: { maximumValue } },
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
                        identifier: 'meetsMaximum',
                        message: `Meets maximum value of ${maximumValue}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - integer
    // Ensures number is an integer (no decimal places)
    integer(): this {
        this.addValidator('integer', function (value: unknown, path) {
            const numberValue = value as number;
            if(!Number.isInteger(numberValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notInteger',
                            message: 'Must be an integer.',
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
                        identifier: 'isInteger',
                        message: 'Is an integer.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - positive
    // Ensures number is greater than zero
    positive(): this {
        this.addValidator('positive', function (value: unknown, path) {
            const numberValue = value as number;
            if(numberValue <= 0) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notPositive',
                            message: 'Must be a positive number.',
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
                        identifier: 'isPositive',
                        message: 'Is a positive number.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - negative
    // Ensures number is less than zero
    negative(): this {
        this.addValidator('negative', function (value: unknown, path) {
            const numberValue = value as number;
            if(numberValue >= 0) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notNegative',
                            message: 'Must be a negative number.',
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
                        identifier: 'isNegative',
                        message: 'Is a negative number.',
                    },
                ],
            };
        });
        return this;
    }
}
