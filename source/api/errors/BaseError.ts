// Dependencies - API
import { GraphQlErrorInterface } from '@structure/source/api/graphql/utilities/GraphQlUtilities';

// Error Code Constants

// A device ID is required to perform an operation.
export const ERROR_CODE_DEVICE_ID_REQUIRED = 'DEVICE_ID_REQUIRED';

// A user must be authenticated to perform an operation.
export const ERROR_CODE_AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED';

// The session doesn't exist, expired or is otherwise invalid.
export const ERROR_CODE_SESSION_INVALID = 'SESSION_INVALID';

// The user account doesn't exist or is invalid, e.g. suspended or deleted.
export const ERROR_CODE_ACCOUNT_INVALID = 'ACCOUNT_INVALID';

// The user needs to re-authenticate to perform a sensitive operation.
export const ERROR_CODE_REAUTHENTICATION_REQUIRED = 'REAUTHENTICATION_REQUIRED';

// The user does not have sufficient access roles to access a resource.
export const ERROR_CODE_PERMISSION_DENIED = 'PERMISSION_DENIED';

// The user does not have sufficient entitlements, e.g. a plan or membership to access a resource.
export const ERROR_CODE_INSUFFICIENT_ENTITLEMENTS = 'INSUFFICIENT_ENTITLEMENTS';

// The rate limit for the operation has been exceeded.
export const ERROR_CODE_RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED';

// There was a validation error with the provided data.
export const ERROR_CODE_VALIDATION_ERROR = 'VALIDATION_ERROR';

// The provided data is of an invalid type.
export const ERROR_CODE_INVALID_TYPE = 'INVALID_TYPE';

// The quota for the operation has been exceeded.
export const ERROR_CODE_QUOTA_EXCEEDED = 'QUOTA_EXCEEDED';

// The resource already exists (e.g., duplicate entry).
export const ERROR_CODE_ALREADY_EXISTS = 'ALREADY_EXISTS';

// Framework error codes type
export type BaseErrorCode =
    | typeof ERROR_CODE_DEVICE_ID_REQUIRED
    | typeof ERROR_CODE_AUTHENTICATION_REQUIRED
    | typeof ERROR_CODE_SESSION_INVALID
    | typeof ERROR_CODE_ACCOUNT_INVALID
    | typeof ERROR_CODE_REAUTHENTICATION_REQUIRED
    | typeof ERROR_CODE_PERMISSION_DENIED
    | typeof ERROR_CODE_INSUFFICIENT_ENTITLEMENTS
    | typeof ERROR_CODE_RATE_LIMIT_EXCEEDED
    | typeof ERROR_CODE_VALIDATION_ERROR
    | typeof ERROR_CODE_INVALID_TYPE
    | typeof ERROR_CODE_QUOTA_EXCEEDED
    | typeof ERROR_CODE_ALREADY_EXISTS;

// Interface - BaseErrorData
// A JSON-serializable representation of a Base error returned from the API
export interface BaseErrorData {
    // The name of the error type.
    readonly name: string;

    // The error message.
    readonly message: string;

    // The HTTP status code associated with the error.
    readonly statusCode: number;

    // The stack trace of the error.
    readonly stack?: string;

    // Application-specific error code for programmatic error handling.
    readonly errorCode?: BaseErrorCode;

    // The underlying cause of the error.
    readonly cause?: BaseErrorData;

    // Any additional information related to the error.
    readonly extensions?: Readonly<Record<string, unknown>>;
}

// Interface - Validation Error Constraint
export interface ValidationErrorConstraint {
    isUnique?: boolean;
    [constraintKey: string]: unknown;
}

// Interface - ValidationErrorData
// A JSON-serializable representation of a validation error
export interface ValidationErrorData {
    // Object that was validated (optional).
    target?: string;

    // Object's property that haven't pass validation.
    property: string;

    // Value that haven't pass a validation (optional).
    value?: unknown;

    // Constraints that failed validation with error messages.
    constraints?: ValidationErrorConstraint;

    // Contains all nested validation errors of the property.
    children?: ValidationErrorData[];
}

