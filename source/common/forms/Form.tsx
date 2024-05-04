// Dependencies - React and Next.js
import React from 'react';

// Export a standardized version of React's useForm hook
import {
    useForm as reactHookFormUseForm,
    FieldValues,
    UseFormProps as UseFormProperties,
    UseFormReturn,
    SubmitHandler as FormSubmitFunctionType,
} from 'react-hook-form';
export { type FormSubmitFunctionType };
type StandardizedUseFormReturn<T extends FieldValues> = {
    setInputValue: UseFormReturn<T>['setValue'];
    getInputValue: UseFormReturn<T>['getValues'];
    getInputValues: UseFormReturn<T>['getValues'];
    watchInputValue: UseFormReturn<T>['watch'];
    watchInputValues: UseFormReturn<T>['watch'];
    registerInput: UseFormReturn<T>['register'];
    state: UseFormReturn<T>['formState'];
    submit: UseFormReturn<T>['handleSubmit'];
};
export function useForm<T extends FieldValues>(properties?: UseFormProperties<T>): StandardizedUseFormReturn<T> {
    const { setValue, getValues, watch, register, formState, handleSubmit } = reactHookFormUseForm<T>(properties);

    return {
        setInputValue: setValue,
        getInputValue: getValues,
        getInputValues: getValues,
        watchInputValue: watch,
        watchInputValues: watch,
        registerInput: register,
        state: formState,
        submit: handleSubmit,
    };
}

// Dependencies - Main Components
import { FormInputReferenceInterface, FormInputInterface } from '@structure/source/common/forms/FormInput';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Interface - Form Values
export interface FormValuesInterface {
    [key: string]: any;
}

// Interface Form Inputs Validation Results
export interface FormInputsValidationResultsInterface {
    [id: string]: ValidationResult;
}

// Interface - Submit Response
export interface FormSubmitResponseInterface {
    success: boolean;
    message?: React.ReactNode;
    validationResults?: { [id: string]: ValidationResult };
    time?: Date;
    timeElapsedInMilliseconds?: number;
    redirectUrl?: string;
}

