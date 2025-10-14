'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import {
    AuthenticationProperties,
    Authentication,
} from '@structure/source/modules/account/pages/authentication/components/Authentication';

// Component - AuthenticationDialog
export interface AuthenticationDialogProperties extends Omit<AuthenticationProperties, 'variant'>, DialogProperties {}
export function AuthenticationDialog(properties: AuthenticationDialogProperties) {
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
            accessibilityTitle="Authenticate"
            content={<Authentication className="" variant="Dialog" scope={properties.scope} />}
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
