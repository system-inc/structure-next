// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Class - BooleanSchema
// Schema for validating boolean values
export class BooleanSchema extends BaseSchema<boolean, boolean> {
    parse(value: unknown): boolean {
        if(typeof value !== 'boolean') {
            throw new Error('Not a boolean');
        }
        return value;
    }

    getTypeName(): string {
        return 'boolean';
    }

    // Validator - isTrue
    // Ensures the value is true
    isTrue(): this {
        this.addValidator('isTrue', function (value: unknown, path) {
            const booleanValue = value as boolean;
            if(booleanValue !== true) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notTrue',
                            message: 'Must be true.',
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
                        identifier: 'isTrue',
                        message: 'Is true.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - isFalse
    // Ensures the value is false
    isFalse(): this {
        this.addValidator('isFalse', function (value: unknown, path) {
            const booleanValue = value as boolean;
            if(booleanValue !== false) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notFalse',
                            message: 'Must be false.',
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
                        identifier: 'isFalse',
                        message: 'Is false.',
                    },
                ],
            };
        });
        return this;
    }
}
