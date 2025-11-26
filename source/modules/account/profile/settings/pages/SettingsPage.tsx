'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Card } from '@structure/source/components/containers/Card';
import { DeleteAccountDialog } from '@structure/source/modules/account/profile/settings/components/DeleteAccountDialog';
import { AccountMaintenanceDialog } from '@structure/source/modules/account/authentication/components/dialogs/AccountMaintenanceDialog';

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
            <h1 className="mb-10">Settings</h1>

            <Card variant="A" className="">
                <h2 className="mb-4 text-base font-medium">Delete Account</h2>
                <p className="mb-6 text-sm content--4">
                    Deleting your account is permanent and cannot be undone. All of your data will be permanently
                    removed and no data recovery will be available.
                </p>
                <Button variant="Destructive" className="md:self-start" onClick={handleDeleteClick}>
                    Delete Account
                </Button>

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
            </Card>
        </>
    );
}
