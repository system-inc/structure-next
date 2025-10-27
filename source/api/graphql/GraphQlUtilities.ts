// Dependencies - API
import { ErrorCode } from '@structure/source/api/errors/ErrorCodes';
import {
    ERROR_CODE_DEVICE_ID_REQUIRED,
    ERROR_CODE_AUTHENTICATION_REQUIRED,
    ERROR_CODE_SESSION_INVALID,
    ERROR_CODE_ACCOUNT_INVALID,
    ERROR_CODE_REAUTHENTICATION_REQUIRED,
    ERROR_CODE_PERMISSION_DENIED,
    ERROR_CODE_INSUFFICIENT_ENTITLEMENTS,
    ERROR_CODE_QUOTA_EXCEEDED,
    ERROR_CODE_RATE_LIMIT_EXCEEDED,
} from '@structure/source/api/errors/ErrorCodes';
import { BaseErrorInterface, RateLimitInfoInterface } from '@structure/source/api/errors/BaseError';
import { ValidationErrorInterface } from '@structure/source/api/errors/ValidationError';

// Type - GraphQL Document (string-based query)
export type GraphQlDocument = string | { toString(): string };

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
    extensions?: BaseErrorInterface & {
        // Additional fields that may be present in GraphQL errors
        validationErrors?: ValidationErrorInterface[];
        [key: string]: unknown;
    };
}

// Type - GraphQL Validation Error (alias to the universal ValidationErrorInterface)
export type GraphQlValidationError = ValidationErrorInterface;

// GraphQL Error class to replace ApolloError
export class GraphQlError extends Error {
    public graphQlErrors?: GraphQlErrorInterface[];
    public networkError?: Error;
    public response?: GraphQlResponseInterface;

    constructor(
        message: string,
        options?: {
            graphQlErrors?: GraphQlErrorInterface[];
            networkError?: Error;
            response?: GraphQlResponseInterface;
        },
    ) {
        super(message);
        this.name = 'GraphQlError';
        this.graphQlErrors = options?.graphQlErrors;
        this.networkError = options?.networkError;
        this.response = options?.response;
    }
}

// Type guard to check if a value is a GraphQL response
export function isGraphQlResponse(value: unknown): value is GraphQlResponseInterface {
    return (
        typeof value === 'object' &&
        value !== null &&
        ('errors' in value || 'error' in value || 'data' in value)
    );
}

// Function to extract error code from a GraphQL error response
export function getErrorCode(error: unknown): ErrorCode | string | undefined {
    if(!error) return undefined;

    let graphQlError: GraphQlErrorInterface | undefined;

    if(error instanceof GraphQlError && error.graphQlErrors?.[0]) {
        graphQlError = error.graphQlErrors[0];
    }
    else if(isGraphQlResponse(error)) {
        graphQlError = error.errors?.[0] || error.error;
    }

    return graphQlError?.extensions?.errorCode;
}

// Function to extract validation errors from a GraphQL error response
export function extractValidationErrors(error: unknown): ValidationErrorInterface[] | undefined {
    if(!error) return undefined;

    let graphQlError: GraphQlErrorInterface | undefined;

    if(error instanceof GraphQlError && error.graphQlErrors?.[0]) {
        graphQlError = error.graphQlErrors[0];
    }
    else if(isGraphQlResponse(error)) {
        graphQlError = error.errors?.[0] || error.error;
    }

    return graphQlError?.extensions?.validationErrors;
}

// Function to extract rate limit info from a GraphQL error response
export function extractRateLimitInfo(error: unknown): RateLimitInfoInterface | undefined {
    if(!error) return undefined;

    let graphQlError: GraphQlErrorInterface | undefined;

    if(error instanceof GraphQlError && error.graphQlErrors?.[0]) {
        graphQlError = error.graphQlErrors[0];
    }
    else if(isGraphQlResponse(error)) {
        graphQlError = error.errors?.[0] || error.error;
    }

    return graphQlError?.extensions?.rateLimit;
}

// Function to check if the error is a unique constraint error
export function isUniqueConstraintError(error: unknown): boolean {
    const validationErrors = extractValidationErrors(error);
    return !!validationErrors?.[0]?.constraints?.['isUnique'];
}

// Error Code Checking Functions

// Function to check if the error is a device ID required error
export function isDeviceIdRequiredError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_DEVICE_ID_REQUIRED;
}

// Function to check if the error is an authentication required error
export function isAuthenticationRequiredError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_AUTHENTICATION_REQUIRED;
}

// Function to check if the error is a session invalid error
export function isSessionInvalidError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_SESSION_INVALID;
}

// Function to check if the error is an account invalid error
export function isAccountInvalidError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_ACCOUNT_INVALID;
}

// Function to check if the error is a reauthentication required error
export function isReauthenticationRequiredError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_REAUTHENTICATION_REQUIRED;
}

// Function to check if the error is a permission denied error
export function isPermissionDeniedError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_PERMISSION_DENIED;
}

// Function to check if the error is an insufficient entitlements error
export function isInsufficientEntitlementsError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_INSUFFICIENT_ENTITLEMENTS;
}

// Function to check if the error is a quota exceeded error
export function isQuotaExceededError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_QUOTA_EXCEEDED;
}

// Function to check if the error is a rate limit exceeded error
export function isRateLimitExceededError(error: unknown): boolean {
    return getErrorCode(error) === ERROR_CODE_RATE_LIMIT_EXCEEDED;
}

// Function to check if the error requires user to sign in (401 errors)
export function isAuthenticationError(error: unknown): boolean {
    const errorCode = getErrorCode(error);
    return (
        errorCode === ERROR_CODE_AUTHENTICATION_REQUIRED ||
        errorCode === ERROR_CODE_SESSION_INVALID ||
        errorCode === ERROR_CODE_ACCOUNT_INVALID
    );
}

// Function to convert a GraphQL error to a message
export const graphQlErrorToMessage = function (mutationError: unknown) {
    let errorMessage = 'Unknown error.';
    let errorObject: GraphQlErrorInterface[] | undefined;

    if(mutationError instanceof GraphQlError) {
        errorObject = mutationError.graphQlErrors;
    }
    else if(isGraphQlResponse(mutationError)) {
        errorObject = mutationError.errors;
    }

    if(errorObject && errorObject.length > 0) {
        const error = errorObject[0];

        if(error) {
            // Extract validation errors using our existing function
            const validationErrors = extractValidationErrors(mutationError);

            // If we have validation errors, format them nicely
            if(validationErrors && validationErrors[0]) {
                const property = validationErrors[0].property;
                const constraints = validationErrors[0].constraints;

                if(property && constraints) {
                    const constraintKey = Object.keys(constraints)[0];
                    if(constraintKey) {
                        // const constraintValue = constraints[constraintKey];
                        errorMessage = `Invalid ${property}.`;
                    }
                }
            }

            // Return the actual error message (this takes precedence over validation error formatting)
            return error.message;
        }
    }

    return errorMessage;
};

// Function to parse GraphQL errors from response
export function parseGraphQlErrors(response: GraphQlResponseInterface): GraphQlErrorInterface | null {
    if(response.errors && response.errors.length > 0 && response.errors[0]) {
        return response.errors[0];
    }
    if(response.error) {
        return response.error;
    }
    return null;
}

// Function to check if a response has errors
export function hasGraphQlErrors(response: GraphQlResponseInterface): boolean {
    return !!(response.errors || response.error || !response.data);
}
