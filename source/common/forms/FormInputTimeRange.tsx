// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputInterface, FormInput } from '@structure/source/common/forms/FormInput';
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
import {
    InputTimeRangeReferenceInterface,
    InputTimeRangeInterface,
    InputTimeRange,
} from '@structure/source/common/forms/InputTimeRange';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - FormInputTimeRange
export interface FormInputTimeRangeInterface
    extends Omit<InputTimeRangeInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    sibling?: React.ReactNode;
}
export const FormInputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, FormInputTimeRangeInterface>(
    function (properties: FormInputTimeRangeInterface, reference: React.Ref<InputTimeRangeReferenceInterface>) {
        // State
        const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
            properties.validationResult,
        );

        // References
        const valueReference = React.useRef<TimeRangeType | undefined>(properties.defaultValue); // For managing the value internally and exposing it to a form
        const inputTimeRangeReference = React.useRef<InputTimeRangeReferenceInterface>(null);

        // Function to focus on the component
        const focus = React.useCallback(function () {
            console.log('focusing!');
            inputTimeRangeReference.current?.focus();
        }, []);

        // Function to validate the component
        const propertiesValidate = properties.validate;
        const propertiesValidationSchema = properties.validationSchema;
        const propertiesOnValidate = properties.onValidate;
        const validate = React.useCallback(
            async function (value?: TimeRangeType) {
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
            function (value: TimeRangeType | undefined, skipOnChangeCallback: boolean = false) {
                // Update the value reference
                valueReference.current = value;

                // Set the value of the input time range
                inputTimeRangeReference.current?.setValue(value);

                // Optionally run the provided onChange function if provided
                if(!skipOnChangeCallback && propertiesOnChange) {
                    propertiesOnChange(value);
                }

                // Optionally run validation if a properties.validateOnChange is true
                if(propertiesValidateOnChange) {
                    validate(value);
                }
            },
            [propertiesOnChange, propertiesValidateOnChange, validate],
        );

        React.useImperativeHandle(reference, function () {
            return {
                getValue: function () {
                    return valueReference.current;
                },
                setValue: function (value: TimeRangeType | undefined) {
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
                description={properties.description}
                disabled={properties.disabled}
                required={properties.required}
                focus={focus}
                validate={properties.validate}
                validating={properties.validating}
                validationResult={validationResult}
                component={
                    <div className="relative">
                        <InputTimeRange
                            key="inputTimeRangeLoaded"
                            ref={inputTimeRangeReference}
                            className={mergeClassNames('', properties.componentClassName)}
                            defaultValue={properties.defaultValue}
                            required={properties.required}
                            disabled={properties.disabled}
                            tabIndex={properties.tabIndex}
                            onChange={onChangeIntercept}
                            onBlur={properties.onBlur}
                            // Specific to InputTimeRange
                            placeholder={properties.placeholder}
                            showTimeRangePresets={properties.showTimeRangePresets}
                            buttonProperties={properties.buttonProperties}
                            popoverProperties={properties.popoverProperties}
                        />
                        {properties.sibling}
                    </div>
                }
            />
        );
    },
);

// Set the display name for debugging purposes
FormInputTimeRange.displayName = 'FormInputTimeRange';

// Export - Default
export default FormInputTimeRange;
