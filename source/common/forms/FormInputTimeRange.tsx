// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormInputReferenceInterface,
    FormInputProperties,
    FormInput,
    useFormInputValue,
} from '@structure/source/common/forms/FormInput';
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
import {
    InputTimeRangeReferenceInterface,
    InputTimeRangeProperties,
    InputTimeRange,
} from '@structure/source/common/forms/InputTimeRange';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - FormInputTimeRange
export interface FormInputTimeRangeProperties
    extends Omit<InputTimeRangeProperties, 'validate'>,
        Omit<FormInputProperties, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    sibling?: React.ReactNode;
}
export const FormInputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, FormInputTimeRangeProperties>(
    function (properties: FormInputTimeRangeProperties, reference: React.Ref<InputTimeRangeReferenceInterface>) {
        // State
        const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
            properties.validationResult,
        );

        // References
        const inputTimeRangeReference = React.useRef<FormInputReferenceInterface>(null);
        const { valueReference, setValue } = useFormInputValue(properties.defaultValue, inputTimeRangeReference);

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
