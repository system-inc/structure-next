// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormSubmitResponseInterface,
    FormValuesInterface,
    FormInterface,
    Form,
} from '@structure/source/common/forms/Form';
import FormInputText from '@structure/source/common/forms/FormInputText';
import FormInputPassword from '@structure/source/common/forms/FormInputPassword';
import Alert from '@structure/source/common/notifications/Alert';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - API
import { useMutation, ApolloError } from '@apollo/client';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';

// Component - GraphQlMutationForm
export interface GraphQlMutationFormInterface extends Omit<FormInterface, 'formInputs' | 'onSubmit'> {
    mutationDocument: any;
    onSubmit?: (
        formValues: FormValuesInterface,
        mutationResponseData: any,
        mutationResponseError: ApolloError | null,
    ) => Promise<FormSubmitResponseInterface>;
}
export function GraphQlMutationForm(properties: GraphQlMutationFormInterface) {
    const [mutation, mutationState] = useMutation(properties.mutationDocument);

    function renderFormInputsUsingMutationDocument() {
        let formInputs = [];

        // Loop through the mutation document
        for(const input of properties.mutationDocument.definitions[0].variableDefinitions) {
            // console.log('input', input);

            // Determine the component
            let FormInputComponent: any;
            if(input.variable.name.value === 'password') {
                FormInputComponent = FormInputPassword;
            }
            else {
                FormInputComponent = FormInputText;
            }

            // Comonent properties
            const componentProperties: {
                id: string;
                key: string;
                [key: string]: any;
            } = {
                id: input.variable.name.value,
                key: input.variable.name.value,
                label: titleCase(input.variable.name.value),
                placeholder: titleCase(input.variable.name.value),
                required: true,
            };

            // If the component is FormInputText
            if(FormInputComponent == FormInputText) {
                // Default to text input
                componentProperties.type = 'text';

                // If the component is an email address
                if(input.variable.name.value === 'emailAddress') {
                    componentProperties.type = 'email';
                    componentProperties.placeholder = 'email@domain.com';
                    componentProperties.autoComplete = 'email';
                }
                else if(input.variable.name.value === 'password') {
                    componentProperties.type = 'password';
                }
            }

            // Add the form input
            formInputs.push(<FormInputComponent {...componentProperties} key={componentProperties.key} />);
        }

        return formInputs;
    }

    // Render the component
    return (
        <Form
            {...properties}
            formInputs={renderFormInputsUsingMutationDocument()}
            onSubmit={async function (formValues: FormValuesInterface) {
                console.log('Form onSubmit formValues:', formValues);

                // Variables to store the mutation response data and error
                let mutationResponseData = null;
                let mutationResponseError = null;

                // Invoke the GraphQL mutation
                try {
                    let mutationResponse = await mutation({
                        variables: {
                            ...formValues,
                        },
                    });

                    mutationResponseData = mutationResponse.data;
                }
                catch(error: any) {
                    // Handle any errors
                    console.log('mutationResponseError:', error);

                    // Cast the error as an ApolloError
                    mutationResponseError = error as ApolloError;
                }

                // Prepare the submitResponse
                let submitResponse = null;

                // If an onSubmit property has been provided
                if(properties.onSubmit) {
                    // Invoke the onSubmit property
                    submitResponse = await properties.onSubmit(formValues, mutationResponseData, mutationResponseError);
                }
                // If no onSubmit property has been provided, infer the submitResponse from the mutation response
                else {
                    // The message to display
                    let message = <></>;

                    // If there's been an error
                    if(mutationResponseError) {
                        message = (
                            <Alert variant="error" title="Error">
                                <p>There&apos;s been an error: {mutationResponseError.message}.</p>
                                <p>{JSON.stringify(mutationResponseError)}</p>
                            </Alert>
                        );
                    }
                    else {
                        message = (
                            <Alert icon={CheckCircledIcon} title={<b>Success!</b>}>
                                <p>The form was submitted successfully.</p>
                                <p>{JSON.stringify(mutationResponseData)}</p>
                            </Alert>
                        );
                    }

                    submitResponse = {
                        success: !mutationResponseError,
                        message: message,
                    };
                }

                return submitResponse;
            }}
        />
    );
}

// Export - Default
export default GraphQlMutationForm;
