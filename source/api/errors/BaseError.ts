// Dependencies - Error Codes
import { ErrorCode } from './ErrorCodes';

// Interface - Rate Limit Info
export interface RateLimitInfoInterface {
    // Maximum number of requests allowed in the time window
    limit: number;
    // Number of requests remaining in the current window
    remaining: number;
    // Timestamp in milliseconds when the rate limit will reset
    resetAtMs: number;
    // Time in milliseconds until the rate limit resets
    resetAfter: number;
}

/**
 * A JSON-serializable representation of a BaseError from the backend.
 *
 * This mirrors the backend's IBaseError interface and provides a consistent
 * structure for errors across HTTP, GraphQL, RPC, and other communication layers.
 */
export interface BaseErrorInterface<ErrorCodeType extends string = ErrorCode> {
    // The name of the error type.
    readonly name: string;

    // The error message.
    readonly message: string;

    // The HTTP status code associated with the error.
    readonly statusCode: number;

    // The stack trace of the error.
    readonly stack?: string;

    // Application-specific error code for programmatic error handling.
    readonly errorCode?: ErrorCodeType;

    // The underlying cause of the error.
    readonly cause?: BaseErrorInterface<ErrorCodeType>;

    // Any additional information related to the error.
    readonly extension?: Record<string, string>;

    // Rate limit information (present when errorCode is RATE_LIMIT_EXCEEDED)
    readonly rateLimit?: RateLimitInfoInterface;
}
