'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { EmailVerificationChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/email-verification/EmailVerificationChallenge';
import { AccountPasswordChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/account-password/AccountPasswordChallenge';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import {
    AccountAuthenticationQuery,
    AuthenticationSessionStatus,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Enum for session scope types
export enum AccountSessionScopeType {
    AccountMaintenance = 'AccountMaintenance',
    AdministratorPrivilege = 'AdministratorPrivilege',
}

// Component - AccountAuthenticatedSession
export interface AccountAuthenticatedSessionProperties {
    scopeType: AccountSessionScopeType;
    title: string;
    description: string;
    buttonText?: string;
    children: React.ReactNode;
    onAuthenticated?: () => void;
}

export function AccountAuthenticatedSession(properties: AccountAuthenticatedSessionProperties) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<
        AccountAuthenticationQuery['accountAuthentication'] | undefined
    >(undefined);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    // Hooks
    const account = useAccount();
    const emailAddress = account.data?.emailAddress ?? '';

    // Hooks - API - Mutations for AccountMaintenance
    const accountMaintenanceSessionCreateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountMaintenanceSessionCreate {
                accountMaintenanceSessionCreate {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    // Hooks - API - Mutations for Administrator
    const accountAdministratorSessionCreateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAdministratorSessionCreate {
                accountAdministratorSessionCreate {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    // Select the appropriate request based on scope type
    const sessionCreateRequest =
        properties.scopeType === AccountSessionScopeType.AccountMaintenance
            ? accountMaintenanceSessionCreateRequest
            : accountAdministratorSessionCreateRequest;

    // Function to create the authentication session
    // This initiates the authentication flow for the specified scope
    async function createAuthenticationSession() {
        await sessionCreateRequest.execute();

        // Get the response data based on scope type
        const sessionData =
            properties.scopeType === AccountSessionScopeType.AccountMaintenance
                ? accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate
                : accountAdministratorSessionCreateRequest.data?.accountAdministratorSessionCreate;

        // Check if immediately authenticated (no challenges required)
        // This can happen if the user recently completed authentication
        if(
            sessionData?.status === AuthenticationSessionStatus.Authenticated &&
            sessionData?.scopeType === properties.scopeType
        ) {
            setIsAuthenticated(true);
            properties.onAuthenticated?.();
        }
    }

    // Extract properties for the useEffect dependency
    const propertiesScopeType = properties.scopeType;
    const propertiesOnAuthenticated = properties.onAuthenticated;

    // Effect to handle authentication state changes
    React.useEffect(
        function () {
            if(
                authenticationSession?.status === AuthenticationSessionStatus.Authenticated &&
                authenticationSession?.scopeType === propertiesScopeType
            ) {
                setIsAuthenticated(true);
                propertiesOnAuthenticated?.();
            }
        },
        [authenticationSession, propertiesScopeType, propertiesOnAuthenticated],
    );

    // Helper function to check if the user is authenticated for the specified scope
    // This checks both the newly created session and any existing authentication session
    function isAuthenticatedForScope() {
        // Check if already marked as authenticated
        if(isAuthenticated) return true;

        // Get the session data based on scope type
        const newSession =
            properties.scopeType === AccountSessionScopeType.AccountMaintenance
                ? accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate
                : accountAdministratorSessionCreateRequest.data?.accountAdministratorSessionCreate;

        // Check if the newly created session is authenticated
        if(
            newSession?.status === AuthenticationSessionStatus.Authenticated &&
            newSession?.scopeType === properties.scopeType
        ) {
            return true;
        }

        // Check if the existing authentication session is valid for this scope
        if(
            authenticationSession?.status === AuthenticationSessionStatus.Authenticated &&
            authenticationSession?.scopeType === properties.scopeType
        ) {
            return true;
        }

        return false;
    }

    // Helper function to check if the user is currently being challenged
    function isBeingChallenged() {
        const sessionData =
            properties.scopeType === AccountSessionScopeType.AccountMaintenance
                ? accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate
                : accountAdministratorSessionCreateRequest.data?.accountAdministratorSessionCreate;

        return sessionData?.status === AuthenticationSessionStatus.Challenged;
    }

    // Helper function to get the current challenge type
    function getCurrentChallengeType() {
        const sessionData =
            properties.scopeType === AccountSessionScopeType.AccountMaintenance
                ? accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate
                : accountAdministratorSessionCreateRequest.data?.accountAdministratorSessionCreate;

        return sessionData?.currentChallenge?.challengeType;
    }

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated - show the protected content
    if(isAuthenticatedForScope()) {
        currentAuthenticationComponent = <>{properties.children}</>;
    }
    // Challenged - show the appropriate challenge
    else if(isBeingChallenged()) {
        // Challenge - Email Verification
        if(getCurrentChallengeType() === 'EmailVerification') {
            currentAuthenticationComponent = (
                <EmailVerificationChallenge
                    emailAddress={emailAddress}
                    onSuccess={function (authenticationSession) {
                        setAuthenticationSession(authenticationSession);
                    }}
                />
            );
        }
        // Challenge - Account Password
        else if(getCurrentChallengeType() === 'AccountPassword') {
            currentAuthenticationComponent = (
                <AccountPasswordChallenge
                    emailAddress={emailAddress}
                    onSuccess={function (authenticationSession) {
                        setAuthenticationSession(authenticationSession);
                    }}
                />
            );
        }
    }
    // Ready to start an authentication session
    else {
        currentAuthenticationComponent = (
            <div>
                <h2 className="text-base font-medium">{properties.title}</h2>
                <p className="mt-4 text-sm">{properties.description}</p>
                <Button
                    isLoading={sessionCreateRequest.isLoading}
                    className="mt-6"
                    onClick={function () {
                        createAuthenticationSession();
                    }}
                >
                    {properties.buttonText || 'Continue'}
                </Button>
            </div>
        );
    }

    // Render the component
    return <div>{currentAuthenticationComponent}</div>;
}

// Hook to check if user is in an authenticated session with specified scope
// This can be used by other components to verify if the user has already
// completed authentication for specific operations
export function useAccountAuthenticatedSession(scopeType: AccountSessionScopeType) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Hooks - API - Queries
    const accountAuthenticationQuery = networkService.useGraphQlQuery(
        gql(`
            query AccountAuthenticatedSessionCheck {
                accountAuthentication {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                }
            }
        `),
        undefined,
    );

    // Effect to update authentication state based on query results
    React.useEffect(
        function () {
            // Check if the current authentication session is valid for the specified scope
            const authData = accountAuthenticationQuery.data?.accountAuthentication;
            const isValidSession =
                authData?.status === AuthenticationSessionStatus.Authenticated && authData?.scopeType === scopeType;

            setIsAuthenticated(isValidSession);
            setIsLoading(accountAuthenticationQuery.isLoading);
        },
        [accountAuthenticationQuery.data, accountAuthenticationQuery.isLoading, scopeType],
    );

    return {
        isAuthenticated,
        isLoading,
        refresh: accountAuthenticationQuery.refresh,
    };
}
