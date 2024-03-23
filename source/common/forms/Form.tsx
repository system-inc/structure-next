// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormInputErrorInterface,
    FormInputReferenceInterface,
    FormInputInterface,
} from '@structure/source/common/forms/FormInput';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { ButtonInterface, Button } from '@structure/source/common/interactions/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { createDelayedUntilIdleFunction } from '@structure/source/utilities/Function';

// Interface - Form Values
export interface FormValuesInterface {
    [key: string]: any;
}

// Interface Form Inputs Errors
export interface FormInputsErrorsInterface {
    [id: string]: {
        errors: FormInputErrorInterface[];
        validatedValue: any;
    };
}

// Interface - Submit Response
export interface FormSubmitResponseInterface {
    message?: React.ReactNode;
    errors?: { [id: string]: FormInputErrorInterface[] };
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
    const formInputsDelayedUntilIdleFunctionsMap = React.useRef(new Map<string, NodeJS.Timeout>()).current;

    // State
    const [submittable, setSubmittable] = React.useState(properties.submittable ?? false);
    const [submitting, setSubmitting] = React.useState(properties.submitting ?? false);
    const [submitResponse, setSubmitResponse] = React.useState<FormSubmitResponseInterface | null>(
        properties.submitResponse ?? null,
    );
    const [formInputsValidating, setFormInputsValidating] = React.useState<{ [id: string]: boolean }>({});
    const [formInputsErrors, setFormInputsErrors] = React.useState<FormInputsErrorsInterface>({});

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
            setFormInputsErrors({});

            // Reset the submit response
            setSubmitResponse(null);
        },
        [properties.formInputs, formInputsReferencesMap],
    );

    // Function to handle form input validation
    // Validation errors are handled at the form level in case sibling form inputs need to be validated against each other
    const validateFormInput = React.useCallback(
        async function (formInputValue: any, formInput: React.ReactElement<FormInputInterface>) {
            let formInputIsValid = true;

            // Create a variable to store the errors
            let formInputToValidateErrors: FormInputErrorInterface[] = [];

            // console.log('Form.tsx - validateFormInput id:', formInput.props.id, 'value:', formInputValue);

            // Check if we have already validated the current value
            if(
                formInputsErrors[formInput.props.id]?.validatedValue &&
                formInputValue == formInputsErrors[formInput.props.id]?.validatedValue
            ) {
                // console.log(
                //     'Already validated, skipping validation for:',
                //     formInput.props.id,
                //     'value:',
                //     formInputValue,
                // );
                formInputToValidateErrors = formInputsErrors[formInput.props.id]?.errors || [];
            }
            // If we haven't validated the current value
            else {
                // Mark the form input as validating
                setFormInputsValidating((previousValue) => ({ ...previousValue, [formInput.props.id]: true }));

                // If the form input is required
                if(formInput?.props.required) {
                    if(!formInputValue) {
                        formInputToValidateErrors.push({ message: 'This field is required.' });
                    }
                }

                // console.log('formInputReference', formInputReference);

                // Get the form input reference
                let formInputReference = formInputsReferencesMap.get(formInput.props.id);

                // Validate the form input using its referenced internal validate function
                formInputToValidateErrors.push(...((await formInputReference?.validate?.(formInputValue)) || []));
                // console.log('formInputToValidateErrors', formInputToValidateErrors);

                // Validate the form input using its provided validate property
                formInputToValidateErrors.push(...((await formInput?.props.validate?.(formInputValue)) || []));

                // Update the state
                setFormInputsErrors((previousFormInputsErrors) => ({
                    ...previousFormInputsErrors,
                    [formInput.props.id]: {
                        errors: formInputToValidateErrors,
                        validatedValue: formInputValue,
                    },
                }));

                // Mark the form input as not validating
                setFormInputsValidating((previousValue) => ({ ...previousValue, [formInput.props.id]: false }));
            }

            // Return the valid state
            if(formInputToValidateErrors.length > 0) {
                setSubmittable(false);
                formInputIsValid = false;
            }
            else {
                setSubmittable(true);
            }

            return formInputIsValid;
        },
        [formInputsReferencesMap, formInputsErrors],
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

                // If there are errors in the response
                if(formSubmitResponse.errors) {
                    // console.log('formSubmitResponse.errors', formSubmitResponse.errors);

                    for(let formInputId in formSubmitResponse.errors) {
                        // console.log('formInputId', formInputId);

                        // Get the current form input errors
                        let currentFormInputErrors = formSubmitResponse.errors[formInputId];
                        // console.log('currentFormInputErrors', currentFormInputErrors);

                        // Get the form input reference
                        let formInputReference = formInputsReferencesMap.get(formInputId);

                        // Get the form input value
                        let formInputValue = formInputReference?.getValue();

                        // Update the form input errors
                        setFormInputsErrors((previousFormInputsErrors) => ({
                            ...previousFormInputsErrors,
                            [formInputId]: {
                                errors: currentFormInputErrors ? currentFormInputErrors : [],
                                validatedValue: formInputValue,
                            },
                        }));
                    }
                }
                // If the form submission was successful
                else {
                    // Reset the form
                    if(resetOnSubmitSuccess) {
                        console.log('resetting!');
                        reset();
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
                // Check for an existing timeout
                const existingTimeout = formInputsDelayedUntilIdleFunctionsMap.get(formInput.props.id);

                // Check if a delayed function exists for this form input, create if not
                if(existingTimeout) {
                    // Clear the existing timeout
                    clearTimeout(existingTimeout);
                }

                // Create a new timeout and wait for the input to be idle
                let newTimeout = setTimeout(function () {
                    validateFormInput(formInputValue, formInput);
                }, 750);

                formInputsDelayedUntilIdleFunctionsMap.set(formInput.props.id, newTimeout);
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
        [formInputsDelayedUntilIdleFunctionsMap, validateFormInput],
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
                        validateFormInput(formInputValue, formInput);
                    },
                    validating: formInputValidating,
                    errors: formInputsErrors[formInput.props.id]?.errors,
                });

                return formInputClone;
            });
        },
        [
            properties.formInputs,
            formInputsReferencesMap,
            formInputsValidating,
            formInputsErrors,
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
