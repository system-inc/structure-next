'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { DeleteAccount } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccount';

// Component - DeleteAccountDialog
export interface DeleteAccountDialogProperties extends DialogProperties {}
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
            className="p-12"
            accessibilityTitle="Delete Account"
            content={
                <DeleteAccount
                    onComplete={function () {
                        router.push('/');
                    }}
                />
            }
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}

// Export - Default
export default DeleteAccountDialog;
