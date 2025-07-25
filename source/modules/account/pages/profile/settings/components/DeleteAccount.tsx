'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { EmailVerificationChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/email-verification/EmailVerificationChallenge';
import { AccountPasswordChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/account-password/AccountPasswordChallenge';
import { DeleteAccountForm } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccountForm';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import {
    AccountAuthenticationQuery,
    AuthenticationSessionStatus,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - DeleteAccount
export interface DeleteAccountProperties {
    onComplete?: () => void;
}
export function DeleteAccount(properties: DeleteAccountProperties) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<
        AccountAuthenticationQuery['accountAuthentication'] | undefined
    >(undefined);

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
    }

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated
    if(
        // The account maintenance session shows we are authenticated and the scope is AccountMaintenance
        (accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.status ==
            AuthenticationSessionStatus.Authenticated &&
            accountMaintenanceSessionCreateRequest.data?.accountMaintenanceSessionCreate.scopeType ==
                'AccountMaintenance') ||
        // Or, the current authentication session shows we are authenticated and the scope is AccountMaintenance
        (authenticationSession?.status == AuthenticationSessionStatus.Authenticated &&
            authenticationSession?.scopeType == 'AccountMaintenance')
    ) {
        currentAuthenticationComponent = <DeleteAccountForm onComplete={properties.onComplete} />;
    }
    // Challenged
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
                <h2 className="text-base font-medium">Delete Account</h2>
                <p className="mt-4 text-sm">To delete your account, please verify your identity.</p>
                <Button
                    loading={accountMaintenanceSessionCreateRequest.isLoading}
                    className="mt-6"
                    onClick={function () {
                        createAccountMaintenanceSession();
                    }}
                >
                    Continue
                </Button>
            </div>
        );
    }

    // Render the component
    return <div>{currentAuthenticationComponent}</div>;
}