// Component - Form
export interface FormInterface {
    formInputs: React.ReactElement<FormInputInterface>[];
    onSubmit: (values: FormValuesInterface) => Promise<FormSubmitResponseInterface>;
    className?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    buttonProperties?: ButtonInterface;
    footer?: React.ReactNode;
    error?: React.ReactNode;
    submittable?: boolean;
    submitting?: boolean;
    submitResponse?: FormSubmitResponseInterface;
    resetOnSubmitSuccess?: boolean;
}
export function Form(properties: FormInterface) {
    // References
    const formInputsReferencesMap = React.useRef(new Map<string, FormInputReferenceInterface>()).current;

    // State
    const [submittable, setSubmittable] = React.useState(properties.submittable ?? false);
    const [submitting, setSubmitting] = React.useState(properties.submitting ?? false);
    const [submitResponse, setSubmitResponse] = React.useState<FormSubmitResponseInterface | null>(
        properties.submitResponse ?? null,
    );
    const [formInputsValidating, setFormInputsValidating] = React.useState<{ [id: string]: boolean }>({});
    const [formInputsValidationResults, setFormInputsValidationResults] =
        React.useState<FormInputsValidationResultsInterface>({});

    // Defaults
    const resetOnSubmitSuccess = properties.resetOnSubmitSuccess ?? false;

    // On mount, set the submittable state to true
    React.useEffect(function () {
        setSubmittable(true);
    }, []);

    // Function to reset the form
    const reset = React.useCallback(
        function () {
            // Loop over all form inputs and reset them
            for(let formInput of properties.formInputs) {
                // Get the form input reference
                let formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Reset the form input
                formInputReference?.setValue(formInput.props.defaultValue);
            }

            // Reset the form input errors
            setFormInputsValidationResults({});

            // Reset the submit response
            setSubmitResponse(null);
        },
        [properties.formInputs, formInputsReferencesMap],
    );

    // Function to handle form input validation
    // Validation errors are handled at the form level in case sibling form inputs need to be validated against each other
    const validateFormInput = React.useCallback(
        async function (formInputValue: any, formInput: React.ReactElement<FormInputInterface>) {
            // console.log('Form.tsx - validateFormInput id:', formInput.props.id, 'value:', formInputValue);

            let formInputIsValid = true;

            // Create a variable to store the validation result
            let formInputValidationResult: ValidationResult | undefined = undefined;

            // Check if we have already validated the current value
            if(
                formInputsValidationResults[formInput.props.id] &&
                formInputValue == formInputsValidationResults[formInput.props.id]?.value
            ) {
                // console.log(
                //     'Already validated, skipping validation for:',
                //     formInput.props.id,
                //     'value:',
                //     formInputValue,
                // );
                formInputValidationResult = formInputsValidationResults[formInput.props.id];
            }
            // If we haven't validated the current value
            else {
                // Mark the form input as validating
                setFormInputsValidating((previousFormInputsValidating) => ({
                    ...previousFormInputsValidating,
                    [formInput.props.id]: true,
                }));

                // Perform form level validation, mainly for required fields but this may be extended in the future
                let formLevelFormInputValidationResult: ValidationResult | undefined = undefined;

                // If the form input is required
                if(formInput?.props.required) {
                    // Create a required validation schema
                    const requiredValidationSchema = new ValidationSchema().required();

                    // Validate the form input using the required validation schema
                    formLevelFormInputValidationResult = await requiredValidationSchema.validate(formInputValue);
                }

                // console.log('formInputReference', formInputReference);

                // Get the form input reference
                const formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Validate the form input using the form input's validate function
                // All form input components should have a validate function which uses their validate property
                // Form input components may also provide custom validation logic in their validate function
                // beyond what is provided in the validate property.
                // E.g., FormInputText's validate function uses the provided property as well as a custom email address check
                const formInputLevelValidationResult = await formInputReference?.validate?.(formInputValue);

                // The form input level validation result is the merge of the form level and form input level validation results
                formInputValidationResult = mergeValidationResults(
                    formLevelFormInputValidationResult,
                    formInputLevelValidationResult,
                );
                // console.log('formInputToValidateErrors', formInputToValidateErrors);

                // Update the state
                if(formInputValidationResult) {
                    setFormInputsValidationResults(function (previousFormInputsValidationResults) {
                        const newFormInputsValidationResults = { ...previousFormInputsValidationResults };
                        if(formInputValidationResult !== undefined) {
                            newFormInputsValidationResults[formInput.props.id] = formInputValidationResult;
                        }
                        return newFormInputsValidationResults;
                    });
                }

                // Mark the form input as not validating
                setFormInputsValidating((previousValue) => ({ ...previousValue, [formInput.props.id]: false }));
            }

            // If the validation result is affirmatively invalid
            // This means we are explicitly checking if the validation result exists and .valid is false
            if(formInputValidationResult && formInputValidationResult.valid === false) {
                setSubmittable(false);
                formInputIsValid = false;
            }
            // Otherwise, we assume the form input is valid
            else {
                setSubmittable(true);
            }

            return formInputIsValid;
        },
        [formInputsReferencesMap, formInputsValidationResults],
    );

    // Function to validate the form
    const validateFormInputs = React.useCallback(
        async function () {
            let formInputsAreValid = true;

            // Loop over and validate all inputs
            for(let formInput of properties.formInputs) {
                // Get the form input reference
                let formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Get the form input value
                let formInputValue = formInputReference?.getValue();
                // console.log('formInputValue', formInput.props.id, formInputValue);

                // Validate the form input
                let formInputIsValid = await validateFormInput(formInputValue, formInput);

                if(!formInputIsValid) {
                    formInputsAreValid = false;
                }
            }

            return formInputsAreValid;
        },
        [properties.formInputs, formInputsReferencesMap, validateFormInput],
    );

    // Function to handle form submission
    const onSubmitIntercept = React.useCallback(
        async function (event: React.FormEvent<HTMLFormElement>) {
            // console.log('onSubmitIntercept', event);

            setSubmitResponse(null);

            // Set the submitting state
            setSubmitting(true);

            // Prevent the default form submission
            event.preventDefault();

            // Validate all inputs before submitting
            let formInputsAreValid = await validateFormInputs();

            // If there are errors
            if(!formInputsAreValid) {
                // console.log('There are errors!, Not submitting!');
            }
            // If the form inputs are valid
            else {
                // Gather the form values
                const formValues: FormValuesInterface = {};
                properties.formInputs.forEach(function (formInput) {
                    formValues[formInput.props.id] = formInputsReferencesMap.get(formInput.props.id)?.getValue();
                });

                // Proceed with form submission
                let formSubmitResponse = await properties.onSubmit(formValues);

                // The form submission may return validation results from the API for individual form inputs

                // If the form submission was successful
                if(formSubmitResponse.success) {
                    // Optionally reset the form
                    if(resetOnSubmitSuccess) {
                        console.log('resetting!');
                        reset();
                    }
                }
                // If the form submission was not successful
                else {
                    // If validation results were provided in the response
                    // This allows for server side validation of individual form inputs
                    if(formSubmitResponse.validationResults) {
                        // console.log('formSubmitResponse.validationResults', formSubmitResponse.validationResults);

                        // Loop over the validation results
                        for(let formInputId in formSubmitResponse.validationResults) {
                            // console.log('formInputId', formInputId);

                            // Get the current form input errors
                            let currentFormInputValidationResult = formSubmitResponse.validationResults[formInputId];
                            // console.log('currentFormInputValidationResult', currentFormInputValidationResult);

                            // Get the form input reference
                            let formInputReference = formInputsReferencesMap.get(formInputId);

                            // Get the form input value
                            let formInputValue = formInputReference?.getValue();

                            // Update the form input validation results using the new validation results
                            setFormInputsValidationResults(function (previousFormInputsValidationResults) {
                                const newFormInputsValidationResults = { ...previousFormInputsValidationResults };
                                if(currentFormInputValidationResult !== undefined) {
                                    newFormInputsValidationResults[formInputId] = currentFormInputValidationResult;
                                }
                                return newFormInputsValidationResults;
                            });
                        }
                    }
                }

                setSubmitResponse(formSubmitResponse);
            }

            // Set the submitting state
            setSubmitting(false);
        },
        [reset, resetOnSubmitSuccess, formInputsReferencesMap, validateFormInputs, properties],
    );

    // Attach a reference to each form input
    const attachFormInputReference = React.useCallback(
        function (formInputId: string, reference: FormInputReferenceInterface) {
            if(reference) {
                formInputsReferencesMap.set(formInputId, reference);
            }
            else {
                formInputsReferencesMap.delete(formInputId);
            }
        },
        [formInputsReferencesMap],
    );

    // Function to handle form input changes
    const onFormInputChangeIntercept = React.useCallback(
        function (formInputValue: any, formInput: React.ReactElement<FormInputInterface>, event?: Event) {
            // console.log('Form input onChange formInputValue', formInputValue, 'formInput', formInput, 'event', event);

            // If the form input is FormInputText, we delay the validation until the input is idle
            if(formInput.type === FormInputText) {
                // Validating text inputs, even using a debounce, is super distracting for the user
                // Especially on mobile
                // So, we will skip validation of text inputs for now, we can make this a configuration option later
                // For now, text inputs will not validate on change, instead, just on blur
                // PREVIOUS CODE FOR DEBOUNCED VALIDATION:
                // // Check for an existing timeout
                // const existingTimeout = formInputsDelayedUntilIdleFunctionsMap.get(formInput.props.id);
                // // Check if a delayed function exists for this form input, create if not
                // if(existingTimeout) {
                //     // Clear the existing timeout
                //     clearTimeout(existingTimeout);
                // }
                // // Create a new timeout and wait for the input to be idle
                // let newTimeout = setTimeout(function () {
                //     validateFormInput(formInputValue, formInput);
                // }, 750);
                // formInputsDelayedUntilIdleFunctionsMap.set(formInput.props.id, newTimeout);
            }
            // Otherwise, we validate the form input immediately
            else {
                validateFormInput(formInputValue, formInput);
            }

            // Run the provided form input onChange function if provided
            if(formInput.props.onChange) {
                // Invoke the onChange callback
                formInput.props.onChange(formInputValue, event);
            }
        },
        [validateFormInput],
    );

    // Function to render form inputs
    const renderFormInputs = React.useMemo(
        function () {
            return properties.formInputs.map(function (formInput) {
                // Get the reference to the form input
                let formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Get the validating status for the form input
                let formInputValidating = formInputsValidating[formInput.props.id] || false;

                // Clone the form input and pass in the necessary properties
                let formInputClone = React.cloneElement(formInput, {
                    ref: (reference: FormInputReferenceInterface | null) => {
                        if(reference) {
                            attachFormInputReference(formInput.props.id, reference);
                        }
                    },
                    tabIndex: 1,
                    // Intercept the onChange events to handle form input validation
                    // We use any here because the onChange event type is different for each form input type
                    onChange: (formInputValue: any, event?: Event) => {
                        onFormInputChangeIntercept(formInputValue, formInput, event);
                    },
                    onBlur: (formInputValue: any, event?: Event) => {
                        // If the form input is FormInputText, we validate on blur
                        if(formInput.type === FormInputText) {
                            validateFormInput(formInputValue, formInput);
                        }
                    },
                    validating: formInputValidating,
                    validationResult: formInputsValidationResults[formInput.props.id],
                });

                return formInputClone;
            });
        },
        [
            properties.formInputs,
            formInputsReferencesMap,
            formInputsValidating,
            formInputsValidationResults,
            attachFormInputReference,
            onFormInputChangeIntercept,
            validateFormInput,
        ],
    );

    // Render the component
    return (
        <form onSubmit={onSubmitIntercept} className={mergeClassNames('space-y-6', properties.className)}>
            {/* Title */}
            {properties.title && properties.title}

            {/* Description */}
            {properties.description && properties.description}

            {/* Form Inputs */}
            <div className="space-y-4">{renderFormInputs}</div>

            {/* Button */}
            <Button
                tabIndex={1}
                variant="contrast"
                type="submit"
                disabled={submitting}
                // tip={submittable ? undefined : 'Please complete the required fields.'}
                processing={submitting}
                {...properties.buttonProperties}
            >
                {properties.buttonProperties?.children ?? 'Submit'}
            </Button>

            {/* Error */}
            {properties.error && properties.error}

            {/* Submit Response */}
            {submitResponse && submitResponse.message && <div>{submitResponse.message}</div>}

            {/* Footer */}
            {properties.footer && properties.footer}
        </form>
    );
}

// Export - Default
export default Form;
