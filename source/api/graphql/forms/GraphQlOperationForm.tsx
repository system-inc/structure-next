'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormValuesInterface,
    FormSubmitResponseInterface,
    FormProperties,
    Form,
} from '@structure/source/components/forms/Form';
import { FormInputReferenceInterface } from '@structure/source/components/forms/FormInput';
import { Alert } from '@structure/source/components/notifications/Alert';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { GraphQlDocument } from '@structure/source/api/graphql/utilities/GraphQlUtilities';
import { BaseError } from '@structure/source/api/errors/BaseError';
import { GraphQLOperationMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { generateFormInputs } from '@structure/source/api/graphql/forms/utilities/GraphQlFormUtilities';
import { extractGraphQlFormInputMetadataArrayFromGraphQlParameterMetadataArray } from '@structure/source/api/graphql/forms/utilities/GraphQlFormUtilities';
import {
    GraphQlFormSubmissionHandler,
    convertFormValuesToGraphQlMutationVariables,
} from '@structure/source/api/graphql/forms/GraphQlFormSubmissionHandler';

// Type - FormInputsProperties
export interface FormInputsProperties {
    [key: string]: Record<string, unknown>;
}

// A minimal valid query for when defaultValuesQuery is not provided
const noOpQuery = gql(`query NoOp { __typename }`);

// Component - GraphQlOperationForm
export interface GraphQlOperationFormProperties extends Omit<FormProperties, 'formInputs' | 'onSubmit'> {
    operation: GraphQLOperationMetadata<GraphQlDocument>;
    defaultValuesQuery?: {
        document: GraphQlDocument;
        variables: Record<string, unknown>;
    };
    inputComponentsProperties?: FormInputsProperties;
    onSubmit?: (
        formValues: FormValuesInterface,
        mutationResponseData: unknown,
        mutationResponseError: BaseError | null,
    ) => void | Promise<void>;
    showPreviewGraphQlMutationButton?: boolean;
}
export function GraphQlOperationForm(properties: GraphQlOperationFormProperties) {
    // State
    const [defaultValues, setDefaultValues] = React.useState<Record<string, unknown> | null>(null);
    const [previewFormValues, setPreviewFormValues] = React.useState<FormValuesInterface>({});
    const [isPreviewGraphQlMutationShown, setIsPreviewGraphQlMutationShown] = React.useState(false);
    const [formInputsReferencesMap] = React.useState(function () {
        return new Map<string, FormInputReferenceInterface>();
    });

    // Hooks
    const mutation = networkService.useGraphQlMutation(
        properties.operation.document as Parameters<typeof networkService.useGraphQlMutation>[0],
    );

    // Fetch default values if defaultValuesQuery is provided
    const defaultValuesQueryState = networkService.useGraphQlQuery(
        (properties.defaultValuesQuery?.document || noOpQuery) as Parameters<typeof networkService.useGraphQlQuery>[0],
        properties.defaultValuesQuery?.variables,
        {
            enabled: !!properties.defaultValuesQuery,
        },
    );

    // Effect to update the default values when the query loads data
    React.useEffect(
        function () {
            if(defaultValuesQueryState.data && typeof defaultValuesQueryState.data === 'object') {
                setDefaultValues(defaultValuesQueryState.data as Record<string, unknown>);
            }
        },
        [defaultValuesQueryState.data],
    );

    // Generate form inputs based on the GraphQL operation metadata
    const graphQlFormInputMetadataArray = extractGraphQlFormInputMetadataArrayFromGraphQlParameterMetadataArray(
        properties.operation.parameters,
    );

    // Generate form inputs based on the GraphQL operation metadata
    const formInputs = generateFormInputs(
        graphQlFormInputMetadataArray,
        formInputsReferencesMap,
        defaultValues,
        properties.inputComponentsProperties,
    );

    // Function to handle previewing the GraphQL mutation
    function handlePreviewGraphQlMutationClick() {
        // Collect current form values
        const currentFormValues: FormValuesInterface = {};
        formInputsReferencesMap.forEach(function (reference, id) {
            currentFormValues[id] = reference.getValue();
        });

        // Log the form values being used for preview
        console.log('Form values used for preview:', currentFormValues);

        setPreviewFormValues(currentFormValues);
        setIsPreviewGraphQlMutationShown(true);
    }

    // Function to handle form submission
    async function handleSubmit(formValues: FormValuesInterface): Promise<FormSubmitResponseInterface> {
        // Debug the raw form values that are sent directly from the form
        console.log('Form values from form submission:', JSON.stringify(formValues));

        // Collect current form values
        // Ideally we do not do this and the form values should just be passed in here
        const currentFormValues: FormValuesInterface = {};
        formInputsReferencesMap.forEach(function (reference, id) {
            currentFormValues[id] = reference.getValue();
        });

        // Use the form values directly for submission
        return GraphQlFormSubmissionHandler({
            formValues: currentFormValues,
            mutationFunction: async function (options: { variables: Record<string, unknown> }) {
                const result = await mutation.execute(options.variables);
                return {
                    data: result,
                    errors: undefined,
                };
            },
            onSubmit: properties.onSubmit,
        });
    }

    // Render the component
    return (
        <>
            {/* Render an error if defaultValuesQuery is provided and there's an error */}
            {properties.defaultValuesQuery && defaultValuesQueryState.error && (
                <Alert variant="Negative" title="Error">
                    <p>{defaultValuesQueryState.error.message}</p>
                </Alert>
            )}

            {/* Render the form */}
            <Form
                {...properties}
                loading={properties.defaultValuesQuery && defaultValuesQueryState.isLoading}
                formInputs={formInputs}
                onSubmit={handleSubmit}
            />

            {/* Preview Button */}
            {properties.showPreviewGraphQlMutationButton && (
                <Button className="mt-4" onClick={handlePreviewGraphQlMutationClick}>
                    Preview GraphQL Mutation
                </Button>
            )}

            {/* GraphQL Operation Preview Alert */}
            {isPreviewGraphQlMutationShown && (
                <div>
                    <pre className="rounded p-2 text-xs">
                        {JSON.stringify(convertFormValuesToGraphQlMutationVariables(previewFormValues), null, 4)}
                    </pre>
                </div>
            )}
        </>
    );
}
