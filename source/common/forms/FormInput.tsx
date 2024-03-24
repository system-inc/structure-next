// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import TipIcon from '@structure/source/common/popovers/TipIcon';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Interface - Form Input Error
export interface FormInputErrorInterface {
    message: string;
}

// Type - Form Input Reference
export interface FormInputReferenceInterface extends InputReferenceInterface {
    validate: (value: any) => Promise<FormInputErrorInterface[]>;
}

// Component - FormInput
export interface FormInputInterface {
    ref?: (instance: FormInputReferenceInterface) => void;
    id: string;
    className?: string;
    componentClassName?: string;
    defaultValue?: any;
    label?: React.ReactNode;
    labelTip?: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    tabIndex?: number;
    focus?: () => void;

    // Events
    onChange?: (formInputValue: any, event?: Event) => void;
    onBlur?: (formInputValue: any, event?: Event) => void;

    // Validation
    validate?: (value: any) => Promise<FormInputErrorInterface[]>;
    validating?: boolean;
    errors?: FormInputErrorInterface[];
}
export function FormInput({
    component,
    ...properties
}: { component: React.ReactElement<FormInputInterface> } & FormInputInterface) {
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
            {Array.isArray(properties.errors) &&
                properties.errors.map((error, errorIndex) => (
                    <p key={errorIndex} className="mt-1.5 text-xs text-red-500">
                        {error.message}
                    </p>
                ))}

            {/* Description */}
            {properties.description && <div className="text-ss text-muted-foreground">{properties.description}</div>}
        </div>
    );
}

// Export - Default
export default FormInput;
