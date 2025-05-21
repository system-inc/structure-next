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
// import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';
import { InputTextAreaProperties, InputTextArea } from '@structure/source/common/forms/InputTextArea';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - FormInputTextArea
export interface FormInputTextAreaProperties
    extends Omit<InputTextAreaProperties, 'validate'>,
        Omit<FormInputProperties, 'component' | 'defaultValue' | 'onChange' | 'onBlur' | 'size'> {
    placeholder?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['placeholder'];
    autoComplete?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
    sibling?: React.ReactNode;
    onChange?: (value: string | undefined, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (value: string | undefined, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export const FormInputTextArea = React.forwardRef<FormInputReferenceInterface, FormInputTextAreaProperties>(function (
    properties: FormInputTextAreaProperties,
    reference: React.Ref<FormInputReferenceInterface>,
) {
    // State
    const [validating, setValidating] = React.useState<boolean>(properties.validating ?? false);
    const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
        properties.validationResult,
    );

    // References
    const inputTextAreaReference = React.useRef<FormInputReferenceInterface>(null);
    const { valueReference, setValue } = useFormInputValue(properties.defaultValue, inputTextAreaReference);

    // Function to focus on the component
    const focus = React.useCallback(function () {
        if(inputTextAreaReference.current) {
            inputTextAreaReference.current.focus();
        }
    }, []);

    // Function to validate the component
    const propertiesValidationSchema = properties.validationSchema;
    const propertiesValidate = properties.validate;
    const propertiesOnValidate = properties.onValidate;
    const validate = React.useCallback(
        async function (value: string | undefined) {
            // Set validating state
            setValidating(true);

            // Run the validation schema validation if provided
            const validationSchemaValidationResult = propertiesValidationSchema
                ? await propertiesValidationSchema.validate(value)
                : undefined;

            // Run the provided validate function from properties if provided
            const propertiesValidationResult = propertiesValidate
                ? await propertiesValidate(
                      value,
                      // Pass in the concurrent validation result
                      validationSchemaValidationResult,
                  )
                : undefined;

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

            // Set validating state
            setValidating(false);

            return mergedValidationResult;
        },
        [propertiesValidationSchema, propertiesValidate, propertiesOnValidate],
    );

    // Function to handle form input value changes
    const propertiesOnChange = properties.onChange;
    const propertiesValidateOnChange = properties.validateOnChange;
    const onChangeIntercept = React.useCallback(
        function (
            value: string | undefined,
            event?: React.ChangeEvent<HTMLTextAreaElement>,
            skipOnChangeCallback: boolean = false,
        ) {
            // Update the value
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

    // Function to handle form input blur events
    const propertiesOnBlur = properties.onBlur;
    const propertiesValidateOnBlur = properties.validateOnBlur;
    const onBlurIntercept = React.useCallback(
        function (
            value: string | undefined,
            event: React.ChangeEvent<HTMLTextAreaElement>,
            skipOnBlurCallback: boolean = false,
        ) {
            // Run the provided form input onBlur function if provided
            if(!skipOnBlurCallback && propertiesOnBlur) {
                propertiesOnBlur(value, event);
            }

            // Optionally run validation
            if(propertiesValidateOnBlur) {
                validate(value);
            }
        },
        [propertiesOnBlur, propertiesValidateOnBlur, validate],
    );

    // Expose functions to the parent component
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return valueReference.current;
            },
            setValue: function (value: string | undefined, event: React.ChangeEvent<HTMLTextAreaElement>) {
                onChangeIntercept(value, event, true);
            },
            focus: focus,
            validate: validate,
        };
    });

    // Render the component
    return (
        <FormInput
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
            validating={validating}
            validationResult={validationResult}
            showValidationSuccessResults={properties.showValidationSuccessResults}
            component={
                <div className="relative">
                    <InputTextArea
                        ref={inputTextAreaReference}
                        id={properties.id}
                        variant={properties.variant}
                        size={properties.size}
                        className={mergeClassNames('w-full', properties.componentClassName)}
                        defaultValue={properties.defaultValue}
                        required={properties.required}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        onChange={onChangeIntercept}
                        onBlur={onBlurIntercept}
                        onFocus={properties.onFocus}
                        // Specific to InputTextArea
                        placeholder={properties.placeholder}
                        autoComplete={properties.autoComplete}
                        rows={properties.rows}
                    />
                    {properties.sibling && properties.sibling}
                    {validating && (
                        <div className="absolute right-2.5 top-2 animate-spin">
                            <BrokenCircleIcon className="h-5 w-5" />
                        </div>
                    )}
                </div>
            }
        />
    );
});

// Set the display name for debugging purposes
FormInputTextArea.displayName = 'FormInputTextArea';
