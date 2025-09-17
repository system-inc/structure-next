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
    const [needsAuthentication, setNeedsAuthentication] = React.useState(false);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);

    // Function to handle delete button click
    function handleDeleteClick() {
        setNeedsAuthentication(true);
    }

    // Function to handle successful authentication
    async function handleAuthenticated() {
        setNeedsAuthentication(false);
        setDeleteAccountDialogOpen(true);
    }

    // Render the component
    return (
        <>
            <h1>Settings</h1>

            <div className="mt-10">
                <Button variant="destructive" onClick={handleDeleteClick}>
                    Delete Account
                </Button>
            </div>

            {/* Account Maintenance Dialog - Shows when authentication is needed */}
            <AccountMaintenanceDialog
                open={needsAuthentication}
                onOpenChange={function (open) {
                    if(!open) {
                        setNeedsAuthentication(false);
                    }
                }}
                actionText="delete your account"
                onAuthenticated={handleAuthenticated}
            />

            {/* Delete Account Dialog - Shows after authentication */}
            <DeleteAccountDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen} />
        </>
    );
}
