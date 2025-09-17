'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { DeleteAccountDialog } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccountDialog';
import { AccountMaintenanceDialog } from '@structure/source/modules/account/components/AccountMaintenanceDialog';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Settings',
    };
}

// Component - SettingsPage
export function SettingsPage() {
    // State
    const [needsAuth, setNeedsAuth] = React.useState(false);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);

    // Functions
    function handleDeleteClick() {
        setNeedsAuth(true);
    }

    async function handleAuthenticated() {
        setNeedsAuth(false);
        setDeleteAccountDialogOpen(true);
    }

    // Render the component
    return (
        <>
            <h1>Settings</h1>

            <div className="mt-10">
                <Button
                    variant="destructive"
                    onClick={handleDeleteClick}
                >
                    Delete Account
                </Button>
            </div>

            {/* Account Maintenance Dialog - Shows when auth is needed */}
            <AccountMaintenanceDialog
                open={needsAuth}
                onOpenChange={function (open) {
                    if(!open) {
                        setNeedsAuth(false);
                    }
                }}
                actionText="delete your account"
                onAuthenticated={handleAuthenticated}
            />

            {/* Delete Account Dialog - Shows after authentication */}
            <DeleteAccountDialog
                open={deleteAccountDialogOpen}
                onOpenChange={setDeleteAccountDialogOpen}
            />
        </>
    );
}
