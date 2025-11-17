'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { DeleteAccountForm } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccountForm';

// Component - DeleteAccountDialog
export type DeleteAccountDialogProperties = DialogProperties;
export function DeleteAccountDialog(properties: DeleteAccountDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const router = useRouter();

    // Effect to update the open state when the open property changes
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Render the component
    return (
        <Dialog
            variant="A"
            className="p-6"
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        >
            <Dialog.Header>Delete Account</Dialog.Header>
            <Dialog.Content accessibilityDescription="Permanently delete account and all data">
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-red-600">Delete Account</h2>
                    <p className="mb-4 text-sm content--1">
                        This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <DeleteAccountForm
                        onComplete={function () {
                            router.push('/');
                        }}
                    />
                </div>
            </Dialog.Content>
        </Dialog>
    );
}
