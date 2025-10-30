// Dependencies - API
import { getGraphQlErrorCode } from '@structure/source/api/graphql/utilities/GraphQlUtilities';

// Function to check if the error requires user to sign in (401 errors)
export function isGraphQlAuthenticationError(error: unknown): boolean {
    const errorCode = getGraphQlErrorCode(error);
    return (
        errorCode === 'AUTHENTICATION_REQUIRED' || errorCode === 'SESSION_INVALID' || errorCode === 'ACCOUNT_INVALID'
    );
}
