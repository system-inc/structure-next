'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { FormValuesInterface, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';

// Dependencies - Main Components
import { Alert } from '@structure/source/common/notifications/Alert';

// Dependencies - API
import { ApolloError, FetchResult } from '@apollo/client';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { setValueAtDottedPathInObject } from '@structure/source/utilities/Object';

// Function to convert FormValues to GraphQL mutation variables
export function convertFormValuesToGraphQlMutationVariables(formValues: FormValuesInterface): Record<string, unknown> {
    // Initialize an empty object to store the mutation variables
    const mutationVariables: Record<string, unknown> = {};

    // Loop through the form values
    for(const [key, value] of Object.entries(formValues)) {
        let graphQlValue = value;

        // Split the key into parts
        const keyParts = key.split('.');

        // Handle booleans
        if(value === 'Checked') {
            graphQlValue = true;
        }
        else if(value === 'Unchecked') {
            graphQlValue = false;
        }

        // TODO: Remove this - hard coding this fix for now
        if(key === 'input.topicIds' && value) {
            graphQlValue = [value];
        }

        setValueAtDottedPathInObject(mutationVariables, keyParts, graphQlValue);
    }

    return mutationVariables;
}

// Function to handle form submission
export interface GraphQlFormSubmissionHandlerProperties<
    TGraphQlMutationResponseData = Record<string, unknown>,
    TGraphQlMutationVariables = Record<string, unknown>,
> {
    formValues: FormValuesInterface;
    mutationFunction: (options: {
        variables: TGraphQlMutationVariables;
    }) => Promise<FetchResult<TGraphQlMutationResponseData>>;
    onSubmit?: (
        formValues: FormValuesInterface,
        mutationResponseData: TGraphQlMutationResponseData | null,
        mutationResponseError: ApolloError | null,
    ) => void | Promise<void>;
}
export async function GraphQlFormSubmissionHandler<
    TGraphQlMutationResponseData = Record<string, unknown>,
    TGraphQlMutationVariables = Record<string, unknown>,
>(
    properties: GraphQlFormSubmissionHandlerProperties<TGraphQlMutationResponseData, TGraphQlMutationVariables>,
): Promise<FormSubmitResponseInterface> {
    console.log('formValues in GraphQlFormSubmissionHandler:', properties.formValues);

    // Variables to store the mutation response data and error
    let mutationResponseData: TGraphQlMutationResponseData | null = null;
    let mutationResponseError: ApolloError | null = null;

    // Convert form values to mutation variables
    const mutationVariables = convertFormValuesToGraphQlMutationVariables(
        properties.formValues,
    ) as TGraphQlMutationVariables;

    // Invoke the GraphQL mutation
    try {
        // Debug log to see what's being sent
        console.log('mutationVariables:', JSON.stringify(mutationVariables, null, 4));

        const mutationResponse = await properties.mutationFunction({
            variables: mutationVariables,
        });
        mutationResponseData = mutationResponse.data || null;
    }
    catch(error) {
        // Cast the error as an ApolloError
        mutationResponseError = error as ApolloError;
    }

    // Prepare the submitResponse
    let submitResponse: FormSubmitResponseInterface = {
        success: !mutationResponseError,
        message: undefined as unknown as React.ReactNode, // Will be updated below
    };

    // If an onSubmit property has been provided
    if(properties.onSubmit) {
        // Invoke the onSubmit property
        await properties.onSubmit(properties.formValues, mutationResponseData, mutationResponseError);
    }
    // If no onSubmit property has been provided, infer the submitResponse from the mutation response
    else {
        // The message to display
        let message: React.ReactNode;

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

        // Set the submitResponse
        submitResponse = {
            success: !mutationResponseError,
            message: message,
        };
    }

    return submitResponse;
}

// Export - Default
export default GraphQlFormSubmissionHandler;
