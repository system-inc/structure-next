// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputErrorInterface, FormInputInterface, FormInput } from '@structure/source/common/forms/FormInput';
import { InputDateReferenceInterface, InputDateInterface, InputDate } from '@structure/source/common/forms/InputDate';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - FormInputDate
export interface FormInputDateInterface
    extends Omit<InputDateInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    sibling?: React.ReactNode;
}
export const FormInputDate = React.forwardRef<InputDateReferenceInterface, FormInputDateInterface>(function (
    properties: FormInputDateInterface,
    reference: React.Ref<InputDateReferenceInterface>,
) {
    // References
    const valueReference = React.useRef<Date | undefined>(properties.defaultValue); // For managing the value internally and exposing it to a form
    const inputDateReference = React.useRef<InputDateReferenceInterface>(null);

    // Function to focus on the component
    const focus = React.useCallback(() => {
        inputDateReference.current?.focus();
    }, []);

    // Function to handle value changes and propagate them upwards through the form
    const onChangeIntercept = React.useCallback(
        function (value: Date | undefined, skipOnChangeCallback: boolean = false) {
            // Update the value reference
            valueReference.current = value;

            // Set the value of the input date
            inputDateReference.current?.setValue(value);

            // Run the provided form input onChange function if provided
            if(!skipOnChangeCallback && properties.onChange) {
                properties.onChange(value);
            }
        },
        [properties],
    );

    // Expose internal state to Form through the reference
    React.useImperativeHandle(reference, () => ({
        getValue: () => valueReference.current,
        setValue: (value: Date | undefined) => {
            onChangeIntercept(value, true); // Skip the onChange callback
        },
        focus,
        // Expose a validate function to the Form component for form input validation
        // This will run in addition to the provided property.validate
        validate: async function (value?: Date) {
            const errors: FormInputErrorInterface[] = [];
            return errors;
        },
    }));

    // Render the component
    return (
        <FormInput
            key="formInput"
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
                    <InputDate
                        key="inputDateLoaded"
                        ref={inputDateReference}
                        className={mergeClassNames('', properties.componentClassName)}
                        defaultValue={properties.defaultValue}
                        required={properties.required}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        onChange={onChangeIntercept}
                        onBlur={properties.onBlur}
                        // Specific to InputDate
                        placeholder={properties.placeholder}
                        closeOnSelect={properties.closeOnSelect}
                        buttonProperties={properties.buttonProperties}
                        popoverProperties={properties.popoverProperties}
                    />
                    {properties.sibling}
                </div>
            }
        />
    );
});

// Set the display name for debugging purposes
FormInputDate.displayName = 'FormInputDate';

// Export - Default
export default FormInputDate;
