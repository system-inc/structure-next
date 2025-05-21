'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    FormValuesInterface,
    FormSubmitResponseInterface,
    FormProperties,
    Form,
} from '@structure/source/common/forms/Form';
import { FormInputReferenceInterface } from '@structure/source/common/forms/FormInput';
import { Alert } from '@structure/source/common/notifications/Alert';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
import { useQuery, useMutation, ApolloError, DocumentNode } from '@apollo/client';
import { GraphQLOperationMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { generateFormInputs } from '@structure/source/api/graphql/forms/GraphQlFormUtilities';
import { extractGraphQlFormInputMetadataArrayFromGraphQlParameterMetadataArray } from '@structure/source/api/graphql/forms/GraphQlFormUtilities';
import {
    GraphQlFormSubmissionHandler,
    convertFormValuesToGraphQlMutationVariables,
} from '@structure/source/api/graphql/forms/GraphQlFormSubmissionHandler';

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
export interface GraphQlOperationFormProperties extends Omit<FormProperties, 'formInputs' | 'onSubmit'> {
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
    showPreviewGraphQlMutationButton?: boolean;
}
export function GraphQlOperationForm(properties: GraphQlOperationFormProperties) {
    // State
    const [defaultValues, setDefaultValues] = React.useState<Record<string, unknown> | null>(null);
    const [previewFormValues, setPreviewFormValues] = React.useState<FormValuesInterface>({});
    const [isPreviewGraphQlMutationShown, setIsPreviewGraphQlMutationShown] = React.useState(false);

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
            const graphQlFormInputMetadataArray = extractGraphQlFormInputMetadataArrayFromGraphQlParameterMetadataArray(
                properties.operation.parameters,
            );

            // Generate the form inputs
            return generateFormInputs(
                graphQlFormInputMetadataArray,
                formInputsReferencesMap,
                defaultValues,
                properties.inputComponentsProperties,
            );
        },
        [properties.operation.parameters, properties.inputComponentsProperties, defaultValues, formInputsReferencesMap],
    );

    // Handle preview button click
    const handlePreviewGraphQlMutationClick = React.useCallback(
        function () {
            // Collect current form values
            const currentFormValues: FormValuesInterface = {};
            formInputsReferencesMap.forEach(function (reference, id) {
                currentFormValues[id] = reference.getValue();
            });

            // Log the form values being used for preview
            console.log('Form values used for preview:', currentFormValues);

            setPreviewFormValues(currentFormValues);
            setIsPreviewGraphQlMutationShown(true);
        },
        [formInputsReferencesMap],
    );

    // Handle form submission
    const handleSubmit = React.useCallback(
        async function (formValues: FormValuesInterface): Promise<FormSubmitResponseInterface> {
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
                mutationFunction: mutation,
                onSubmit: properties.onSubmit,
            });
        },
        [mutation, properties.onSubmit, formInputsReferencesMap],
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

// Export - Default
export default GraphQlOperationForm;
