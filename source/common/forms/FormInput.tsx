// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputInterface } from '@structure/source/common/forms/Input';
import TipIcon from '@structure/source/common/popovers/TipIcon';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { ValidationResult } from '@structure/source/utilities/validation/Validation';
import ValidationSchema from '@structure/source/utilities/validation/ValidationSchema';

// Type - Form Input Reference
export interface FormInputReferenceInterface extends InputReferenceInterface {
    validate: (value: any) => ValidationResult | Promise<ValidationResult | undefined | void> | undefined | void;
}

// Component - FormInput
export interface FormInputInterface extends InputInterface {
    ref?: (instance: FormInputReferenceInterface) => void;
    id: string;
    componentClassName?: string;
    label?: React.ReactNode;
    labelTip?: React.ReactNode;
    description?: React.ReactNode;

    // Validation
    validate?: (
        value: any,
        concurrentValidationResult?: ValidationResult,
    ) => Promise<ValidationResult | undefined | void> | ValidationResult | undefined | void;
    validating?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validationSchema?: ValidationSchema;
    validationResult?: ValidationResult;
    onValidate?: (validationResult: ValidationResult) => void;
}
export function FormInput({
    component,
    ...properties
}: { component: React.ReactElement<FormInputInterface> } & FormInputInterface) {
    // State
    const [validating, setValidating] = React.useState(properties.validating || false);

    // Listen for changes to the validation property
    React.useEffect(() => {
        setValidating(properties.validating || false);
    }, [properties.validating]);

    // console.log('validationResult:', properties.validationResult);
    // console.log('properties.validationResult?.errors.length', properties.validationResult?.errors.length);

    // Render the component
    return (
        // Form Input
        <div className={mergeClassNames('group flex flex-col space-y-2', properties.className)}>
            {/* Label */}
            {properties.label && (
                <div className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-75">
                    <label
                        className="pointer:cursor select-none"
                        onClick={properties.focus instanceof Function ? properties.focus : undefined}
                    >
                        {properties.label}
                    </label>
                    {/* Label Tip */}
                    {properties.label && properties.labelTip && (
                        <TipIcon content={properties.labelTip} className="ml-1 max-w-xs" openOnPress />
                    )}
                </div>
            )}

            {/* Component */}
            {component}

            {/* Errors */}
            {properties.validationResult?.errors &&
                properties.validationResult.errors.length > 0 &&
                properties.validationResult.errors.map((validationError, validationErrorIndex) => (
                    <div key={validationErrorIndex} className="mt-1.5 flex items-center space-x-1 text-xs text-red-500">
                        <ErrorIcon className="h-4 w-4 flex-shrink-0" /> <span>{validationError.message}</span>
                    </div>
                ))}

            {/* Successes */}
            {/* {properties.validationResult?.successes &&
                properties.validationResult.successes.length > 0 &&
                properties.validationResult.successes.map((validationSuccess, validationSuccessIndex) => (
                    <div
                        key={validationSuccessIndex}
                        className="mt-1.5 flex items-center space-x-1 text-xs text-green-600 dark:text-green-500"
                    >
                        <CheckCircledIcon className="h-4 w-4 flex-shrink-0" /> <span>{validationSuccess.message}</span>
                    </div>
                ))} */}

            {/* Description */}
            {properties.description && <div className="text-ss text-muted-foreground">{properties.description}</div>}

            {/* Validating */}
            {validating && <p className="text-xs text-neutral">Validating...</p>}
        </div>
    );
}

// Export - Default
export default FormInput;