// Interface - ArgumentValidationErrorData
// A JSON-serializable representation of an argument validation error
export interface ArgumentValidationErrorData extends BaseErrorData {
    readonly name: 'ArgumentValidationError';
    readonly errorCode: typeof ERROR_CODE_VALIDATION_ERROR;
    readonly extensions: Readonly<Record<string, unknown>> & {
        readonly validationErrors: ReadonlyArray<Readonly<ValidationErrorData>>;
    };
}

// Interface - RateLimitErrorInfo
// Information about rate limiting
export interface RateLimitErrorInfo {
    // The maximum number of requests allowed in the current rate limit window.
    readonly limit: number;

    // The number of remaining requests in the current rate limit window.
    readonly remaining: number;

    // The timestamp (in seconds since epoch) when the rate limit will reset.
    readonly resetAt: number;

    // The number of seconds until the rate limit resets.
    readonly resetAfter: number;
}

// Interface - RateLimitErrorData
// A JSON-serializable representation of a rate limit error
export interface RateLimitErrorData extends BaseErrorData {
    readonly name: 'RateLimitError';
    readonly errorCode: typeof ERROR_CODE_RATE_LIMIT_EXCEEDED;
    readonly extensions: {
        readonly rateLimit: RateLimitErrorInfo;
    };
}

// Type - BaseErrorDataType
// Union of all Base error data types
export type BaseErrorDataType = BaseErrorData | ArgumentValidationErrorData | RateLimitErrorData;

// Type Guard - isBaseErrorData
// Determines if the given error data is a BaseErrorData
export function isBaseErrorData(error: unknown): error is BaseErrorData {
    if(typeof error !== 'object' || error === null) {
        return false;
    }
    const baseError = error as BaseErrorData;
    return (
        typeof baseError.name === 'string' &&
        typeof baseError.message === 'string' &&
        typeof baseError.statusCode === 'number'
    );
}

// Type Guard - isArgumentValidationErrorData
// Determines if the given error data is an ArgumentValidationErrorData
export function isArgumentValidationErrorData(error: unknown): error is ArgumentValidationErrorData {
    if(!isBaseErrorData(error)) {
        return false;
    }
    const argError = error as ArgumentValidationErrorData;
    return (
        argError.name === 'ArgumentValidationError' &&
        argError.errorCode === ERROR_CODE_VALIDATION_ERROR &&
        typeof argError.extensions === 'object' &&
        argError.extensions !== null &&
        'validationErrors' in argError.extensions &&
        Array.isArray(argError.extensions.validationErrors)
    );
}

// Type Guard - isRateLimitErrorData
// Determines if the given error data is a RateLimitErrorData
export function isRateLimitErrorData(error: unknown): error is RateLimitErrorData {
    if(!isBaseErrorData(error)) {
        return false;
    }
    const rateLimitError = error as RateLimitErrorData;
    return (
        rateLimitError.name === 'RateLimitError' &&
        rateLimitError.errorCode === ERROR_CODE_RATE_LIMIT_EXCEEDED &&
        typeof rateLimitError.extensions === 'object' &&
        rateLimitError.extensions !== null &&
        typeof rateLimitError.extensions.rateLimit === 'object' &&
        rateLimitError.extensions.rateLimit !== null &&
        typeof rateLimitError.extensions.rateLimit.limit === 'number' &&
        typeof rateLimitError.extensions.rateLimit.remaining === 'number' &&
        typeof rateLimitError.extensions.rateLimit.resetAt === 'number' &&
        typeof rateLimitError.extensions.rateLimit.resetAfter === 'number'
    );
}

// Type Guard - isBaseErrorDataType
// Type guard to check if an unknown value is a valid BaseErrorDataType
export function isBaseErrorDataType(error: unknown): error is BaseErrorDataType {
    return isArgumentValidationErrorData(error) || isRateLimitErrorData(error) || isBaseErrorData(error);
}

// Class - BaseError
// Transport-agnostic error class for Base API errors (GraphQL, RPC, REST, etc.)
export class BaseError extends Error {
    readonly name: string;
    readonly statusCode: number;
    readonly errorCode?: string;
    readonly stack?: string;
    readonly cause?: BaseError;
    readonly extensions?: Readonly<Record<string, unknown>>;
    readonly originalError?: unknown; // Store transport-specific error for debugging

