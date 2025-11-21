'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { ManagePasswordDialog } from '@structure/source/modules/account/profile/security/components/ManagePasswordDialog';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountMaintenanceDialog } from '@structure/source/modules/account/authentication/components/dialogs/AccountMaintenanceDialog';

// Component - SecurityPage
export function SecurityPage() {
    // State
    const [needsAuthentication, setNeedsAuthentication] = React.useState(false);
    const [showPasswordForm, setShowPasswordForm] = React.useState(false);

    // Hooks - API - Queries
    const accountEnrolledChallengesRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountEnrolledChallenges {
                account {
                    enrolledChallenges
                }
            }
        `),
    );

    // Check if the account has a password set
    const accountHasPasswordSet =
        (accountEnrolledChallengesRequest.data?.account.enrolledChallenges.length ?? 0) > 0 &&
        accountEnrolledChallengesRequest.data?.account.enrolledChallenges.includes('AccountPassword');

    // Functions
    function handlePasswordClick() {
        setNeedsAuthentication(true);
    }

    async function handleAuthenticated() {
        setNeedsAuthentication(false);
        setShowPasswordForm(true);
    }

    // Render the component
    return (
        <>
            <h1>Security</h1>

            <p className="mt-4 content--4">
                Your account uses email-based authentication as the primary sign-in method. You can optionally set a
                password for extra account protection.
            </p>

            <div className="mt-8">
                {/* Set or Change Password Button */}
                <Button variant="A" onClick={handlePasswordClick}>
                    {accountHasPasswordSet ? 'Change Password' : 'Set Password'}
                </Button>
            </div>

            {/* Account Maintenance Dialog - Shows when auth is needed */}
            <AccountMaintenanceDialog
                open={needsAuthentication}
                onOpenChange={function (open) {
                    if(!open) {
                        setNeedsAuthentication(false);
                    }
                }}
                actionText={accountHasPasswordSet ? 'change your password' : 'set your password'}
                onAuthenticated={handleAuthenticated}
            />

            {/* Password Management Dialog - Shows after authentication */}
            <ManagePasswordDialog
                open={showPasswordForm}
                onOpenChange={function (open) {
                    setShowPasswordForm(open);
                }}
                accountHasPasswordSet={accountHasPasswordSet || false}
            />
        </>
    );
}
