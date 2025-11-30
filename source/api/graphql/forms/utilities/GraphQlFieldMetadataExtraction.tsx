// Dependencies - Types
import {
    GraphQLInputTypeMetadata,
    GraphQLOperationParameterMetadata,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { setValueAtDottedPathInObject } from '@structure/source/utilities/type/Object';

// Type - GraphQlField (internal)
interface GraphQlField {
    name: string;
    type: GraphQLInputTypeMetadata | string;
    kind: string;
    required: boolean;
    validation?: GraphQlValidationRule[];
    [key: string]: unknown;
}

// Type - GraphQlFieldMetadata
export interface GraphQlFieldMetadata {
    name: string;
    type: GraphQLInputTypeMetadata | string;
    kind: string;
    required: boolean;
    validation?: GraphQlValidation;
    possibleValues?: string[];
}

// Type - GraphQlValidation (internal)
interface GraphQlValidation {
    maxLength?: number;
    minLength?: number;
    isIn?: string[];
    isEmail?: boolean;
    isNotEmpty?: boolean;
    isEnum?: Record<string, unknown>;
    arrayUnique?: boolean;
    [key: string]: unknown;
}

// Type - GraphQlValidationRule (internal)
interface GraphQlValidationRule {
    type: string;
    constraints: unknown[];
}

// Function to get a validation object from a GraphQL validation array (internal)
function graphQlValidationFromGraphQlValidationRuleArray(
    graphQlValidationRuleArray?: GraphQlValidationRule[],
): GraphQlValidation | undefined {
    if(graphQlValidationRuleArray) {
        const graphQlValidation: GraphQlValidation = {};

        for(const graphQlValidationRule of graphQlValidationRuleArray) {
            if(graphQlValidationRule.constraints && graphQlValidationRule.constraints.length > 0) {
                graphQlValidation[graphQlValidationRule.type] = graphQlValidationRule.constraints[0];
            }
            else {
                graphQlValidation[graphQlValidationRule.type] = true;
            }
        }

        return graphQlValidation;
    }
    return undefined;
}

// Function to extract GraphQlFieldMetadata array from GraphQLOperationParameterMetadata
export function graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata(
    graphQlOperationParameterMetadataArray?: readonly GraphQLOperationParameterMetadata[],
    parentIdentifier: string = '',
): GraphQlFieldMetadata[] {
    const graphQlFieldMetadataArray: GraphQlFieldMetadata[] = [];

    if(graphQlOperationParameterMetadataArray) {
        for(const graphQlOperationParameterMetadata of graphQlOperationParameterMetadataArray) {
            if(graphQlOperationParameterMetadata.kind === 'object') {
                // Get the fields as input metadata
                const currentGraphQlFieldMetadataArray = graphQlFieldArrayToGraphQlFieldMetadataArray(
                    'fields' in graphQlOperationParameterMetadata.type
                        ? graphQlOperationParameterMetadata.type.fields
                        : undefined,
                    parentIdentifier
                        ? `${parentIdentifier}.${graphQlOperationParameterMetadata.parameter}`
                        : graphQlOperationParameterMetadata.parameter,
                );
                graphQlFieldMetadataArray.push(...currentGraphQlFieldMetadataArray);
            }
            else {
                graphQlFieldMetadataArray.push({
                    name: graphQlOperationParameterMetadata.parameter,
                    type: graphQlOperationParameterMetadata.type,
                    kind: graphQlOperationParameterMetadata.kind,
                    required: graphQlOperationParameterMetadata.required,
                });
            }
        }
    }

    return graphQlFieldMetadataArray;
}

// Function to convert GraphQL fields to GraphQlFormInputMetadata (internal)
function graphQlFieldArrayToGraphQlFieldMetadataArray(
    graphQlFieldArray: GraphQlField[] | unknown,
    parentIdentifier: string,
): GraphQlFieldMetadata[] {
    const graphQlFormInputMetadataArray: GraphQlFieldMetadata[] = [];

    if(!Array.isArray(graphQlFieldArray)) {
        return graphQlFormInputMetadataArray;
    }

    for(const field of graphQlFieldArray) {
        const validationObject = graphQlValidationFromGraphQlValidationRuleArray(field.validation);

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

// Function to convert form values to GraphQL mutation variables
// Transforms flat dotted keys like 'input.title' into nested objects { input: { title: ... } }
export function formValuesToGraphQlMutationVariables(formValues: Record<string, unknown>): Record<string, unknown> {
    // Initialize an empty object to store the mutation variables
    const graphQlMutationVariables: Record<string, unknown> = {};

    // Loop through the form values
    for(const [key, value] of Object.entries(formValues)) {
        let graphQlValue = value;

        // Split the key into parts
        const keyParts = key.split('.');

        // TODO: Remove this - hard coding this fix for now
        if(key === 'input.topicIds' && value) {
            graphQlValue = [value];
        }

        setValueAtDottedPathInObject(graphQlMutationVariables, keyParts, graphQlValue);
    }

    return graphQlMutationVariables;
}