    constructor(baseErrorData: BaseErrorData, originalError?: unknown) {
        super(baseErrorData.message);
        this.name = baseErrorData.name;
        this.statusCode = baseErrorData.statusCode;
        this.errorCode = baseErrorData.errorCode;
        this.stack = baseErrorData.stack;
        this.cause = baseErrorData.cause ? new BaseError(baseErrorData.cause) : undefined;
        this.extensions = baseErrorData.extensions;
        this.originalError = originalError;
    }

    // Helper: Create BaseError from GraphQL error with sane defaults
    static fromGraphQlError(graphQlError: GraphQlErrorInterface, graphQlResponse?: unknown): BaseError {
        const baseErrorData = graphQlError.extensions?.baseError;

        if(baseErrorData && isBaseErrorData(baseErrorData)) {
            // Base returned a structured error - use it
            return new BaseError(baseErrorData, graphQlResponse);
        }

        // Fallback: Create BaseError with defaults from GraphQL error
        return new BaseError(
            {
                name: 'GraphQLError',
                statusCode: 500,
                message: graphQlError.message || 'GraphQL request failed',
                extensions: graphQlError.extensions,
            },
            graphQlResponse,
        );
    }

    // Helper: Create BaseError from fetch Response with sane defaults
    static async fromResponse(response: Response): Promise<BaseError> {
        try {
            // Attempt to parse JSON error body as BaseErrorData
            const json = await response.json<BaseErrorData>();
            return new BaseError(json);
        } catch {
            // Fallback: Create BaseError with defaults from Response
            return new BaseError({
                name: 'HTTPError',
                statusCode: response.status,
                message: `HTTP request failed with status ${response.status} ${response.statusText}.`,
            });
        }
    }

    // Static method: Check if error is an authentication error
    static isAuthenticationError(error: unknown): error is BaseError {
        return (
            error instanceof BaseError &&
            (error.errorCode === ERROR_CODE_AUTHENTICATION_REQUIRED ||
                error.errorCode === ERROR_CODE_SESSION_INVALID ||
                error.errorCode === ERROR_CODE_ACCOUNT_INVALID)
        );
    }

    // Static method: Check if error is a validation error
    static isValidationError(error: unknown): error is BaseError {
        return (
            error instanceof BaseError &&
            error.errorCode === ERROR_CODE_VALIDATION_ERROR &&
            isArgumentValidationErrorData(error)
        );
    }

    // Static method: Check if error is a rate limit error
    static isRateLimitError(error: unknown): error is BaseError {
        return error instanceof BaseError && error.errorCode === ERROR_CODE_RATE_LIMIT_EXCEEDED;
    }

    // Static method: Check if error is a device ID required error
    static isDeviceIdRequired(error: unknown): error is BaseError {
        return error instanceof BaseError && error.errorCode === ERROR_CODE_DEVICE_ID_REQUIRED;
    }

    // Static method: Get validation errors from error
    static getValidationErrors(error: unknown): ValidationErrorData[] | undefined {
        if(!(error instanceof BaseError)) return undefined;
        if(isArgumentValidationErrorData(error)) {
            return error.extensions.validationErrors as ValidationErrorData[];
        }
        return undefined;
    }

    // Static method: Get error code from error
    static getErrorCode(error: unknown): string | undefined {
        return error instanceof BaseError ? error.errorCode : undefined;
    }

    // Static method: Check if error is a unique constraint validation error
    static isUniqueConstraintError(error: unknown): boolean {
        const validationErrors = BaseError.getValidationErrors(error);
        return !!validationErrors?.[0]?.constraints?.isUnique;
    }

    // Static method: Check if error is an "already exists" error
    static isAlreadyExistsError(error: unknown): error is BaseError {
        return error instanceof BaseError && error.errorCode === ERROR_CODE_ALREADY_EXISTS;
    }

    // Static method: Convert unknown error to BaseError
    static fromUnknownError(error: unknown): BaseError {
        if(error instanceof BaseError) {
            return error;
        }
        if(error instanceof Error) {
            return new BaseError({
                name: error.name || 'Error',
                message: error.message,
                statusCode: 500,
            });
        }
        return new BaseError({
            name: 'UnknownError',
            message: String(error),
            statusCode: 500,
        });
    }
}
