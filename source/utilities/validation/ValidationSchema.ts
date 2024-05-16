// Dependencies - Validation
import {
    ValidationRule,
    ValidationRuleInstance,
    ValidationResult,
    isEmailAddress,
} from '@structure/source/utilities/validation/Validation';

// Dependencies - API
import { DocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/ApolloProvider';
import { UniqueFieldValidationResult } from '@project/source/api/GraphQlGeneratedCode';

// Interface - ValidationSchema
export class ValidationSchema {
    private validationRuleInstances: ValidationRuleInstance[] = [];

    // Validate the rule instances and return a validation result
    async validate(value: any) {
        // Create the validation result
        const validationResult: ValidationResult = {
            value: value,
            valid: true,
            errors: [],
            successes: [],
        };

        // Iterate over the validation rule instances
        for(const validationRuleInstance of this.validationRuleInstances) {
            // Validate the value
            const validationRuleResult = await validationRuleInstance.validate(value);
            console.log('validationRuleResult', validationRuleInstance.validationRule.identifier, validationRuleResult);

            // If the result is not valid, set the validation result to invalid
            if(!validationRuleResult.valid) {
                validationResult.valid = false;
            }

            // Add the errors and successes to the validation result
            validationResult.errors.push(...validationRuleResult.errors);
            validationResult.successes.push(...validationRuleResult.successes);
        }

        return validationResult;
    }

    // String
    string() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'string',
            message: 'Must be a string.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is not a string, add an error
                if(typeof value !== 'string') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'notString',
                        message: 'Not a string, is a ' + typeof value + '.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isString',
                        message: 'Is a string.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Number
    number() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'number',
            message: 'Must be a number.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is not a number, add an error
                if(typeof value !== 'number') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'notNumber',
                        message: 'Not a number, is a ' + typeof value + '.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isNumber',
                        message: 'Is a number.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Required
    required() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'required',
            message: 'Is required.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is empty, add an error
                if(!value) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'isEmpty',
                        message: 'Required.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isNotEmpty',
                        message: 'Required.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Minimum length
    minimumLength(length: number) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'minimumLength',
            message: 'Must be at least ' + length + ' characters long.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is less than the minimum length, add an error
                if(value.length < length) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'tooShort',
                        message: 'Too short, must be at least ' + length + ' characters long.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isLongEnough',
                        message: 'Meets minimum length of ' + length + ' characters.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Maximum length
    maximumLength(length: number) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'maximumLength',
            message: 'Must be at most ' + length + ' characters long.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is greater than the maximum length, add an error
                if(value.length > length) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'tooLong',
                        message: 'Too long, must be at most ' + length + ' characters long.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isShortEnough',
                        message: 'Meets maximum length of ' + length + ' characters.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Email address
    emailAddress() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'emailAddress',
            message: 'Must be a valid email address.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is not a valid email address, add an error
                if(!isEmailAddress(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalidEmailAddress',
                        message: 'Invalid email address.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'validEmailAddress',
                        message: 'Valid email address.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    optionalSingleInternalPeriod() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'optionalSingleInternalPeriod',
            message: 'May contain a single period not at the start or end.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value has a period at the start or end or has more than two periods anywhere, add an error
                if(value.startsWith('.') || value.endsWith('.') || value.split('.').length > 2) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalidSingleInternalPeriod',
                        message:
                            'Contains a period at the start or end or has more than one period. Contains a period at the start or end or has more than one period.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'validSingleInternalPeriod',
                        message: 'May contain a single period not at the start or end.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    // Username
    username() {
        this.minimumLength(3);
        this.maximumLength(32);
        this.optionalSingleInternalPeriod();

        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'username',
            message: 'May include letters, numbers, and underscores.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: any) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value has characters other than letters, numbers, underscores, international characters, or period, add an error
                if(!/^[a-zA-Z0-9_.\p{L}]+$/u.test(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalidUsername',
                        message: 'Contains invalid characters. Letters, numbers, and underscores are allowed.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'validUsername',
                        message: 'Contains valid characters.',
                    });
                }

                // If there are errors, set the validation result to invalid
                if(validationResult.errors.length) {
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }

    graphQlQuery(validateGraphQlQueryDocument: DocumentNode, variables?: any) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'graphQlQuery',
            message: 'Must satisfy server requirements.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: async function (value: any) {
                // validate: async function (value: any, concurrentValidationResult: ValidationResult) {
                // Skip validation if concurrent validation is not valid
                // This will prevent making a request to the API if the value is already invalid
                // if(!concurrentValidationResult?.valid) {
                //     return;
                // }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                try {
                    // Execute the GraphQL query
                    const queryState = await apolloClient.query({
                        query: validateGraphQlQueryDocument,
                        variables: {
                            ...variables,
                            value: value,
                        },
                    });
                    console.log('queryResult', queryState);

                    // If there is data, get first property from the data object as the result
                    // It could be named anything, e.g., queryState.data?.accountProfileUsernameValidate;
                    // or queryState.data?.accountProjectNameValidate;
                    const uniqueFieldValidationResult = queryState.data ? Object.values(queryState.data)[0] : null;
                    console.log('uniqueFieldValidationResult', uniqueFieldValidationResult);

                    // Check the UniqueFieldValidationResult and add errors or successes accordingly
                    if(uniqueFieldValidationResult === UniqueFieldValidationResult.Available) {
                        validationResult.successes.push({
                            validationRule: validationRule,
                            identifier: 'available',
                            message: 'Available.',
                        });
                    }
                    else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Forbidden) {
                        validationResult.errors.push({
                            validationRule: validationRule,
                            identifier: 'forbidden',
                            message: 'Forbidden.',
                        });
                        validationResult.valid = false;
                    }
                    else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Invalid) {
                        validationResult.errors.push({
                            validationRule: validationRule,
                            identifier: 'invalid',
                            message: 'Invalid.',
                        });
                        validationResult.valid = false;
                    }
                    else if(uniqueFieldValidationResult === UniqueFieldValidationResult.Taken) {
                        validationResult.errors.push({
                            validationRule: validationRule,
                            identifier: 'taken',
                            message: 'Taken.',
                        });
                        validationResult.valid = false;
                    }
                }
                catch(error) {
                    // Handle any errors that occur during the GraphQL query
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'graphqlError',
                        message: 'An error occurred while validating.',
                    });
                    validationResult.valid = false;
                }

                return validationResult;
            },
        });

        // Return the validation schema for chaining
        return this;
    }
}

// Export - Default
export default ValidationSchema;
