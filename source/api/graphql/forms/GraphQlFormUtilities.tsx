'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { GraphQLInputTypeMetadata, GraphQLOperationParameterMetadata } from '@project/source/api/GraphQlGeneratedCode';
import { FormInputReferenceInterface, FormInputInterface } from '@structure/source/common/forms/FormInput';
import { FormInputsProperties } from '@structure/source/api/graphql/forms/GraphQlOperationForm';

// Dependencies - Main Components
import { FormInputTextInterface, FormInputText } from '@structure/source/common/forms/FormInputText';
import { FormInputPassword } from '@structure/source/common/forms/FormInputPassword';
import { FormInputTextAreaInterface, FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { FormInputCheckbox } from '@structure/source/common/forms/FormInputCheckbox';
import { FormInputSelectInterface, FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { FormInputMultipleSelect } from '@structure/source/common/forms/FormInputMultipleSelect';
import { GraphQlFormInput } from '@structure/source/api/graphql/forms/GraphQlFormInput';

// Dependencies - Utilities
import { getValueForKeyRecursively } from '@structure/source/utilities/Object';
import { titleCase, slug } from '@structure/source/utilities/String';

// Create a union type of all the form input components we use
export type FormInputComponentUnion =
    | typeof FormInputText
    | typeof FormInputPassword
    | typeof FormInputTextArea
    | typeof FormInputCheckbox
    | typeof FormInputSelect
    | typeof FormInputMultipleSelect;

// Type for component properties
export type FormInputComponentProperties =
    // Make id required while keeping other FormInputInterface properties optional
    Omit<Partial<FormInputInterface>, 'id'> & { id: string } & Partial<FormInputSelectInterface> &
        Partial<FormInputTextInterface> &
        Partial<FormInputTextAreaInterface> & {
            component?: FormInputComponentUnion;
            key?: string; // React key property
        };

// Type - FormInputComponentAndProperties
export interface FormInputComponentAndProperties {
    component: FormInputComponentUnion;
    // Customizable properties for the form input
    properties: FormInputComponentProperties;
}

// Type - GraphQlField
export interface GraphQlField {
    name: string;
    type: GraphQLInputTypeMetadata | string;
    kind: string;
    required: boolean;
    validation?: GraphQlValidationRule[];
    // Any other fields that might be in the field object
    [key: string]: unknown;
}

// Type - GraphQlFormInputMetadata
export interface GraphQlFormInputMetadata {
    name: string;
    type: GraphQLInputTypeMetadata | string;
    kind: string;
    required: boolean;
    validation?: GraphQlValidation;
    possibleValues?: string[];
}

// Type - GraphQlValidation
export interface GraphQlValidation {
    maxLength?: number;
    minLength?: number;
    isIn?: string[];
    isEmail?: boolean;
    isEnum?: Record<string, unknown>;
    arrayUnique?: boolean;
    [key: string]: unknown; // For other validation types
}

// Type - GraphQlValidationRule
export interface GraphQlValidationRule {
    type: string;
    constraints: unknown[];
}

// Function to get a validation object from a GraphQL validation array
export function validationObjectFromGraphQlValidationArray(
    validationArray?: GraphQlValidationRule[],
): GraphQlValidation | undefined {
    if(validationArray) {
        const validationObject: GraphQlValidation = {};

        for(const validation of validationArray) {
            if(validation.constraints && validation.constraints.length > 0) {
                validationObject[validation.type] = validation.constraints[0];
            }
            else {
                validationObject[validation.type] = true;
            }
        }

        return validationObject;
    }
    return undefined;
}

// Function to extract GraphQlFormInputMetadata from GraphQLOperationParameterMetadata
export function extractGraphQlFormInputMetadataFromGraphQlParameters(
    parameters?: readonly GraphQLOperationParameterMetadata[],
    parentParameter: string = '',
): GraphQlFormInputMetadata[] {
    // The input meta data
    const inputMetadata: GraphQlFormInputMetadata[] = [];

    // If we have parameters
    if(parameters) {
        // Loop through the parameters
        for(const parameter of parameters) {
            // If the parameter is an object
            if(parameter.kind === 'object') {
                // Get the fields as input metadata
                const objectFields = graphQlFieldsToGraphQlFormInputMetadataArray(
                    'fields' in parameter.type ? parameter.type.fields : undefined,
                    parentParameter ? `${parentParameter}.${parameter.parameter}` : parameter.parameter,
                );

                inputMetadata.push(...objectFields);
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

// Function to convert GraphQL fields to GraphQlFormInputMetadata
export function graphQlFieldsToGraphQlFormInputMetadataArray(
    graphQlFields: GraphQlField[] | unknown,
    parentIdentifier: string,
): GraphQlFormInputMetadata[] {
    const graphQlFormInputMetadataArray: GraphQlFormInputMetadata[] = [];

    if(!Array.isArray(graphQlFields)) {
        return graphQlFormInputMetadataArray;
    }

    for(const field of graphQlFields) {
        const validationObject = validationObjectFromGraphQlValidationArray(field.validation);

        graphQlFormInputMetadataArray.push({
            name: parentIdentifier ? parentIdentifier + '.' + field.name : field.name,
            type: field.type,
            kind: field.kind,
            required: field.required,
            possibleValues:
                validationObject && 'isEnum' in validationObject && validationObject.isEnum
                    ? Object.keys(validationObject.isEnum as Record<string, unknown>)
                    : undefined,
            validation: validationObject,
        });
    }

    return graphQlFormInputMetadataArray;
}

// Factory function to determine which form input type to use based on input metadata
export function determineFormInputComponentFromGraphQlFormInputMetadata(
    graphQlFormInputMetadata: GraphQlFormInputMetadata,
    componentProperties: FormInputComponentProperties,
): FormInputComponentUnion {
    // If a component has been provided
    if(componentProperties.component) {
        return componentProperties.component;
    }
    // If the input is an array
    else if(graphQlFormInputMetadata.validation?.arrayUnique) {
        return FormInputMultipleSelect;
    }
    // If the input is an enum
    else if(graphQlFormInputMetadata.kind === 'enum') {
        return FormInputSelect;
    }
    // If the input has validation which requires a specific string
    else if(
        graphQlFormInputMetadata.validation &&
        'isIn' in graphQlFormInputMetadata.validation &&
        Array.isArray(graphQlFormInputMetadata.validation.isIn)
    ) {
        return FormInputSelect;
    }
    // If the input is a password
    else if(graphQlFormInputMetadata.name.endsWith('.password')) {
        return FormInputPassword;
    }
    // If the input is a title or slug
    else if(graphQlFormInputMetadata.name.endsWith('.title') || graphQlFormInputMetadata.name.endsWith('.slug')) {
        return FormInputText;
    }
    // If the input is a content or description or has a large maximum length
    else if(
        graphQlFormInputMetadata.name.endsWith('.content') ||
        graphQlFormInputMetadata.name.endsWith('.description') ||
        (graphQlFormInputMetadata.validation?.maxLength && graphQlFormInputMetadata.validation.maxLength > 128)
    ) {
        return FormInputTextArea;
    }
    // If the input is a boolean
    else if(graphQlFormInputMetadata.type === 'Boolean') {
        return FormInputCheckbox;
    }
    // Default to text input
    return FormInputText;
}

// Function to configure select inputs with appropriate items
export function configureFormInputSelect(
    FormInputComponent: FormInputComponentUnion,
    componentProperties: FormInputComponentProperties,
    input: GraphQlFormInputMetadata,
): void {
    // If the component is a select and we have possible values
    if(
        (FormInputComponent === FormInputSelect || FormInputComponent === FormInputMultipleSelect) &&
        input.possibleValues
    ) {
        componentProperties.items = input.possibleValues.map(function (value) {
            return {
                value: value,
            };
        });
    }

    // If the component is a select with isIn validation
    if(
        FormInputComponent === FormInputSelect &&
        input.validation &&
        'isIn' in input.validation &&
        Array.isArray(input.validation.isIn)
    ) {
        componentProperties.items = input.validation.isIn.map(function (value: string) {
            return {
                value: value,
            };
        });
    }
}

// Function to configure text inputs with appropriate types
export function configureFormInputText(
    FormInputComponent: FormInputComponentUnion,
    componentProperties: FormInputComponentProperties,
    input: GraphQlFormInputMetadata,
): void {
    // If the component is FormInputText
    if(FormInputComponent === FormInputText) {
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
}

// Function to configure textarea inputs with appropriate rows
export function configureFormInputTextArea(
    FormInputComponent: FormInputComponentUnion,
    componentProperties: FormInputComponentProperties,
    graphQlFormInputMetadata: GraphQlFormInputMetadata,
): void {
    // If the component is FormInputTextArea
    if(FormInputComponent === FormInputTextArea) {
        const maximumLength = graphQlFormInputMetadata.validation?.maxLength;

        // Calculate rows based on max length
        if(maximumLength && maximumLength > 128) {
            componentProperties.rows = Math.min(Math.ceil(maximumLength / 128), 8);
        }
    }
}

// Function to setup the relationship between title and slug form inputs
export function setupTitleSlugRelationship(
    formInputsComponentAndProperties: FormInputComponentAndProperties[],
    formInputsReferencesMap: Map<string, FormInputReferenceInterface>,
): void {
    // If there is a form input with the id ending with '.title'
    const titleFormInputComponentAndProperties = formInputsComponentAndProperties.find(function (formInputProperties) {
        const id = formInputProperties.properties.id;
        return id && id.endsWith('.title');
    });

    // If there is a form input with the id ending with '.slug'
    const slugFormInputComponentAndProperties = formInputsComponentAndProperties.find(function (formInputProperties) {
        const id = formInputProperties.properties.id;
        return id && id.endsWith('.slug');
    });

    // If both form inputs exist
    if(slugFormInputComponentAndProperties && titleFormInputComponentAndProperties) {
        const slugId = slugFormInputComponentAndProperties.properties.id;

        // Ensure slug ID exists
        if(!slugId) return;

        // Add an onChange event to the title form input
        titleFormInputComponentAndProperties.properties.onChange = function (value?: string) {
            // Get the slug value from the title value
            const titleValue = value || '';
            const slugValue = slug(titleValue);

            // Get the form input reference
            const slugFormInput = formInputsReferencesMap.get(slugId);

            // If the slug form input exists
            if(slugFormInput) {
                // Set the slug value
                slugFormInput.setValue(slugValue);
            }
        };
    }
}

// Function to generate form inputs based on GraphQL operation metadata
export function generateFormInputs(
    graphQlFormInputMetadataArray: GraphQlFormInputMetadata[],
    formInputsReferencesMap: Map<string, FormInputReferenceInterface>,
    defaultValues: Record<string, unknown> | null,
    inputComponentsProperties?: FormInputsProperties,
): React.ReactElement<FormInputInterface>[] {
    // Store the form inputs component and properties
    const formInputsComponentAndProperties: FormInputComponentAndProperties[] = [];

    // First, gather all of the properties for the form inputs
    for(const input of graphQlFormInputMetadataArray) {
        // Get the last part of the input name
        const inputNameParts = input.name.split('.');
        const inputName = inputNameParts[inputNameParts.length - 1] ?? '';

        // Component properties with basic fields that all FormInputs require
        const componentProperties: FormInputComponentProperties = {
            id: input.name,
            key: input.name,
            label: titleCase(inputName),
            placeholder: titleCase(inputName),
        };

        // If there is a default value
        if(defaultValues) {
            const defaultValue = getValueForKeyRecursively(defaultValues, inputName);

            // If the default value is not undefined or null
            if(defaultValue !== undefined && defaultValue !== null) {
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
        if(inputComponentsProperties?.hasOwnProperty(input.name)) {
            // Merge the configuration with the component properties
            Object.assign(componentProperties, inputComponentsProperties[input.name]);
        }

        // Determine the appropriate form input component
        const FormInputComponent = determineFormInputComponentFromGraphQlFormInputMetadata(input, componentProperties);

        // Configure specific input types
        configureFormInputSelect(FormInputComponent, componentProperties, input);
        configureFormInputText(FormInputComponent, componentProperties, input);
        configureFormInputTextArea(FormInputComponent, componentProperties, input);

        formInputsComponentAndProperties.push({
            component: FormInputComponent,
            properties: componentProperties,
        });
    }

    // Handle the special case of title/slug relationship
    setupTitleSlugRelationship(formInputsComponentAndProperties, formInputsReferencesMap);

    // Create the form input components
    return formInputsComponentAndProperties.map(function (formInputComponentAndProperties, index) {
        // Use index as fallback key if id is undefined
        const key = formInputComponentAndProperties.properties.id || `form-input-${index}`;

        return (
            <GraphQlFormInput
                key={key}
                formInputComponentAndProperties={formInputComponentAndProperties}
                formInputsReferencesMap={formInputsReferencesMap}
            />
        );
    });
}
