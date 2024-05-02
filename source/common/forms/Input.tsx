// Dependencies - Utilities
import { ValidationResult } from '@structure/source/utilities/validation/Validation';
import ValidationSchema from '@structure/source/utilities/validation/ValidationSchema';

// Interface - InputReference
export interface InputReferenceInterface {
    getValue: () => string | undefined;
    setValue: (value: any, event?: any) => void;
    focus: () => void;
}

// Interface - InputInterface
export interface InputInterface {
    className?: string;
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
    tabIndex?: number;

    // Methods
    focus?: () => void;

    // Events
    onChange?: (value: any | undefined, event?: any) => void;
    onBlur?: (value: any | undefined, event?: any) => void;
    onValidate?: (validationResult: ValidationResult) => void;

    // Validation
    validate?: (value: any) => Promise<ValidationResult> | ValidationResult;
    validating?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validationSchema?: ValidationSchema;
    validationResult?: ValidationResult;
}
