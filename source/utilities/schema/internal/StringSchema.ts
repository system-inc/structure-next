// Dependencies - Base Schema
import { BaseSchema } from './BaseSchema';

// Dependencies - Validation Helpers
import { isValidEmailAddress, isValidUsername } from '../utilities/ValidationHelpers';

// Dependencies - API (for GraphQL validation)
import { networkService } from '@structure/source/services/network/NetworkService';
import { GraphQlDocument } from '@structure/source/api/graphql/GraphQlUtilities';
import { UniqueFieldValidationResult } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Class - StringSchema
// Schema for validating string values with various string-specific validators
export class StringSchema extends BaseSchema<string, string> {
    parse(value: unknown): string {
        if(typeof value !== 'string') {
            throw new Error('Not a string');
        }
        return value;
    }

    getTypeName(): string {
        return 'string';
    }

    // Validator - minimumLength
    // Ensures string has at least the specified number of characters
    minimumLength(length: number): this {
        this.addValidator('minimumLength', function (value: unknown, path) {
            const stringValue = value as string;
            if(stringValue.length < length) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooShort',
                            message: `Must be at least ${length} character${length === 1 ? '' : 's'} long.`,
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
                        identifier: 'longEnough',
                        message: `Meets minimum length of ${length} character${length === 1 ? '' : 's'}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - maximumLength
    // Ensures string has at most the specified number of characters
    maximumLength(length: number): this {
        this.addValidator('maximumLength', function (value: unknown, path) {
            const stringValue = value as string;
            if(stringValue.length > length) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'tooLong',
                            message: `Must be at most ${length} character${length === 1 ? '' : 's'} long.`,
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
                        identifier: 'shortEnough',
                        message: `Meets maximum length of ${length} character${length === 1 ? '' : 's'}.`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - emailAddress
    // Validates that the string is a valid email address format
    emailAddress(): this {
        this.addValidator('emailAddress', function (value: unknown, path) {
            const stringValue = value as string;
            if(!isValidEmailAddress(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'invalidEmailAddress',
                            message: 'Must be a valid email address.',
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
                        identifier: 'validEmailAddress',
                        message: 'Valid email address.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - username
    // Validates username format: 3-32 chars, letters/numbers/underscores, single internal period
    username(currentUsername?: string): this {
        // Username must meet length requirements
        this.minimumLength(3);
        this.maximumLength(32);

        this.addValidator('username', function (value: unknown, path) {
            const stringValue = value as string;
            // If this is the current username, only show that message
            if(currentUsername && stringValue === currentUsername) {
                return {
                    valid: true,
                    errors: [],
                    successes: [
                        {
                            path,
                            identifier: 'currentUsername',
                            message: 'Current username.',
                        },
                    ],
                };
            }

            if(!isValidUsername(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'invalidUsername',
                            message: 'May only contain letters, numbers, underscores, and a single period.',
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
                        identifier: 'validUsername',
                        message: 'Valid username format.',
                    },
                ],
            };
        });

        return this;
    }

    // Validator - password
    // Validates password strength: 8-128 chars, uppercase, number, special character
    password(): this {
        this.minimumLength(8);
        this.maximumLength(128);

        // Check for uppercase letter
        this.addValidator('passwordUppercase', function (value: unknown, path) {
            const stringValue = value as string;
            if(!/[A-Z]/.test(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'noUppercase',
                            message: 'Must contain at least one uppercase letter.',
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
                        identifier: 'hasUppercase',
                        message: 'Contains an uppercase letter.',
                    },
                ],
            };
        });

        // Check for number
        this.addValidator('passwordNumber', function (value: unknown, path) {
            const stringValue = value as string;
            if(!/[0-9]/.test(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'noNumber',
                            message: 'Must contain at least one number.',
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
                        identifier: 'hasNumber',
                        message: 'Contains a number.',
                    },
                ],
            };
        });

        // Check for special character
        this.addValidator('passwordSpecial', function (value: unknown, path) {
            const stringValue = value as string;
            if(!/[^a-zA-Z0-9]/.test(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'noSpecialCharacter',
                            message: 'Must contain at least one special character.',
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
                        identifier: 'hasSpecialCharacter',
                        message: 'Contains a special character.',
                    },
                ],
            };
        });

        return this;
    }

    // Validator - graphQlValidate (Async)
    // Validates value against a GraphQL query (e.g., checking username availability)
    graphQlValidate(
        query: GraphQlDocument,
        variablesFunction: (value: string) => Record<string, unknown>,
        skipFunction?: (value: string) => boolean,
    ): this {
        this.addValidator('graphQlValidate', async function (value: unknown, path) {
            const stringValue = value as string;
            // Skip validation if skip function returns true
            if(skipFunction && skipFunction(stringValue)) {
                return { valid: true, errors: [], successes: [] };
            }

            try {
                const variables = variablesFunction(stringValue);
                const data = await networkService.graphQlRequest(
                    query as unknown as Parameters<typeof networkService.graphQlRequest>[0],
                    variables,
                );

                // Get the validation result from the first property in the response
                // Could be data?.accountProfileUsernameValidate or data?.accountProjectNameValidate, etc.
                const uniqueFieldValidationResult = data ? Object.values(data)[0] : null;

                // Handle UniqueFieldValidationResult enum values
                if(uniqueFieldValidationResult === UniqueFieldValidationResult.Available) {
                    return {
                        valid: true,
                        errors: [],
                        successes: [
                            {
                                path,
                                identifier: 'available',
                                message: 'Available.',
                            },
                        ],
                    };
                }
                else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Taken) {
                    return {
                        valid: false,
                        errors: [
                            {
                                path,
                                identifier: 'taken',
                                message: 'Already taken.',
                            },
                        ],
                        successes: [],
                    };
                }
                else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Forbidden) {
                    return {
                        valid: false,
                        errors: [
                            {
                                path,
                                identifier: 'forbidden',
                                message: 'Not allowed.',
                            },
                        ],
                        successes: [],
                    };
                }
                else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Invalid) {
                    return {
                        valid: false,
                        errors: [
                            {
                                path,
                                identifier: 'invalid',
                                message: 'Invalid value.',
                            },
                        ],
                        successes: [],
                    };
                }

                return { valid: true, errors: [], successes: [] };
            } catch {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'graphQlError',
                            message: 'Validation failed.',
                        },
                    ],
                    successes: [],
                };
            }
        });

        return this;
    }

    // Validator - notEmpty
    // Ensures string is not empty (has at least one character)
    notEmpty(message?: string): this {
        this.addValidator('notEmpty', function (value: unknown, path) {
            const stringValue = value as string;
            if(stringValue.length === 0) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'empty',
                            message: message || 'Cannot be empty.',
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
                        message: 'Has a value.',
                    },
                ],
            };
        });
        return this;
    }

    // Validator - is
    // Ensures string exactly matches the specified value
    is(expectedValue: string, message?: string): this {
        this.addValidator('is', function (value: unknown, path) {
            const stringValue = value as string;
            if(stringValue !== expectedValue) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notEqual',
                            message: message || `Must be "${expectedValue}".`,
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
                        identifier: 'equals',
                        message: `Is "${expectedValue}".`,
                    },
                ],
            };
        });
        return this;
    }

    // Validator - in
    // Ensures string is one of the allowed values
    in(allowedValues: string[], message?: string): this {
        this.addValidator('in', function (value: unknown, path) {
            const stringValue = value as string;
            if(!allowedValues.includes(stringValue)) {
                return {
                    valid: false,
                    errors: [
                        {
                            path,
                            identifier: 'notInList',
                            message: message || `Must be one of: ${allowedValues.join(', ')}.`,
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
                        identifier: 'inList',
                        message: `Valid option selected.`,
                    },
                ],
            };
        });
        return this;
    }
}
