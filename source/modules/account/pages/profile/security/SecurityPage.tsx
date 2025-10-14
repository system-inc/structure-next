'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { ManagePasswordDialog } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordDialog';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountMaintenanceDialog } from '../../../components/AccountMaintenanceDialog';

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

            <div className="mt-10">
                {/* Set or Change Password Button */}
                <Button onClick={handlePasswordClick}>
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
