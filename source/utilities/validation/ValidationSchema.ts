// Dependencies - Validation
import {
    ValidationRule,
    ValidationRuleInstance,
    ValidationResult,
    isEmailAddress,
    isUsername,
} from '@structure/source/utilities/validation/Validation';

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

    // Username
    username() {
        // Create the validation rule
        const validationRule: ValidationRule = {
            identifier: 'username',
            message: 'Must be a valid username.',
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

                // If the value is not a valid username, add an error
                if(!isUsername(value)) {
                    validationResult.errors.push({
                        validationRule: validationRule,
                        identifier: 'invalidUsername',
                        message: 'Invalid username.',
                    });
                }
                // Otherwise, add a success
                else {
                    validationResult.successes.push({
                        validationRule: validationRule,
                        identifier: 'validUsername',
                        message: 'Valid username.',
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
}

// Export - Default
export default ValidationSchema;
