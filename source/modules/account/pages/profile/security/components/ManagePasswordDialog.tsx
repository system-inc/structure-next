'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogInterface, Dialog } from '@structure/source/common/dialogs/Dialog';
import { ManagePassword } from '@structure/source/modules/account/pages/profile/security/components/ManagePassword';

// Component - ManagePasswordDialog
export interface ManagePasswordDialogInterface extends DialogInterface {
    accountHasPasswordSet: boolean;
}
export function ManagePasswordDialog(properties: ManagePasswordDialogInterface) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

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
            accessibilityTitle="Manage Password"
            content={
                <ManagePassword
                    accountHasPasswordSet={properties.accountHasPasswordSet}
                    onComplete={function () {
                        onOpenChangeIntercept(false);
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
export default ManagePasswordDialog;
