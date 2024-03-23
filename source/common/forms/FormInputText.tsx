// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormInputErrorInterface,
    FormInputReferenceInterface,
    FormInputInterface,
    FormInput,
} from '@structure/source/common/forms/FormInput';
import { InputTextInterface, InputText } from '@structure/source/common/forms/InputText';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { isEmailAddress } from '@structure/source/utilities/Validation';

// Class Names - Form Input Text
export const inputTextClassName =
    // Layout and sizing
    `w-full`;

// Component - FormInputText
export interface FormInputTextInterface
    extends Omit<InputTextInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
    autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    sibling?: React.ReactNode;
    onChange?: (value: string | undefined, event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (value: string | undefined, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const FormInputText = React.forwardRef<FormInputReferenceInterface, FormInputTextInterface>(function (
    properties: FormInputTextInterface,
    reference: React.Ref<FormInputReferenceInterface>,
) {
    // References
    const valueReference = React.useRef(properties.defaultValue); // Expose value to Form
    const inputTextReference = React.useRef<FormInputReferenceInterface>(null);

    // Defaults
    const type = properties.type ?? 'text';

    // Function to focus on the component
    const focus = React.useCallback(function () {
        if(inputTextReference.current) {
            inputTextReference.current.focus();
        }
    }, []);

    // Function to handle form input value changes
    const onChangeIntercept = React.useCallback(
        function (
            value: string | undefined,
            event: React.ChangeEvent<HTMLInputElement>,
            skipOnChangeCallback: boolean = false,
        ) {
            // console.log('Form input value changed:', value);

            // Update the value
            valueReference.current = value;

            // Set the value of the input text
            if(inputTextReference.current) {
                inputTextReference.current.setValue(value);
            }

            // Run the provided form input onChange function if provided
            if(!skipOnChangeCallback && properties.onChange) {
                properties.onChange(value, event);
            }
        },
        [properties],
    );

    // Expose internal state to Form
    React.useImperativeHandle(reference, () => ({
        // Expose the value to the Form component
        getValue: () => valueReference.current,
        // Expose the setValue function to the Form component
        setValue: (value: string | undefined, event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeIntercept(value, event, true);
        },
        // Expose the focus function to the Form component
        focus: () => {
            focus();
        },
        // Expose a validate function to the Form component for form input validation
        // This will run in addition to the provided property.validate
        validate: async function (value: string | undefined) {
            // Store the errors
            const errors: FormInputErrorInterface[] = [];

            // Email validation
            if(value && type === 'email') {
                if(!isEmailAddress(value)) {
                    errors.push({ message: 'This email is not valid.' });
                }
            }

            return errors;
        },
    }));

    // Render the component
    return (
        <FormInput
            id={properties.id}
            className={mergeClassNames('', properties.className)}
            defaultValue={properties.defaultValue}
            label={properties.label}
            labelTip={properties.labelTip}
            description={properties.description}
            disabled={properties.disabled}
            required={properties.required}
            focus={focus}
            validate={properties.validate}
            validating={properties.validating}
            errors={properties.errors}
            component={
                <div className="relative">
                    <InputText
                        ref={inputTextReference}
                        variant={properties.variant}
                        size={properties.size}
                        className={mergeClassNames(inputTextClassName, properties.componentClassName)}
                        defaultValue={properties.defaultValue}
                        required={properties.required}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        onChange={onChangeIntercept}
                        onBlur={properties.onBlur}
                        // Specific to InputText
                        type={type}
                        placeholder={properties.placeholder}
                        autoComplete={properties.autoComplete}
                    />
                    {properties.sibling && properties.sibling}
                    {properties.validating && (
                        <div className="absolute right-2.5 top-2.5 animate-spin">
                            <BrokenCircleIcon className="h-5 w-5" />
                        </div>
                    )}
                </div>
            }
        />
    );
});

// Set the display name for debugging purposes
FormInputText.displayName = 'FormInputText';

// Export - Default
export default FormInputText;
