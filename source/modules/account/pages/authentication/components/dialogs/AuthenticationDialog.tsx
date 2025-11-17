'use client'; // This component uses client-only features

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Authentication } from '@structure/source/modules/account/pages/authentication/components/Authentication';
import type { AuthenticationProperties } from '@structure/source/modules/account/pages/authentication/components/Authentication';

// Type - AuthenticationDialogSettings
export interface AuthenticationDialogSettings {
    open: boolean;
    scope: AuthenticationProperties['scope'];
}

// Component - AuthenticationDialog
// This dialog is controlled entirely by useAccount
// Both open state and scope come from account.authenticationDialogSettings
export function AuthenticationDialog() {
    // Hooks
    const account = useAccount();

    // Don't render the dialog if user is signed in (unless scope is Maintenance for maintenance mode)
    // OR if the dialog is not open
    if(
        (account.signedIn && account.authenticationDialogSettings.scope !== 'Maintenance') ||
        !account.authenticationDialogSettings.open
    ) {
        return null;
    }

    // Function to handle dialog open/close changes
    function handleOpenChange(open: boolean) {
        account.setAuthenticationDialogSettings({ open: open });
    }

    // Render the component
    return (
        <Dialog
            variant="A"
            className="p-12"
            open={account.authenticationDialogSettings.open}
            onOpenChange={handleOpenChange}
        >
            <Dialog.Content accessibilityDescription="Authenticate to continue">
                <Authentication className="" variant="Dialog" scope={account.authenticationDialogSettings.scope} />
            </Dialog.Content>
        </Dialog>
    );
}
