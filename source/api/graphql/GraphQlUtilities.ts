// Dependencies - API
import { ApolloError } from '@apollo/client';

// Interface - GraphQL Response with potential errors
export interface GraphQlResponseInterface<TData = unknown> {
    data?: TData;
    errors?: GraphQlErrorInterface[];
    error?: GraphQlErrorInterface;
}

// Interface - GraphQL Error
export interface GraphQlErrorInterface {
    message: string;
    path?: (string | number)[];
    extensions?: {
        name?: string;
        status?: number;
        message?: string;
        code?: string;
        validationErrors?: GraphQlValidationError[];
        [key: string]: unknown;
    };
}

// Interface - GraphQL Validation Error
export interface GraphQlValidationError {
    property?: string;
    constraints?: GraphQlValidationErrorConstraint;
    value?: unknown;
    children?: GraphQlValidationError[];
    [key: string]: unknown;
}

// Interface - GraphQL Validation Error Constraint
export interface GraphQlValidationErrorConstraint {
    isUnique?: boolean;
    [constraintKey: string]: unknown;
}

// Interface - GraphQL Error Extensions
export interface GraphQlErrorExtensions {
    code?: string;
    validationErrors?: GraphQlValidationError[];
    exception?: {
        stacktrace?: string[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

// Function to extract validation errors from an ApolloError
export function extractValidationErrorsFromApolloError(
    apolloError?: ApolloError,
): GraphQlValidationError[] | undefined {
    const graphQlError = apolloError?.graphQLErrors?.[0];
    const extensions = graphQlError?.extensions as GraphQlErrorExtensions | undefined;
    return extensions?.validationErrors;
}

// Function to check if the error is a unique constraint error
export function isUniqueConstraintError(error?: ApolloError): boolean {
    const validationErrors = extractValidationErrorsFromApolloError(error);
    return !!validationErrors?.[0]?.constraints?.isUnique;
}

// Function to convert an Apollo error to a message
export const apolloErrorToMessage = function (mutationError?: ApolloError) {
    const errorObject = mutationError?.graphQLErrors;

    if(errorObject && errorObject.length > 0) {
        const error = errorObject[0];

        if(error) {
            if(error.extensions && error.extensions.validationErrors) {
                const validationErrors = error.extensions.validationErrors as GraphQlValidationError[];

                if(validationErrors && validationErrors.length > 0 && validationErrors[0]) {
                    const property = validationErrors[0].property;
                    const constraints = validationErrors[0].constraints;

                    if(property && constraints) {
                        const constraintKey = Object.keys(constraints)[0];
                        if(constraintKey) {
                            // const constraintValue = constraints[constraintKey];

                            return `Invalid ${property}.`;
                        }
                    }
                }
            }

            return error.message;
        }
    }

    return 'Unknown error.';
};

// Function to parse GraphQL errors from response
export function parseGraphQlErrors(response: GraphQlResponseInterface): string | null {
    if(response.errors && response.errors.length > 0 && response.errors[0]) {
        return response.errors[0].message;
    }
    if(response.error) {
        return response.error.message;
    }
    return null;
}

// Function to check if a response has errors
export function hasGraphQlErrors(response: GraphQlResponseInterface): boolean {
    return !!(response.errors || response.error || !response.data);
}
