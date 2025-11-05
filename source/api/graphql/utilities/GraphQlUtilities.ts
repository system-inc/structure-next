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
        baseError?: unknown; // BaseErrorData from Base API
        [key: string]: unknown;
    };
}

// Function to check if a response has errors
export function hasGraphQlErrors(response: GraphQlResponseInterface): boolean {
    return !!(response.errors || response.error || !response.data);
}

// Function to parse first GraphQL error from response
export function parseFirstGraphQlError(response: GraphQlResponseInterface): GraphQlErrorInterface | null {
    return response.errors?.[0] || response.error || null;
}
