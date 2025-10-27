// Dependencies - Error Types and Utilities
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
} from './ErrorCodes';
import { RateLimitInfoInterface } from './BaseError';
import {
    getErrorCode,
    isDeviceIdRequiredError,
    isAuthenticationError,
    isAuthenticationRequiredError,
    isSessionInvalidError,
    isAccountInvalidError,
    isReauthenticationRequiredError,
    isPermissionDeniedError,
    isInsufficientEntitlementsError,
    isQuotaExceededError,
    isRateLimitExceededError,
    extractRateLimitInfo,
} from '@structure/source/api/graphql/GraphQlUtilities';

// Interface - Error Handler Result
export interface ErrorHandlerResult {
    // The error code for programmatic handling
    errorCode: string;
    // Technical error message (for logging/debugging)
    message: string;
    // User-friendly error message (for display)
    userFriendlyMessage: string;
    // Whether the error requires the user to sign in
    requiresSignIn?: boolean;
    // Whether the error requires reauthentication (elevated permissions)
    requiresReauthentication?: boolean;
    // Whether the error requires an account upgrade
    requiresUpgrade?: boolean;
    // Whether the error is a permission issue (needs admin/support)
    isPermissionIssue?: boolean;
    // Whether the error is a quota/rate limit issue
    isQuotaIssue?: boolean;
    // Rate limit information (if available)
    rateLimit?: RateLimitInfoInterface;
}

// Function to handle any error and return standardized error information
export function handleError(error: unknown): ErrorHandlerResult {
    const backendErrorCode = getErrorCode(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

    // Handle specific backend error codes
    if(backendErrorCode) {
        return handleBackendErrorCode(backendErrorCode, errorMessage, error);
    }

    // Fallback for errors without error codes
    return {
        errorCode: 'UnknownError',
        message: errorMessage,
        userFriendlyMessage: 'An unexpected error occurred. Please try again.',
    };
}

// Function to handle backend error codes
function handleBackendErrorCode(errorCode: string, message: string, error: unknown): ErrorHandlerResult {
    // Device ID Required (400)
    if(isDeviceIdRequiredError(error)) {
        return {
            errorCode: ERROR_CODE_DEVICE_ID_REQUIRED,
            message,
            userFriendlyMessage: 'Device verification is required. Please refresh the page.',
        };
    }

    // Authentication Required (401)
    if(isAuthenticationRequiredError(error)) {
        return {
            errorCode: ERROR_CODE_AUTHENTICATION_REQUIRED,
            message,
            userFriendlyMessage: 'Please sign in to continue.',
            requiresSignIn: true,
        };
    }

    // Session Invalid (401)
    if(isSessionInvalidError(error)) {
        return {
            errorCode: ERROR_CODE_SESSION_INVALID,
            message,
            userFriendlyMessage: 'Your session has expired. Please sign in again.',
            requiresSignIn: true,
        };
    }

    // Account Invalid (401)
    if(isAccountInvalidError(error)) {
        return {
            errorCode: ERROR_CODE_ACCOUNT_INVALID,
            message,
            userFriendlyMessage: 'Your account is invalid or suspended. Please contact support.',
            requiresSignIn: true,
        };
    }

    // Reauthentication Required (403)
    if(isReauthenticationRequiredError(error)) {
        return {
            errorCode: ERROR_CODE_REAUTHENTICATION_REQUIRED,
            message,
            userFriendlyMessage: 'Please verify your identity to continue.',
            requiresReauthentication: true,
        };
    }

    // Permission Denied (403)
    if(isPermissionDeniedError(error)) {
        return {
            errorCode: ERROR_CODE_PERMISSION_DENIED,
            message,
            userFriendlyMessage: 'You do not have permission to perform this action.',
            isPermissionIssue: true,
        };
    }

    // Insufficient Entitlements (403)
    if(isInsufficientEntitlementsError(error)) {
        return {
            errorCode: ERROR_CODE_INSUFFICIENT_ENTITLEMENTS,
            message,
            userFriendlyMessage: 'Please upgrade your account to access this feature.',
            requiresUpgrade: true,
        };
    }

    // Quota Exceeded (403)
    if(isQuotaExceededError(error)) {
        return {
            errorCode: ERROR_CODE_QUOTA_EXCEEDED,
            message,
            userFriendlyMessage: 'You have exceeded your quota limit. Please upgrade or try again later.',
            isQuotaIssue: true,
            requiresUpgrade: true,
        };
    }

    // Rate Limit Exceeded (429)
    if(errorCode === ERROR_CODE_RATE_LIMIT_EXCEEDED) {
        const rateLimitInfo = extractRateLimitInfo(error);
        let userMessage = 'Too many requests. Please wait a moment and try again.';

        // If we have rate limit info, make the message more specific
        if(rateLimitInfo?.resetAfter) {
            const resetInSeconds = Math.ceil(rateLimitInfo.resetAfter / 1000);
            if(resetInSeconds < 60) {
                userMessage = `Too many requests. Please wait ${resetInSeconds} seconds and try again.`;
            }
            else {
                const resetInMinutes = Math.ceil(resetInSeconds / 60);
                userMessage = `Too many requests. Please wait ${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''} and try again.`;
            }
        }

        return {
            errorCode: ERROR_CODE_RATE_LIMIT_EXCEEDED,
            message,
            userFriendlyMessage: userMessage,
            isQuotaIssue: true,
            rateLimit: rateLimitInfo,
        };
    }

    // Generic error with error code
    return {
        errorCode,
        message,
        userFriendlyMessage: message || 'An error occurred. Please try again.',
    };
}

// Export types for convenience
export type { RateLimitInfoInterface };

// Export error checking and extraction functions for convenience
export {
    getErrorCode,
    isDeviceIdRequiredError,
    isAuthenticationError,
    isAuthenticationRequiredError,
    isSessionInvalidError,
    isAccountInvalidError,
    isReauthenticationRequiredError,
    isPermissionDeniedError,
    isInsufficientEntitlementsError,
    isQuotaExceededError,
    isRateLimitExceededError,
    extractRateLimitInfo,
};
