'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { DeleteAccountDialog } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccountDialog';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Settings',
    };
}

// Component - SecurityPage
export function SecurityPage() {
    // State
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);

    // Render the component
    return (
        <>
            <h1>Settings</h1>

            <div className="mt-10">
                <Button
                    variant="destructive"
                    onClick={function () {
                        setDeleteAccountDialogOpen(true);
                    }}
                >
                    Delete Account
                </Button>
            </div>

            <DeleteAccountDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen} />
        </>
    );
}
