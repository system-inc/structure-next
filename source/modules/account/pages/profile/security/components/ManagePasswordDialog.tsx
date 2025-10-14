'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { ManagePasswordForm } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordForm';

// Component - ManagePasswordDialog
export interface ManagePasswordDialogProperties extends DialogProperties {
    accountHasPasswordSet: boolean;
}
export function ManagePasswordDialog(properties: ManagePasswordDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);
    const [showForm, setShowForm] = React.useState(properties.open ?? false);

    // Effect to update the open state when the open property changes
    React.useEffect(
        function () {
            if(properties.open) {
                setOpen(true);
                setShowForm(true);
            }
            else {
                // Hide form immediately, then close dialog after animation
                setShowForm(false);
                setTimeout(function () {
                    setOpen(false);
                }, 0);
            }
        },
        [properties.open],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        if(!open) {
            // Hide form first
            setShowForm(false);
            // Then notify parent
            setTimeout(function () {
                properties.onOpenChange?.(false);
                setOpen(false);
            }, 0);
        }
        else {
            properties.onOpenChange?.(true);
            setOpen(true);
            setShowForm(true);
        }
    }

    // Render the component
    return (
        <Dialog
            className="p-6"
            accessibilityTitle={properties.accountHasPasswordSet ? 'Change Password' : 'Set Password'}
            content={
                showForm ? (
                    <ManagePasswordForm
                        accountHasPasswordSet={properties.accountHasPasswordSet}
                        onComplete={function () {
                            onOpenChangeIntercept(false);
                        }}
                    />
                ) : (
                    <div style={{ minHeight: '200px' }} />
                )
            }
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
