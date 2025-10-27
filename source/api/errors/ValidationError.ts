/**
 * Validation error description.
 *
 * This mirrors the class-validator ValidationError interface used on the backend
 * and provides a consistent structure for validation errors across all API layers.
 */
export interface ValidationErrorInterface {
    /**
     * Object that was validated.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
     */
    target?: object;

    // Object's property that haven't pass validation.
    property: string;

    /**
     * Value that haven't pass a validation.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
     */
    value?: unknown;

    // Constraints that failed validation with error messages.
    constraints?: {
        [type: string]: string;
    };

    // Contains all nested validation errors of the property.
    children?: ValidationErrorInterface[];

    // Additional context information for the validation error.
    contexts?: {
        [type: string]: unknown;
    };
}
