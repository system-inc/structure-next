// Dependencies - API
// No external dependencies needed - this is now self-contained

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

// Function to extract validation errors from a GraphQL error response
export function extractValidationErrors(
    error?: GraphQlError | Error | GraphQlResponseInterface,
): GraphQlValidationError[] | undefined {
    let graphQlError: GraphQlErrorInterface | undefined;

    if(error instanceof GraphQlError && error.graphQlErrors?.[0]) {
        graphQlError = error.graphQlErrors[0];
    }
    else if(error && 'errors' in error && error.errors?.[0]) {
        graphQlError = error.errors[0];
    }
    else if(error && 'error' in error && error.error) {
        graphQlError = error.error;
    }

    const extensions = graphQlError?.extensions as GraphQlErrorExtensions | undefined;
    return extensions?.validationErrors;
}

// Function to check if the error is a unique constraint error
export function isUniqueConstraintError(error?: GraphQlError | Error | GraphQlResponseInterface): boolean {
    const validationErrors = extractValidationErrors(error);
    return !!validationErrors?.[0]?.constraints?.isUnique;
}

// Function to check if the error is a device ID required error
export function isDeviceIdRequiredError(error: unknown): boolean {
    if(!(error instanceof Error)) return false;

    // Regex matches variations: "Device ID", "device ID", "deviceId", "deviceid", etc.
    const deviceIdPattern = /device\s*id/i;

    return deviceIdPattern.test(error.message || '');
}

// Function to convert a GraphQL error to a message
export const graphQlErrorToMessage = function (mutationError?: GraphQlError | Error | GraphQlResponseInterface) {
    let errorMessage = 'Unknown error.';
    let errorObject: GraphQlErrorInterface[] | undefined;

    if(mutationError instanceof GraphQlError) {
        errorObject = mutationError.graphQlErrors;
    }
    else if(mutationError && 'errors' in mutationError) {
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
