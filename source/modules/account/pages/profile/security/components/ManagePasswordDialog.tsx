'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { ManagePasswordForm } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordForm';

// Component - ManagePasswordDialog
export interface ManagePasswordDialogProperties extends DialogProperties {
    accountHasPasswordSet: boolean;
}
export function ManagePasswordDialog(properties: ManagePasswordDialogProperties) {
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
            className="p-6"
            accessibilityTitle={properties.accountHasPasswordSet ? 'Change Password' : 'Set Password'}
            content={
                <ManagePasswordForm
                    accountHasPasswordSet={properties.accountHasPasswordSet}
                    onComplete={function () {
                        onOpenChangeIntercept(false);
                    }}
                />
            }
            onOpenAutoFocus={function(event) {
                // Prevent auto-focus which might trigger validation
                event.preventDefault();
            }}
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
