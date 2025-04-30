'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormValuesInterface,
    FormSubmitResponseInterface,
    FormInterface,
    Form,
} from '@structure/source/common/forms/Form';
import { FormInputReferenceInterface } from '@structure/source/common/forms/FormInput';
import { Alert } from '@structure/source/common/notifications/Alert';

// Dependencies - API
import { useQuery, useMutation, ApolloError, DocumentNode } from '@apollo/client';
import { GraphQLOperationMetadata } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { generateFormInputs } from '@structure/source/api/graphql/forms/GraphQlFormUtilities';
import { extractGraphQlFormInputMetadataFromGraphQlParameters } from '@structure/source/api/graphql/forms/GraphQlFormUtilities';
import { GraphQlFormSubmissionHandler } from '@structure/source/api/graphql/forms/GraphQlFormSubmissionHandler';

// Type - FormInputsProperties
export interface FormInputsProperties {
    [key: string]: Record<string, unknown>;
}

// A minimal valid query document for when defaultValuesQuery is not provided
const noOpDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'NoOp' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
            },
        },
    ],
} as DocumentNode;

// Component - GraphQlOperationForm
export interface GraphQlOperationFormInterface extends Omit<FormInterface, 'formInputs' | 'onSubmit'> {
    operation: GraphQLOperationMetadata<DocumentNode>;
    defaultValuesQuery?: {
        document: DocumentNode;
        variables: Record<string, unknown>;
    };
    inputComponentsProperties?: FormInputsProperties;
    onSubmit?: (
        formValues: FormValuesInterface,
        mutationResponseData: unknown,
        mutationResponseError: ApolloError | null,
    ) => void | Promise<void>;
}
export function GraphQlOperationForm(properties: GraphQlOperationFormInterface) {
    // State
    const [defaultValues, setDefaultValues] = React.useState<Record<string, unknown> | null>(null);

    // References
    const formInputsReferencesMap = React.useRef(new Map<string, FormInputReferenceInterface>()).current;

    // Hooks
    const [mutation] = useMutation(properties.operation.document);

    // Fetch default values if defaultValuesQuery is provided
    const defaultValuesQueryState = useQuery(properties.defaultValuesQuery?.document || noOpDocument, {
        skip: !properties.defaultValuesQuery,
        variables: properties.defaultValuesQuery?.variables,
    });

    // Effect to update the default values when the query loads data
    React.useEffect(
        function () {
            if(defaultValuesQueryState.data) {
                setDefaultValues(defaultValuesQueryState.data);
            }
        },
        [defaultValuesQueryState.data],
    );

    // Prepare form inputs based on the GraphQL operation metadata
    const formInputs = React.useMemo(
        function () {
            // Generate the input metadata array from the operation parameters
            const inputMetadataArray = extractGraphQlFormInputMetadataFromGraphQlParameters(
                properties.operation.parameters,
            );

            // Generate the form inputs
            return generateFormInputs(
                inputMetadataArray,
                formInputsReferencesMap,
                defaultValues,
                properties.inputComponentsProperties,
            );
        },
        [properties.operation.parameters, properties.inputComponentsProperties, defaultValues, formInputsReferencesMap],
    );

    // Handle form submission
    const handleSubmit = React.useCallback(
        async function (formValues: FormValuesInterface): Promise<FormSubmitResponseInterface> {
            return GraphQlFormSubmissionHandler({
                formValues,
                mutationFunction: mutation,
                onSubmit: properties.onSubmit,
            });
        },
        [mutation, properties.onSubmit],
    );

    // Render the component
    return (
        <>
            {/* Render an error if defaultValuesQuery is provided and there's an error */}
            {properties.defaultValuesQuery && defaultValuesQueryState.error && (
                <Alert variant="error" title="Error">
                    <p>{defaultValuesQueryState.error.message}</p>
                </Alert>
            )}

            {/* Render the form */}
            <Form
                {...properties}
                loading={properties.defaultValuesQuery && defaultValuesQueryState.loading}
                formInputs={formInputs}
                onSubmit={handleSubmit}
            />
        </>
    );
}

// Export - Default
export default GraphQlOperationForm;
