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
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';
import { InputTextInterface, InputText } from '@structure/source/common/forms/InputText';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - FormInputText
export interface FormInputTextInterface
    extends Omit<InputTextInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
    autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    sibling?: React.ReactNode;
    onChange?: (value: string | undefined, event?: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (value: string | undefined, event?: React.ChangeEvent<HTMLInputElement>) => void;
}
export const FormInputText = React.forwardRef<FormInputReferenceInterface, FormInputTextInterface>(function (
    properties: FormInputTextInterface,
    reference: React.Ref<FormInputReferenceInterface>,
) {
    // State
    const [validating, setValidating] = React.useState<boolean>(properties.validating ?? false);
    const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
        properties.validationResult,
    );

    // References
    const inputTextReference = React.useRef<FormInputReferenceInterface>(null);
    const { valueReference, setValue } = useFormInputValue(properties.defaultValue, inputTextReference);

    // Defaults
    const type = properties.type ?? 'text';

    // Function to focus on the component
    const focus = React.useCallback(function () {
        if(inputTextReference.current) {
            inputTextReference.current.focus();
        }
    }, []);

    // Function to validate the component
    const propertiesType = properties.type;
    const propertiesValidationSchema = properties.validationSchema;
    const propertiesValidate = properties.validate;
    const propertiesOnValidate = properties.onValidate;
    const validate = React.useCallback(
        async function (value: string | undefined) {
            // Set validating state
            setValidating(true);

            // Apply email address validation to form input text components which are of type email
            let validationResult = undefined;
            if(propertiesType === 'email') {
                validationResult = await new ValidationSchema().emailAddress().validate(value);
            }

            // Run the validation schema validation if provided
            const validationSchemaValidationResult = propertiesValidationSchema
                ? await propertiesValidationSchema.validate(value)
                : undefined;

            // Run the provided validate function from properties if provided
            const propertiesValidationResult = propertiesValidate
                ? await propertiesValidate(
                      value,
                      // Pass in the concurrent validation result
                      mergeValidationResults(validationResult, validationSchemaValidationResult),
                  )
                : undefined;

            // Merge the validation results
            const mergedValidationResult = mergeValidationResults(
                validationResult,
                validationSchemaValidationResult,
                propertiesValidationResult,
            );
            // console.log('mergedValidationResult', mergedValidationResult);

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
        [propertiesType, propertiesValidationSchema, propertiesValidate, propertiesOnValidate],
    );

    // Function to handle form input value changes
    const propertiesOnChange = properties.onChange;
    const propertiesValidateOnChange = properties.validateOnChange;
    const onChangeIntercept = React.useCallback(
        function (
            value: string | undefined,
            event?: React.ChangeEvent<HTMLInputElement>,
            skipOnChangeCallback: boolean = false,
        ) {
            // console.log('Form input value changed:', value);

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
            event: React.ChangeEvent<HTMLInputElement>,
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
            setValue: function (value: string | undefined, event: React.ChangeEvent<HTMLInputElement>) {
                onChangeIntercept(value, event, true);
            },
            focus: focus,
            validate: validate,
        };
    });

    // console.log('validationResult', validationResult);

    // Render the component
    return (
        <FormInput
            id={properties.id}
            size={properties.size}
            className={mergeClassNames('', properties.className)}
            defaultValue={properties.defaultValue}
            label={properties.label}
            labelContainerClassName={properties.labelContainerClassName}
            labelClassName={properties.labelClassName}
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
                    <InputText
                        ref={inputTextReference}
                        id={properties.id}
                        variant={properties.variant}
                        size={properties.size}
                        containerClassName={properties.containerClassName}
                        className={mergeClassNames(
                            'w-full',
                            properties.componentClassName,
                            // validationResult?.valid === false ? 'text-red-500 dark:text-red-500' : '',
                        )}
                        defaultValue={properties.defaultValue}
                        required={properties.required}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        onChange={onChangeIntercept}
                        onBlur={onBlurIntercept}
                        onFocus={properties.onFocus}
                        onKeyDown={properties.onKeyDown}
                        onKeyUp={properties.onKeyUp}
                        // Specific to InputText
                        type={type}
                        placeholder={properties.placeholder}
                        autoComplete={properties.autoComplete}
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
FormInputText.displayName = 'FormInputText';

// Export - Default
export default FormInputText;
