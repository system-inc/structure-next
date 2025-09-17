'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
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

// Component - AccountMaintenanceSession
export interface AccountMaintenanceSessionProperties {
    title: string;
    description: string;
    buttonText?: string;
    children: React.ReactNode;
    onAuthenticated?: () => void;
}

export function AccountMaintenanceSession(properties: AccountMaintenanceSessionProperties) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<
        AccountAuthenticationQuery['accountAuthentication'] | undefined
    >(undefined);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    // Hooks
    const account = useAccount();
    const emailAddress = account.data?.emailAddress ?? '';

    // Hooks - API - Mutations
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

    // Function to create the account maintenance session
    // This initiates the authentication flow for sensitive account operations
    async function createAccountMaintenanceSession() {
        await accountMaintenanceSessionCreateRequest.execute();

        // Check if immediately authenticated (no challenges required)
        // This can happen if the user recently completed authentication
        const sessionData = accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate;
        if(
            sessionData?.status === AuthenticationSessionStatus.Authenticated &&
            sessionData?.scopeType === 'AccountMaintenance'
        ) {
            setIsAuthenticated(true);
            properties.onAuthenticated?.();
        }
    }

    // Effect to handle authentication state changes
    React.useEffect(
        function () {
            if(
                authenticationSession?.status === AuthenticationSessionStatus.Authenticated &&
                authenticationSession?.scopeType === 'AccountMaintenance'
            ) {
                setIsAuthenticated(true);
                properties.onAuthenticated?.();
            }
        },
        [authenticationSession, properties],
    );

    // Helper function to check if the user is authenticated for account maintenance
    // This checks both the newly created session and any existing authentication session
    function isAuthenticatedForMaintenance() {
        // Check if already marked as authenticated
        if(isAuthenticated) return true;

        // Check if the newly created maintenance session is authenticated
        const newSession = accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate;
        if(
            newSession?.status === AuthenticationSessionStatus.Authenticated &&
            newSession?.scopeType === 'AccountMaintenance'
        ) {
            return true;
        }

        // Check if the existing authentication session is valid for maintenance
        if(
            authenticationSession?.status === AuthenticationSessionStatus.Authenticated &&
            authenticationSession?.scopeType === 'AccountMaintenance'
        ) {
            return true;
        }

        return false;
    }

    // Helper function to check if the user is currently being challenged
    function isBeingChallenged() {
        return (
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.status ===
            AuthenticationSessionStatus.Challenged
        );
    }

    // Helper function to get the current challenge type
    function getCurrentChallengeType() {
        return accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.currentChallenge
            ?.challengeType;
    }

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated - show the protected content
    if(isAuthenticatedForMaintenance()) {
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
                    loading={accountMaintenanceSessionCreateRequest.isLoading}
                    className="mt-6"
                    onClick={function () {
                        createAccountMaintenanceSession();
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

// Hook to check if user is in an authenticated maintenance session
// This can be used by other components to verify if the user has already
// completed authentication for sensitive account operations
export function useAccountMaintenanceSession() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Hooks - API - Queries
    const accountAuthenticationQuery = networkService.useGraphQlQuery(
        gql(`
            query AccountMaintenenceAuthentication {
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
    );

    // Effect to update authentication state based on query results
    React.useEffect(
        function () {
            // Check if the current authentication session is valid for account maintenance
            const authData = accountAuthenticationQuery.data?.accountAuthentication;
            const isValidMaintenanceSession =
                authData?.status === AuthenticationSessionStatus.Authenticated &&
                authData?.scopeType === 'AccountMaintenance';

            setIsAuthenticated(isValidMaintenanceSession);
            setIsLoading(accountAuthenticationQuery.isLoading);
        },
        [accountAuthenticationQuery.data, accountAuthenticationQuery.isLoading],
    );

    return {
        isAuthenticated,
        isLoading,
        refresh: accountAuthenticationQuery.refresh,
    };
}
