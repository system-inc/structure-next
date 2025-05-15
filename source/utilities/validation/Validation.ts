// Interface - ValidationRule
export interface ValidationRule {
    // An identifier for the validation rule, e.g. 'required', 'email', 'minimumLength', etc.
    identifier: string;
    parameters?: {};
    message?: string;
}

// Interface - ValidationError
export interface ValidationError {
    validationRule?: ValidationRule;
    // An identifier for the validation error, e.g. 'tooShort', 'invalidEmailAddress', etc.
    identifier: string;
    message?: string;
}

// Interface - ValidationSuccess
export interface ValidationSuccess {
    validationRule?: ValidationRule;
    // An identifier for the validation success, e.g. 'isLongEnough', 'validEmailAddress', etc.
    identifier: string;
    message?: string;
}

// Type - ValidationResult
export type ValidationResult = {
    value: unknown;
    valid: boolean;
    errors: ValidationError[];
    successes: ValidationSuccess[];
};

// Type - ValidationRuleInstance
export type ValidationRuleInstance = {
    validationRule: ValidationRule;
    validate: (value: unknown) => ValidationResult | Promise<ValidationResult>;
};

// Function to merge n-number of validation results
export function mergeValidationResults(
    ...validationResults: (ValidationResult | undefined | void)[]
): ValidationResult {
    const errors: ValidationError[] = [];
    const successes: ValidationSuccess[] = [];
    let valid = true;

    for(const validationResult of validationResults) {
        if(validationResult) {
            if(!validationResult.valid) {
                valid = false;
            }

            errors.push(...validationResult.errors);
            successes.push(...validationResult.successes);
        }
    }

    return {
        value: validationResults.find((result) => result !== undefined)?.value,
        valid: valid,
        errors: errors,
        successes: successes,
    };
}

// Function to validate an email address
export function isEmailAddress(string: string): boolean {
    return !(string && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string));
}

// Function to validate a username
export function isUsername(string: string): boolean {
    // Must be 3-32 characters long, can include letters, numbers, underscores, international characters, and a single period not at the start or end
    // eslint-disable-next-line no-useless-escape
    return !!(string && /^(?![_\.])(?!.*\.$)(?!.*\..*\.)[\w.\u00A0-\uFFFF]{3,32}$/.test(string));
}

// https://github.com/validatorjs/validator.js
