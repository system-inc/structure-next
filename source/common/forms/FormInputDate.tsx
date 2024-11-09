// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormInputReferenceInterface,
    FormInputInterface,
    FormInput,
    useFormInputValue,
} from '@structure/source/common/forms/FormInput';
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { InputDateReferenceInterface, InputDateInterface, InputDate } from '@structure/source/common/forms/InputDate';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

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
    // State
    const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
        properties.validationResult,
    );

    // References
    const inputDateReference = React.useRef<FormInputReferenceInterface>(null);
    const { valueReference, setValue } = useFormInputValue(properties.defaultValue, inputDateReference);

    // Function to focus on the component
    const focus = React.useCallback(() => {
        inputDateReference.current?.focus();
    }, []);

    // Function to validate the component
    const propertiesValidate = properties.validate;
    const propertiesValidationSchema = properties.validationSchema;
    const propertiesOnValidate = properties.onValidate;
    const validate = React.useCallback(
        async function (value?: Date) {
            // Run the validation schema validation if provided
            const validationSchemaValidationResult = propertiesValidationSchema
                ? await propertiesValidationSchema.validate(value)
                : undefined;

            // Run the provided validate function if provided
            const propertiesValidationResult = propertiesValidate ? await propertiesValidate(value) : undefined;

            // Merge the validation results
            const mergedValidationResult = mergeValidationResults(
                validationSchemaValidationResult,
                propertiesValidationResult,
            );

            // Set the validation result
            setValidationResult(mergedValidationResult);

            // Optionally run the onValidate function from properties if provided
            if(propertiesOnValidate) {
                propertiesOnValidate(mergedValidationResult);
            }

            return mergedValidationResult;
        },
        [propertiesValidationSchema, propertiesValidate, propertiesOnValidate],
    );

    // Function to handle value changes and propagate them upwards through the form
    const propertiesOnChange = properties.onChange;
    const propertiesValidateOnChange = properties.validateOnChange;
    const onChangeIntercept = React.useCallback(
        function (value: Date | undefined, skipOnChangeCallback: boolean = false) {
            // Update the value reference
            setValue(value);

            // Optionally run the provided onChange function if provided
            if(!skipOnChangeCallback && propertiesOnChange) {
                propertiesOnChange(value);
            }

            // Optionally run validation if a properties.validateOnChange is true
            if(propertiesValidateOnChange) {
                validate(value);
            }
        },
        [propertiesOnChange, propertiesValidateOnChange, validate, setValue],
    );

    // Expose internal state to Form through the reference
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return valueReference.current;
            },
            setValue: function (value: Date | undefined) {
                onChangeIntercept(value, true); // Skip the onChange callback
            },
            focus: focus,
            validate: validate,
        };
    });

    // Render the component
    return (
        <FormInput
            key="formInput"
            id={properties.id}
            className={mergeClassNames('', properties.className)}
            defaultValue={properties.defaultValue}
            label={properties.label}
            labelTip={properties.labelTip}
            labelTipIconProperties={properties.labelTipIconProperties}
            description={properties.description}
            disabled={properties.disabled}
            required={properties.required}
            focus={focus}
            validate={properties.validate}
            validating={properties.validating}
            validationResult={validationResult}
            showValidationSuccessResults={properties.showValidationSuccessResults}
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
