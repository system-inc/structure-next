'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Context
import { useFormContext } from './FormContext';

// Dependencies - Components
import { InputText, InputTextInterface } from '@structure/source/common/forms/InputText';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Interface - FormInputText
export interface FormInputTextInterface extends Omit<InputTextInterface, 'validate' | 'onChange' | 'onBlur'> {
    id: string;
    label?: string;
    required?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validationSchema?: ValidationSchema;
    onChange?: (value: string | undefined) => void;
    onBlur?: (value: string | undefined) => void;
}

// Component - FormInputText
export function FormInputText(properties: FormInputTextInterface) {
    // Hooks - Context
    const formContext = useFormContext();

    // References
    const inputReference = React.useRef<HTMLInputElement>(null);

    // State
    const [value, setValue] = React.useState<string | undefined>(properties.defaultValue);

    // Register with form context
    React.useEffect(() => {
        formContext.registerField(properties.id, {
            getValue: () => value,
            setValue: (newValue: unknown) => setValue(newValue as string),
            validate: async () => {
                if(properties.validationSchema) {
                    return properties.validationSchema.validate(value);
                }
                return { valid: true };
            },
            focus: () => inputReference.current?.focus(),
        });

        return () => formContext.unregisterField(properties.id);
    }, [properties.id, value, properties.validationSchema, formContext]);

    // Function to handle change
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value;
        setValue(newValue);
        properties.onChange?.(newValue);

        if(properties.validateOnChange) {
            formContext.validateField(properties.id);
        }
    }

    // Function to handle blur
    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
        properties.onBlur?.(value);

        if(properties.validateOnBlur) {
            formContext.validateField(properties.id);
        }
    }

    // Get validation state
    const isValidating = formContext.isFieldValidating(properties.id);
    const validationResult = formContext.getFieldValidationResult(properties.id);

    // Render the component
    return (
        <div className="flex flex-col space-y-2">
            {/* Label */}
            {properties.label && (
                <label htmlFor={properties.id} className="text-sm font-medium">
                    {properties.label}
                    {properties.required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            {/* Input */}
            <div className="relative">
                <InputText
                    {...properties}
                    ref={inputReference}
                    className={mergeClassNames(
                        'w-full',
                        validationResult?.valid === false && 'border-red-500',
                        properties.className,
                    )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {isValidating && (
                    <div className="absolute right-2.5 top-2 animate-spin">
                        <BrokenCircleIcon className="h-5 w-5" />
                    </div>
                )}
            </div>

            {/* Validation Messages */}
            {validationResult?.errors?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                    {error.message}
                </p>
            ))}
        </div>
    );
}
