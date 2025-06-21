// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputProperties } from '@structure/source/common/forms/Input';
import { TipIconProperties, TipIcon } from '@structure/source/common/popovers/TipIcon';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { ValidationResult } from '@structure/source/utilities/validation/Validation';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

// Hook - useFormInputValue
export function useFormInputValue<T>(
    defaultValue: T | undefined,
    inputReference: React.RefObject<FormInputReferenceInterface>,
) {
    const valueReference = React.useRef(defaultValue);

    // Using useCallback to memoize the setValue function
    const setValue = React.useCallback(
        function (value: T | undefined) {
            valueReference.current = value;
            if(inputReference.current) {
                inputReference.current.setValue(value);
            }
        },
        [inputReference],
    );

    // Use the memoized setValue in useEffect
    React.useEffect(
        function () {
            setValue(defaultValue);
        },
        [defaultValue, setValue],
    );

    return {
        valueReference: valueReference,
        setValue,
    };
}

// FormInput - Sizes
export const FormInputSizes = {
    default: 'text-sm',
    large: 'text-base',
};

// Type - Form Input Reference
export interface FormInputReferenceInterface extends InputReferenceInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate: (value: any) => ValidationResult | Promise<ValidationResult | undefined | void> | undefined | void;
}

// Component - FormInput
export interface FormInputProperties extends InputProperties {
    // eslint-disable-next-line structure/react-naming-conventions-rule
    ref?: (instance: FormInputReferenceInterface) => void;
    id: string;
    size?: keyof typeof FormInputSizes;
    componentClassName?: string;
    label?: React.ReactNode;
    labelContainerClassName?: string;
    labelClassName?: string;
    labelTip?: React.ReactNode;
    labelTipIconProperties?: Omit<TipIconProperties, 'content'>;
    description?: React.ReactNode;
    descriptionClassName?: string;

    // Validation
    validate?: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any,
        concurrentValidationResult?: ValidationResult,
    ) => Promise<ValidationResult | undefined | void> | ValidationResult | undefined | void;
    validating?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validationSchema?: ValidationSchema;
    validationResult?: ValidationResult;
    showValidationSuccessResults?: boolean;
    onValidate?: (validationResult: ValidationResult) => void;

    component: React.ReactElement<FormInputProperties>;
}
export function FormInput(properties: FormInputProperties) {
    // State
    const [validating, setValidating] = React.useState(properties.validating || false);

    // Defaults
    const size = properties.size || 'default';

    // Listen for changes to the validation property
    React.useEffect(
        function () {
            setValidating(properties.validating || false);
        },
        [properties.validating],
    );

    // console.log('validationResult:', properties.validationResult);
    // console.log('properties.validationResult?.errors.length', properties.validationResult?.errors.length);

    // Render the component
    return (
        // Form Input
        <div className={mergeClassNames('group flex flex-col space-y-2', properties.className)}>
            {/* Label */}
            {properties.label && (
                <div
                    className={mergeClassNames(
                        'flex items-center text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-75',
                        FormInputSizes[size],
                        properties.labelContainerClassName,
                    )}
                >
                    <label
                        className={mergeClassNames(
                            'pointer:cursor select-none whitespace-nowrap font-medium leading-none',
                            properties.labelClassName,
                        )}
                        onClick={properties.focus instanceof Function ? properties.focus : undefined}
                        htmlFor={properties.id}
                    >
                        {properties.label}
                    </label>
                    {/* Label Tip */}
                    {properties.label && properties.labelTip && (
                        <TipIcon
                            openOnPress
                            {...properties.labelTipIconProperties}
                            className={mergeClassNames('ml-1 max-w-xs', properties.labelTipIconProperties?.className)}
                            content={properties.labelTip}
                        />
                    )}
                </div>
            )}

            {/* Component */}
            {properties.component}

            {/* Errors */}
            {!properties.validating &&
                properties.validationResult?.errors &&
                properties.validationResult.errors.length > 0 &&
                properties.validationResult.errors.map((validationError, validationErrorIndex) => (
                    <div key={validationErrorIndex} className="mt-1.5 flex items-center space-x-1 text-xs text-red-500">
                        <ErrorIcon className="h-4 w-4 flex-shrink-0" /> <span>{validationError.message}</span>
                    </div>
                ))}

            {/* Successes */}
            {!properties.validating &&
                properties.showValidationSuccessResults &&
                properties.validationResult?.successes &&
                properties.validationResult.successes.length > 0 &&
                properties.validationResult.successes.map((validationSuccess, validationSuccessIndex) => (
                    <div
                        key={validationSuccessIndex}
                        className="mt-1.5 flex items-center space-x-1 text-xs text-green-600 dark:text-green-500"
                    >
                        <CheckCircledIcon className="h-4 w-4 flex-shrink-0" /> <span>{validationSuccess.message}</span>
                    </div>
                ))}

            {/* Description */}
            {properties.description && (
                <div
                    // className="text-ss text-muted-foreground"
                    className={mergeClassNames(
                        'text-muted-foreground',
                        properties.descriptionClassName,
                        size === 'default' ? 'text-ss' : size === 'large' ? 'text-sm' : 'text-ss',
                    )}
                >
                    {properties.description}
                </div>
            )}

            {/* Validating */}
            {validating && <p className="text-xs text-neutral">Validating...</p>}
        </div>
    );
}
