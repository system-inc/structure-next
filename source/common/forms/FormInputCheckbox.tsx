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
import {
    InputCheckboxState,
    InputCheckboxReferenceInterface,
    InputCheckboxInterface,
    InputCheckbox,
} from '@structure/source/common/forms/InputCheckbox';
import TipIcon from '@structure/source/common/popovers/TipIcon';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - FormInputCheckbox
export interface FormInputCheckboxInterface
    extends Omit<InputCheckboxInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur' | 'size'> {
    sibling?: React.ReactNode;
}
export const FormInputCheckbox = React.forwardRef<InputCheckboxReferenceInterface, FormInputCheckboxInterface>(
    function (properties: FormInputCheckboxInterface, reference: React.Ref<InputCheckboxReferenceInterface>) {
        // State
        const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
            properties.validationResult,
        );

        // References
        const inputCheckboxReference = React.useRef<FormInputReferenceInterface>(null);
        const { valueReference, setValue } = useFormInputValue(properties.defaultValue, inputCheckboxReference);

        // Function to focus on the component
        const focus = React.useCallback(function () {
            inputCheckboxReference.current?.focus();
        }, []);

        // Function to click the button
        const click = React.useCallback(function () {
            if(inputCheckboxReference.current && inputCheckboxReference.current.click) {
                inputCheckboxReference.current.click();
            }
        }, []);

        // Function to validate the component
        const propertiesValidate = properties.validate;
        const propertiesValidationSchema = properties.validationSchema;
        const propertiesOnValidate = properties.onValidate;
        const validate = React.useCallback(
            async function (value?: string) {
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

        // Function to handle form input value changes
        const propertiesOnChange = properties.onChange;
        const propertiesValidateOnChange = properties.validateOnChange;
        const onChangeIntercept = React.useCallback(
            function (value: InputCheckboxState | undefined, event?: Event, skipOnChangeCallback: boolean = false) {
                // console.log('FormInputCheckbox.tsx Form input value changed:', value);

                // Update the value reference
                setValue(value);

                // Optionally run the provided onChange function if provided
                if(!skipOnChangeCallback && propertiesOnChange) {
                    propertiesOnChange(value, event);
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
                setValue: function (value: InputCheckboxState | undefined, event?: Event) {
                    onChangeIntercept(value, event, true);
                },
                click: click,
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
                // label={properties.label} // Label rendered below
                // labelTip={properties.labelTip} // Label tip rendered below
                description={properties.description}
                disabled={properties.disabled}
                required={properties.required}
                focus={focus}
                validate={properties.validate}
                validating={properties.validating}
                validationResult={validationResult}
                showValidationSuccessResults={properties.showValidationSuccessResults}
                component={
                    <div className="relative flex items-center">
                        {/* Input Checkbox */}
                        <InputCheckbox
                            ref={inputCheckboxReference}
                            variant={properties.variant}
                            size={properties.size}
                            className={mergeClassNames('', properties.componentClassName)}
                            defaultValue={properties.defaultValue}
                            required={properties.required}
                            disabled={properties.disabled}
                            tabIndex={properties.tabIndex}
                            onChange={onChangeIntercept}
                            onBlur={properties.onBlur}
                            // Specific to InputCheckbox
                            buttonProperties={properties.buttonProperties}
                        />
                        {/* Label - Rendered here as a special case for checkboxes instead of in FormInput */}
                        <label
                            className="ml-2 cursor-pointer select-none text-sm font-medium"
                            onClick={function () {
                                click();

                                // TODO: There is a bug here where if you set the value directly,
                                // the form validation fails when the form is submitted. It shows
                                // the value as undefined. However, if you click the checkbox, the
                                // value is set correctly.

                                // Toggle the checkbox value
                                // let currentValue = inputCheckboxReference.current?.getValue();
                                // let newValue =
                                //     currentValue === InputCheckboxState.Checked
                                //         ? InputCheckboxState.Unchecked
                                //         : InputCheckboxState.Checked;
                                // inputCheckboxReference.current?.setValue(newValue);
                            }}
                        >
                            {properties.label}
                        </label>
                        {/* Label Tip - Rendered here as a special case for checkboxes instead of in FormInput */}
                        {properties.label && properties.labelTip && (
                            <TipIcon content={properties.labelTip} className="ml-1 max-w-xs" openOnPress />
                        )}
                        {properties.sibling}
                    </div>
                }
            />
        );
    },
);

// Set the display name for debugging purposes
FormInputCheckbox.displayName = 'FormInputCheckbox';

// Export - Default
export default FormInputCheckbox;
