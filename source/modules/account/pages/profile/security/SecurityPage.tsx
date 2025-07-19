'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { ManagePasswordDialog } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordDialog';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Security',
    };
}

// Component - SecurityPage
export function SecurityPage() {
    // State
    const [managePasswordDialogOpen, setManagePasswordDialogOpen] = React.useState(false);

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

    // Render the component
    return (
        <>
            <h1>Security</h1>

            <div className="mt-10">
                {/* Set or Change Password Button */}
                <Button
                    onClick={function () {
                        setManagePasswordDialogOpen(true);
                    }}
                >
                    {accountHasPasswordSet ? 'Change Password' : 'Set Password'}
                </Button>
            </div>

            <ManagePasswordDialog
                open={managePasswordDialogOpen}
                onOpenChange={setManagePasswordDialogOpen}
                accountHasPasswordSet={accountHasPasswordSet || false}
            />
        </>
    );
}
