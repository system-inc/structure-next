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

// Dependencies - Animations
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - Utilities
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Interface - Form Values
export interface FormValuesInterface {
    [key: string]: any;
}

// Interface Form Inputs Validation Results
export interface FormInputsValidationResultsInterface {
    [id: string]: ValidationResult | undefined;
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
    onSubmit: (values: FormValuesInterface) => FormSubmitResponseInterface | Promise<FormSubmitResponseInterface>;
    onSubmitSuccess?: (response: FormSubmitResponseInterface) => void;
    className?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    buttonProperties?: ButtonInterface;
    footer?: React.ReactNode;
    error?: React.ReactNode;
    loading?: boolean;
    submittable?: boolean;
    submitting?: boolean;
    submitResponse?: FormSubmitResponseInterface;
    resetOnSubmitSuccess?: boolean;
}
export function Form(properties: FormInterface) {
    // References
    const formInputsReferencesMap = React.useRef(new Map<string, FormInputReferenceInterface>()).current;

    // State
    const [submittable, setSubmittable] = React.useState(properties.submittable ?? true);
    const [submitting, setSubmitting] = React.useState(properties.submitting ?? false);
    const [submitResponse, setSubmitResponse] = React.useState<FormSubmitResponseInterface | null>(
        properties.submitResponse ?? null,
    );
    const [formInputsValidating, setFormInputsValidating] = React.useState<{ [id: string]: boolean }>({});
    const [formInputsValidationResults, setFormInputsValidationResults] =
        React.useState<FormInputsValidationResultsInterface>({});

    // Defaults
    const resetOnSubmitSuccess = properties.resetOnSubmitSuccess ?? false;

    // Memoized button properties
    const buttonProperties: ButtonInterface = React.useMemo(
        function () {
            return {
                ...properties.buttonProperties,
                type: 'submit',
                disabled: submitting || properties.buttonProperties?.disabled,
                processing: submitting,
            };
        },
        [properties.buttonProperties, submitting],
    );

    // Function to reset the form
    const reset = React.useCallback(
        function () {
            // Loop over all form inputs and reset them
            for(const formInput of properties.formInputs) {
                // Get the form input reference
                const formInputReference = formInputsReferencesMap.get(formInput.props.id);

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
        async function (
            formInputValue: unknown,
            formInput: React.ReactElement<FormInputInterface>,
        ): Promise<ValidationResult | undefined> {
            // console.log('Form.tsx - validateFormInput id:', formInput.props.id, 'value:', formInputValue);

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
                    // console.log('formInput.props.id', formInput.props.id, 'is required!');

                    // Create a required validation schema
                    const requiredValidationSchema = new ValidationSchema().required();

                    // Validate the form input using the required validation schema
                    formLevelFormInputValidationResult = await requiredValidationSchema.validate(formInputValue);
                    // console.log('formLevelFormInputValidationResult', formLevelFormInputValidationResult);
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
            }
            // Otherwise, we assume the form input is valid
            else {
                setSubmittable(true);
            }

            return formInputValidationResult;
        },
        [formInputsReferencesMap, formInputsValidationResults],
    );

    // Function to validate the form
    const validateFormInputs = React.useCallback(
        async function () {
            let formInputsAreValid = true;
            const formInputsValidationResultsNotUsingState: FormInputsValidationResultsInterface = {};

            // Loop over and validate all inputs
            for(const formInput of properties.formInputs) {
                // Get the form input reference
                const formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Get the form input value
                const formInputValue = formInputReference?.getValue();
                // console.log('formInputValue', formInput.props.id, formInputValue);

                // Validate the form input
                const formInputValidationResult = await validateFormInput(formInputValue, formInput);

                // If the validation result is invalid
                if(formInputValidationResult && formInputValidationResult.valid === false) {
                    formInputsAreValid = false;
                }

                // Add the validation result to the form inputs validation results
                formInputsValidationResultsNotUsingState[formInput.props.id] = formInputValidationResult;
            }

            return {
                formInputsAreValid: formInputsAreValid,
                formInputsValidationResultsNotUsingState: formInputsValidationResultsNotUsingState,
            };
        },
        [properties.formInputs, formInputsReferencesMap, validateFormInput],
    );

    // Function to handle form submission
    const onSubmitIntercept = React.useCallback(
        async function (event: React.FormEvent<HTMLFormElement>) {
            try {
                // Reset the submit response
                setSubmitResponse(null);

                // Set the submitting state
                setSubmitting(true);

                // Prevent the default form submission
                event.preventDefault();

                // Validate all inputs before submitting
                const { formInputsAreValid, formInputsValidationResultsNotUsingState } = await validateFormInputs();

                // If there are errors
                if(!formInputsAreValid) {
                    // console.log('There are errors!, Not submitting!', formInputsValidationResults);

                    // Loop over the formInputsValidationResults and find the first id of the form input that has an errors object
                    const firstInvalidFormInputId = Object.entries(formInputsValidationResultsNotUsingState).find(
                        function (entry) {
                            return entry[1]?.valid === false;
                        },
                    )?.[0];
                    // console.log('firstInvalidFormInputId', firstInvalidFormInputId);

                    // If we found a first invalid form input
                    if(firstInvalidFormInputId) {
                        // Get the form input reference
                        const formInputReference = formInputsReferencesMap.get(firstInvalidFormInputId);

                        // Let the state update and then focus on the first invalid form input
                        formInputReference?.focus?.();
                    }
                }
                // If the form inputs are valid
                else {
                    // Gather the form values
                    const formValues: FormValuesInterface = {};
                    properties.formInputs.forEach(function (formInput) {
                        formValues[formInput.props.id] = formInputsReferencesMap.get(formInput.props.id)?.getValue();
                    });

                    // Proceed with form submission
                    const formSubmitResponse = await properties.onSubmit(formValues);

                    // The form submission may return validation results from the API for individual form inputs

                    // If the form submission was successful
                    if(formSubmitResponse.success) {
                        // Optionally run the onSubmitSuccess callback
                        properties.onSubmitSuccess?.(formSubmitResponse);

                        // Optionally reset the form
                        if(resetOnSubmitSuccess) {
                            console.log('Resetting form.');
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
                            for(const formInputId in formSubmitResponse.validationResults) {
                                // console.log('formInputId', formInputId);

                                // Get the current form input errors
                                const currentFormInputValidationResult =
                                    formSubmitResponse.validationResults[formInputId];
                                // console.log('currentFormInputValidationResult', currentFormInputValidationResult);

                                // Get the form input reference
                                // const formInputReference = formInputsReferencesMap.get(formInputId);

                                // Get the form input value
                                // const formInputValue = formInputReference?.getValue();

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
            }
            catch(error) {
                console.error(error);
            } finally {
                setSubmitting(false);
            }
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
        function (formInputValue: unknown, formInput: React.ReactElement<FormInputInterface>, event?: Event) {
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
            // If the form is loading
            if(properties.loading) {
                // Render placeholder animations for each form input
                return (
                    <div className="space-y-4">
                        {properties.formInputs.map(function (formInput) {
                            // Skip placeholder for hidden inputs
                            if(formInput.props.className?.includes('hidden')) {
                                return null;
                            }

                            return <PlaceholderAnimation key={formInput.props.id} className="h-[64px] w-full" />;
                        })}
                    </div>
                );
            }

            return properties.formInputs.map(function (formInput) {
                // Get the reference to the form input
                // const formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Get the validating status for the form input
                const formInputValidating = formInputsValidating[formInput.props.id] || false;

                // Clone the form input and pass in the necessary properties
                const formInputClone = React.cloneElement(formInput, {
                    ref: (reference: FormInputReferenceInterface | null) => {
                        if(reference) {
                            attachFormInputReference(formInput.props.id, reference);
                        }
                    },
                    tabIndex: 1,
                    // Intercept the onChange events to handle form input validation
                    // We use any here because the onChange event type is different for each form input type
                    onChange: (formInputValue: unknown, event?: Event) => {
                        onFormInputChangeIntercept(formInputValue, formInput, event);
                    },
                    onBlur: (formInputValue: unknown) => {
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
            properties.loading,
            properties.formInputs,
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
                {...buttonProperties}
                type="submit"
                disabled={properties.loading || submitting || !submittable || buttonProperties?.disabled}
                processing={submitting || buttonProperties?.processing}
            >
                {buttonProperties?.children ?? 'Submit'}
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
