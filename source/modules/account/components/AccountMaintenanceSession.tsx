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
    async function createAccountMaintenanceSession() {
        await accountMaintenanceSessionCreateRequest.execute();

        // Check if immediately authenticated (no challenges required)
        if(
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.status ===
                AuthenticationSessionStatus.Authenticated &&
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.scopeType ===
                'AccountMaintenance'
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

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated - show the protected content
    if(
        isAuthenticated ||
        // The account maintenance session shows we are authenticated and the scope is AccountMaintenance
        (accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.status ==
            AuthenticationSessionStatus.Authenticated &&
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.scopeType ==
                'AccountMaintenance') ||
        // Or, the current authentication session shows we are authenticated and the scope is AccountMaintenance
        (authenticationSession?.status == AuthenticationSessionStatus.Authenticated &&
            authenticationSession?.scopeType == 'AccountMaintenance')
    ) {
        currentAuthenticationComponent = <>{properties.children}</>;
    }
    // Challenged - show the appropriate challenge
    else if(
        accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.status ==
        AuthenticationSessionStatus.Challenged
    ) {
        // Challenge - Email Verification
        if(
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.currentChallenge
                ?.challengeType == 'EmailVerification'
        ) {
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
        else if(
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.currentChallenge
                ?.challengeType == 'AccountPassword'
        ) {
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

    React.useEffect(
        function () {
            if(
                accountAuthenticationQuery.data?.accountAuthentication?.status ===
                    AuthenticationSessionStatus.Authenticated &&
                accountAuthenticationQuery.data?.accountAuthentication?.scopeType === 'AccountMaintenance'
            ) {
                setIsAuthenticated(true);
            }
            else {
                setIsAuthenticated(false);
            }
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
