'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormValuesInterface, FormInterface, Form } from '@structure/source/common/forms/Form';
import FormInputText from '@structure/source/common/forms/FormInputText';
import FormInputTextArea from '@structure/source/common/forms/FormInputTextArea';
import FormInputPassword from '@structure/source/common/forms/FormInputPassword';
import FormInputSelect from '@structure/source/common/forms/FormInputSelect';
import FormInputMultipleSelect from '@structure/source/common/forms/FormInputMultipleSelect';
import FormInputCheckbox from '@structure/source/common/forms/FormInputCheckbox';
import Alert from '@structure/source/common/notifications/Alert';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - API
import { useQuery, useMutation, ApolloError, DocumentNode, gql } from '@apollo/client';
import {
    GraphQLOperationMetadata,
    GraphQLOperationParameterMetadata,
    GraphQLInputTypeMetadata,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';
import { getValueForKeyRecursively } from '@structure/source/utilities/Object';

// Component - GraphQlOperationForm
export interface GraphQlOperationFormInterface extends Omit<FormInterface, 'formInputs' | 'onSubmit'> {
    operation: GraphQLOperationMetadata<DocumentNode>;
    defaultValuesQuery?: {
        document: DocumentNode;
        variables: any;
    };
    inputComponentsProperties?: any;
    onSubmit?: (
        formValues: FormValuesInterface,
        mutationResponseData: any,
        mutationResponseError: ApolloError | null,
    ) => void;
}
export function GraphQlOperationForm(properties: GraphQlOperationFormInterface) {
    // State
    const [defaultValues, setDefaultValues] = React.useState<any>(null);

    // Hooks
    const [mutation, mutationState] = useMutation(properties.operation.document);
    // Fetch default values if defaultValuesQuery is provided
    const defaultValuesQueryDocument = properties.defaultValuesQuery?.document ?? gql(`query { __typename }`);
    const defaultValuesQueryState = useQuery(defaultValuesQueryDocument, {
        skip: !properties.defaultValuesQuery,
        variables: properties.defaultValuesQuery?.variables,
    });
    // console.log('defaultValuesQueryState', defaultValuesQueryState);

    // Effect to update the default values when the query loads data
    React.useEffect(
        function () {
            if(defaultValuesQueryState.data) {
                setDefaultValues(defaultValuesQueryState.data);
            }
        },
        [defaultValuesQueryState.data],
    );

    interface InputMetadata {
        name: string;
        type: GraphQLInputTypeMetadata | string;
        kind: string;
        required: boolean;
        validation?: any;
        possibleValues?: string[];
    }

    function renderFormInputsUsingMutationDocument() {
        // console.log('properties.operation:', properties.operation);

        // First, we need to flatten properties.operation.parameters into a flattened list
        // The identifier for each parameter will be the name of the parameter concatenated by periods
        // with the name of the sub parameters. We can only flatten where the parameter.kind is "object"

        // Function to flatten the parameters
        function inputMetadataArrayFromParameters(
            parameters?: readonly GraphQLOperationParameterMetadata[],
            parentParameter: string = '',
        ): InputMetadata[] {
            // The input meta data
            let inputMetadata: InputMetadata[] = [];

            // If we have parameters
            if(parameters) {
                // Loop through the parameters
                for(const parameter of parameters) {
                    // If the parameter is an object
                    if(parameter.kind === 'object') {
                        // Get the fields as input metadata
                        const objectFields = fieldsToInputMetadataArray(
                            'fields' in parameter.type ? parameter.type.fields : undefined,
                            parentParameter ? `${parentParameter}.${parameter.parameter}` : parameter.parameter,
                        );

                        inputMetadata = inputMetadata.concat(objectFields);
                    }
                    else {
                        // Add the parameter to the flattened parameters
                        inputMetadata.push({
                            name: parameter.parameter,
                            type: parameter.type,
                            kind: parameter.kind,
                            required: parameter.required,
                        });
                    }
                }
            }

            return inputMetadata;
        }

        // Function to convert fields to input metadata array
        function fieldsToInputMetadataArray(fields: any, parentIdentifier: string): InputMetadata[] {
            const inputMetadata: InputMetadata[] = [];

            for(const field of fields) {
                const niceValidation = convertValidationToNice(field.validation);

                inputMetadata.push({
                    name: parentIdentifier ? parentIdentifier + '.' + field.name : field.name,
                    type: field.type,
                    kind: field.kind,
                    required: field.required,
                    possibleValues:
                        niceValidation && niceValidation.hasOwnProperty('isEnum')
                            ? Object.keys(niceValidation.isEnum)
                            : undefined,
                    validation: niceValidation,
                });
            }

            return inputMetadata;
        }

        // Function to convert field validation object to a nice one
        /*
        This is what it is:
        [
            {
                "type": "maxLength",
                "constraints": [
                    128
                ]
            }
        ]
        This is what I want:
        {
        maxLength: 128
        }    
        */
        function convertValidationToNice(
            validationArray?: {
                type: string;
                constraints: any[];
            }[],
        ) {
            if(validationArray) {
                const niceValidation: any = {};

                for(const validation of validationArray) {
                    if(validation.constraints) {
                        niceValidation[validation.type] = validation.constraints[0];
                    }
                    else {
                        niceValidation[validation.type] = true;
                    }
                }

                return niceValidation;
            }
        }

        const inputMetadataArray = inputMetadataArrayFromParameters(properties.operation.parameters);
        // console.log('inputMetadataArray', inputMetadataArray);

        // Store the form inputs
        const formInputs: JSX.Element[] = [];

        // Loop through the operation
        for(const input of inputMetadataArray) {
            // console.log('input', input);

            // Get the last part of the input name
            const inputNameParts = input.name.split('.');
            const inputName = inputNameParts[inputNameParts.length - 1] ?? '';

            // Component properties
            const componentProperties: {
                id: string;
                key: string;
                [key: string]: any;
            } = {
                id: input.name,
                key: input.name,
                label: titleCase(inputName),
                placeholder: titleCase(inputName),
                // required: input.required,
            };

            // If there is a default value
            if(defaultValues) {
                const defaultValue = getValueForKeyRecursively(defaultValues, inputName);
                // console.log('inputName', inputName, 'defaultValue', defaultValue);

                // If the default value is not undefined
                if(defaultValue !== undefined) {
                    // Set the default value

                    // If the default value is an object, convert it to a string
                    if(typeof defaultValue === 'object') {
                        componentProperties.defaultValue = JSON.stringify(defaultValue);
                    }
                    else {
                        componentProperties.defaultValue = defaultValue;
                    }
                }
            }

            // If there is a special configuration for this input
            if(properties.inputComponentsProperties?.hasOwnProperty(input.name)) {
                // Merge the configuration with the component properties
                Object.assign(componentProperties, properties.inputComponentsProperties[input.name]);
            }

            // Determine the component
            let FormInputComponent: any;
            if(componentProperties.component) {
                FormInputComponent = componentProperties.component;
            }
            else if(input.validation?.arrayUnique) {
                FormInputComponent = FormInputMultipleSelect;
            }
            else if(input.type === 'enum') {
                FormInputComponent = FormInputSelect;
                componentProperties.items = input.possibleValues?.map(function (value) {
                    return {
                        value: value,
                    };
                });
            }
            else if(input.name === 'password') {
                FormInputComponent = FormInputPassword;
            }
            else if(input.validation?.maxLength > 128) {
                FormInputComponent = FormInputTextArea;
                // One row for every 128 characters with a max rows of 8
                componentProperties.rows = Math.min(Math.ceil(input.validation.maxLength / 128), 8);
            }
            else if(input.type === 'Boolean') {
                FormInputComponent = FormInputCheckbox;
            }
            else {
                FormInputComponent = FormInputText;
            }

            // If the component is FormInputText
            if(FormInputComponent == FormInputText) {
                // Default to text input
                componentProperties.type = 'text';

                // If the component is an email address
                if(input.name === 'Email Address') {
                    componentProperties.type = 'email';
                    componentProperties.placeholder = 'email@domain.com';
                    componentProperties.autoComplete = 'email';
                }
                else if(input.name === 'Password') {
                    componentProperties.type = 'password';
                }
            }

            if(componentProperties.items) {
                console.log('componentProperties.items', componentProperties.items);
            }

            // Add the form input
            formInputs.push(<FormInputComponent {...componentProperties} key={componentProperties.key} />);
        }

        return formInputs;
    }

    // Render the component
    return (
        <>
            {properties.defaultValuesQuery && defaultValuesQueryState.loading && <div>Loading...</div>}
            {properties.defaultValuesQuery && defaultValuesQueryState.error && (
                <div>Error: {defaultValuesQueryState.error.message}</div>
            )}

            {((properties.defaultValuesQuery && defaultValuesQueryState.data) ||
                properties.defaultValuesQuery === undefined) && (
                <Form
                    {...properties}
                    formInputs={renderFormInputsUsingMutationDocument()}
                    onSubmit={async function (formValues: FormValuesInterface) {
                        console.log('Form onSubmit formValues:', formValues);

                        // Variables to store the mutation response data and error
                        let mutationResponseData = null;
                        let mutationResponseError = null;

                        // We need to map the formValues to the mutation variables
                        // The form values are in the form of { 'input.name': 'value' }
                        // The mutation variables are in the form of { input: { name: 'value' } }
                        function assignNestedValue(object: any, keyPath: string[], value: any) {
                            const lastKeyIndex = keyPath.length - 1;
                            for(let i = 0; i < lastKeyIndex; ++i) {
                                const key = keyPath[i];
                                if(key) {
                                    if(!(key in object)) object[key] = {};
                                    object = object[key];
                                }
                            }
                            if(keyPath[lastKeyIndex]) {
                                object[keyPath[lastKeyIndex]!] = value;
                            }
                        }

                        const mutationVariables: any = {};
                        for(const [key, value] of Object.entries(formValues)) {
                            let graphQlValue = value;

                            const keyParts = key.split('.');

                            // Handle booleans
                            if(value == 'Checked') {
                                graphQlValue = true;
                            }
                            else if(value == 'Unchecked') {
                                graphQlValue = false;
                            }

                            assignNestedValue(mutationVariables, keyParts, graphQlValue);
                        }
                        console.log('mutationVariables:', mutationVariables);

                        // Invoke the GraphQL mutation
                        try {
                            const mutationResponse = await mutation({
                                variables: {
                                    ...mutationVariables,
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
                        let submitResponse: { success: boolean; message: any } = {
                            success: !mutationResponseError,
                            message: undefined,
                        };

                        // If an onSubmit property has been provided
                        if(properties.onSubmit) {
                            // Invoke the onSubmit property
                            await properties.onSubmit(formValues, mutationResponseData, mutationResponseError);
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
            )}
        </>
    );
}

// Export - Default
export default GraphQlOperationForm;
