'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { EmailVerificationChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/email-verification/EmailVerificationChallenge';
import { ManagePasswordForm } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordForm';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { useMutation } from '@apollo/client';
import {
    AuthenticationCurrentQuery,
    AccountMaintenanceSessionCreateDocument,
    AuthenticationSessionStatus,
} from '@project/source/api/GraphQlGeneratedCode';

// Component - ManagePassword
export interface ManagePasswordInterface {
    accountHasPasswordSet: boolean;
    onComplete?: () => void;
}
export function ManagePassword(properties: ManagePasswordInterface) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<
        AuthenticationCurrentQuery['authenticationCurrent'] | undefined
    >(undefined);

    // Hooks
    const account = useAccount();
    const emailAddress = account.accountState.account?.primaryAccountEmail?.emailAddress ?? '';

    // Hooks - API - Mutations
    const [accountMaintenanceSessionCreateMutation, accountMaintenanceSessionCreateMutationState] = useMutation(
        AccountMaintenanceSessionCreateDocument,
    );

    // Function to create the account maintenance session
    async function createAccountMaintenanceSession() {
        await accountMaintenanceSessionCreateMutation();
    }

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated
    if(
        // The account maintenance session shows we are authenticated and the scope is AccountMaintenance
        (accountMaintenanceSessionCreateMutationState.data?.accountMaintenanceSessionCreate.status ==
            AuthenticationSessionStatus.Authenticated &&
            accountMaintenanceSessionCreateMutationState.data?.accountMaintenanceSessionCreate.scopeType ==
                'AccountMaintenance') ||
        // Or, the current authentication session shows we are authenticated and the scope is AccountMaintenance
        (authenticationSession?.status == AuthenticationSessionStatus.Authenticated &&
            authenticationSession?.scopeType == 'AccountMaintenance')
    ) {
        currentAuthenticationComponent = (
            <ManagePasswordForm
                accountHasPasswordSet={properties.accountHasPasswordSet}
                onComplete={properties.onComplete}
            />
        );
    }
    // Challenged
    else if(
        accountMaintenanceSessionCreateMutationState.data?.accountMaintenanceSessionCreate.status ==
        AuthenticationSessionStatus.Challenged
    ) {
        // Challenge - Email Verification
        if(
            accountMaintenanceSessionCreateMutationState.data?.accountMaintenanceSessionCreate.currentChallenge
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
    }
    // Ready to start an authentication session
    else {
        currentAuthenticationComponent = (
            <div>
                <h2 className="text-base font-medium">
                    {properties.accountHasPasswordSet ? 'Change' : 'Set'} Password
                </h2>
                <p className="mt-4 text-sm">
                    To {properties.accountHasPasswordSet ? 'change' : 'set'} your password, please verify your identity.
                </p>
                <Button
                    loading={accountMaintenanceSessionCreateMutationState.loading}
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

// Export - Default
export default ManagePassword;
