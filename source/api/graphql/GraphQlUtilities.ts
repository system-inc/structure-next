// Dependencies - API
import { ApolloError } from '@apollo/client';

// Interface - GraphQL Validation Error
export interface GraphQLValidationError {
    property?: string;
    constraints?: GraphQLValidationErrorConstraint;
    value?: unknown;
    children?: GraphQLValidationError[];
    [key: string]: unknown;
}

// Interface - GraphQL Validation Error Constraint
export interface GraphQLValidationErrorConstraint {
    isUnique?: boolean;
    [constraintKey: string]: unknown;
}

// Interface - GraphQL Error Extensions
export interface GraphQLErrorExtensions {
    code?: string;
    validationErrors?: GraphQLValidationError[];
    exception?: {
        stacktrace?: string[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

// Function to extract validation errors from an ApolloError
export function extractValidationErrorsFromApolloError(
    apolloError?: ApolloError,
): GraphQLValidationError[] | undefined {
    const graphQlError = apolloError?.graphQLErrors?.[0];
    const extensions = graphQlError?.extensions as GraphQLErrorExtensions | undefined;
    return extensions?.validationErrors;
}

// Function to check if the error is a unique constraint error
export function isUniqueConstraintError(error?: ApolloError): boolean {
    const validationErrors = extractValidationErrorsFromApolloError(error);
    return !!validationErrors?.[0]?.constraints?.isUnique;
}
