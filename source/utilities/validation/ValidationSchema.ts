// Dependencies - Validation
import {
    ValidationRule,
    ValidationRuleInstance,
    ValidationResult,
    isEmailAddress,
} from '@structure/source/utilities/validation/Validation';

// Dependencies - API
import { DocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/apollo/ApolloClient';
import { UniqueFieldValidationResult } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Interface - ValidationSchema
export class ValidationSchema {
    private validationRuleInstances: ValidationRuleInstance[] = [];

    // Validate the rule instances and return a validation result
    async validate(value: unknown) {
        // Create the validation result
        const validationResult: ValidationResult = {
            value: value,
            valid: true,
            errors: [],
            successes: [],
        };

        // Iterate over the validation rule instances
        for(const validationRuleInstance of this.validationRuleInstances) {
            // console.log('value', value, 'validationRuleInstance', validationRuleInstance);

            // Validate the value
            const validationRuleResult = await validationRuleInstance.validate(value ?? '');
            // console.log('validationRuleResult', validationRuleInstance.validationRule.identifier, validationRuleResult);

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
            validate: function (value: unknown) {
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
            validate: function (value: unknown) {
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
            validate: function (value: unknown) {
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
    minimumLength(minimumLength: number) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'minimumLength',
            parameters: {
                minimumLength: minimumLength,
            },
            message: 'Must be at least ' + minimumLength + ' characters long.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is invalid
                if(typeof value !== 'string' && !Object.hasOwn(value, 'length')) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }
                // If the value is less than the minimum length, add an error
                else if(value.length < minimumLength) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'tooShort',
                        message: 'Too short, must be at least ' + minimumLength + ' characters long.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isLongEnough',
                        message: 'Meets minimum length of ' + minimumLength + ' characters.',
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
    maximumLength(maximumLength: number) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'maximumLength',
            parameters: {
                maximumLength: maximumLength,
            },
            message: 'Must be at most ' + maximumLength + ' characters long.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is invalid
                if(typeof value !== 'string' && !Object.hasOwn(value, 'length')) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }
                // If the value is greater than the maximum length, add an error
                else if(value.length > maximumLength) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'tooLong',
                        message: 'Too long, must be at most ' + maximumLength + ' characters long.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'isShortEnough',
                        message: 'Meets maximum length of ' + maximumLength + ' characters.',
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
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is invalid
                if(typeof value !== 'string') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }
                // If the value is not a valid email address, add an error
                else if(!isEmailAddress(value)) {
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
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is invalid
                if(typeof value !== 'string') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }
                // If the value has a period at the start or end or has more than two periods anywhere, add an error
                else if(value.startsWith('.') || value.endsWith('.') || value.split('.').length > 2) {
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
    username(currentUsername?: string) {
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
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If this is the current username, only show that message
                if(currentUsername && value === currentUsername) {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'currentUsername',
                        message: 'Current username.',
                    });
                    return validationResult;
                }

                // If the value is invalid
                if(typeof value !== 'string') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }
                // If the value has characters other than letters, numbers, underscores, international characters, or period, add an error
                else if(!/^[a-zA-Z0-9_.]+$/.test(value)) {
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

    // Password
    password() {
        this.minimumLength(8);
        this.maximumLength(128);

        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'password',
            message:
                'Must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: function (value: unknown) {
                // Throw an exception if the value is not a string
                if(typeof value !== 'string') {
                    throw new Error('Value is not a string.');
                }

                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // If the value is invalid
                if(typeof value !== 'string') {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalid',
                        message: 'Invalid value.',
                    });
                }

                // If the value does not have one uppercase letter, add an error
                if(!/[A-Z]/.test(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'noUppercase',
                        message: 'Must contain at least one uppercase letter.',
                    });
                }
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'hasUppercase',
                        message: 'Contains at least one uppercase letter.',
                    });
                }

                // If the value does not have a number, add an error
                if(!/[0-9]/.test(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'noNumber',
                        message: 'Must contain at least one number.',
                    });
                }
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'hasNumber',
                        message: 'Contains at least one number.',
                    });
                }

                // If the value does not have a special character, add an error
                if(!/[^a-zA-Z0-9]/.test(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'noSpecialCharacter',
                        message: 'Must contain at least one special character.',
                    });
                }
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'hasSpecialCharacter',
                        message: 'Contains at least one special character.',
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

    // GraphQL query
    graphQlQuery(
        validateGraphQlQueryDocument: DocumentNode,
        variables: (value: unknown) => Record<string, unknown>,
        skip?: (value: unknown) => boolean,
    ) {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'graphQlQuery',
            message: 'Must satisfy server requirements.',
        };

        // Add the validation rule instance
        this.validationRuleInstances.push({
            validationRule: validationRule,
            validate: async function (value: unknown) {
                // Create the validation result
                const validationResult: ValidationResult = {
                    value: value,
                    valid: true,
                    errors: [],
                    successes: [],
                };

                // Skip validation if skip function returns true
                if(skip && skip(value)) {
                    return validationResult;
                }

                try {
                    // Get the variables - either use the static variables or call the function
                    const queryVariables = variables(value);

                    // Execute the GraphQL query
                    const queryState = await apolloClient.query({
                        query: validateGraphQlQueryDocument,
                        variables: queryVariables,
                    });

                    // If there is data, get first property from the data object as the result
                    // It could be named anything, e.g., queryState.data?.accountProfileUsernameValidate;
                    // or queryState.data?.accountProjectNameValidate;
                    const uniqueFieldValidationResult = queryState.data ? Object.values(queryState.data)[0] : null;
                    // console.log('uniqueFieldValidationResult', uniqueFieldValidationResult);

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
                } catch {
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

        return this;
    }

    toJson() {
        const object: Record<string, Record<string, unknown>> = {};

        // Loop over the validation rule instances
        for(const validationRuleInstance of this.validationRuleInstances) {
            const identifier = validationRuleInstance.validationRule.identifier;
            object[identifier] = {};
            // object[validationRuleInstance.validationRule.identifier] = validationRuleInstance.validationRule;
            if(validationRuleInstance.validationRule.parameters) {
                object[identifier].parameters = validationRuleInstance.validationRule.parameters;
            }
        }

        return JSON.stringify(object, null, 4);
    }
}
