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

/**
 * The user does not have sufficient access roles to access a resource.
 *
 * This is different from insufficient entitlements, as access roles
 * are assigned by an administrator or system, rather than the user
 * themselves, and will typically require intervention from support
 * or an administrator to resolve.
 */
export const ERROR_CODE_PERMISSION_DENIED = 'PERMISSION_DENIED';

/**
 * The user does not have sufficient entitlements, e.g.
 * a plan or membership to access a resource.
 *
 * The entitlements are something the user can remedy by upgrading
 * themselves by doing something on the website or similar.
 */
export const ERROR_CODE_INSUFFICIENT_ENTITLEMENTS = 'INSUFFICIENT_ENTITLEMENTS';

// The rate limit for the operation has been exceeded.
export const ERROR_CODE_RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED';

// There was a validation error with the provided data.
export const ERROR_CODE_VALIDATION_ERROR = 'VALIDATION_ERROR';

// The provided data is of an invalid type.
export const ERROR_CODE_INVALID_TYPE = 'INVALID_TYPE';

// The quota for the operation has been exceeded.
export const ERROR_CODE_QUOTA_EXCEEDED = 'QUOTA_EXCEEDED';

/**
 * Framework error codes. These can be extended by applications
 * by creating a union type with additional string literals.
 *
 * This type is designed to be tree-shakeable - only imported error
 * code constants will be included in the final bundle.
 *
 * @example
 * ```typescript
 * // Extend with application-specific error codes
 * type MyAppErrorCode = ErrorCode | 'CUSTOM_ERROR' | 'BACKEND_ERROR';
 *
 * // Use with error checking
 * if (getErrorCode(error) === 'CUSTOM_ERROR') {
 *   // Handle custom error
 * }
 * ```
 */
export type ErrorCode =
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
    | typeof ERROR_CODE_QUOTA_EXCEEDED;
