'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AuthenticationDialog } from '@structure/source/modules/account/pages/authentication/components/AuthenticationDialog';

// Dependencies - Services
import { useHydrateAtoms } from 'jotai/utils';
import { accountIsSignedInAtom } from './useAccount';
import { useAtomValue } from 'jotai';

// Cache key constants
export const accountCacheKey = 'account';

// Component - AccountProvider
export interface AccountProviderProperties {
    children: React.ReactNode;
    signedIn: boolean;
}
export function AccountProvider(properties: AccountProviderProperties) {
    // Hydrate the accountIsSignedInAtom atom with the signedIn property from the properties object
    useHydrateAtoms([[accountIsSignedInAtom, properties.signedIn]]);

    // Render the component
    return (
        <>
            {properties.children}

            {/* AuthenticationDialog */}
            <ConditionalAuthenticationDialog />
        </>
    );
}

// Silo state for the authentication dialog away from the Provider component so that state updates
// don't rerender adjacent children in the tree.
function ConditionalAuthenticationDialog() {
    const signedIn = useAtomValue(accountIsSignedInAtom);
    const [authenticationDialogOpen, setAuthenticationDialogOpen] = React.useState(!signedIn);

    return (
        !signedIn && (
            <AuthenticationDialog
                scope="SignIn"
                open={authenticationDialogOpen}
                onOpenChange={setAuthenticationDialogOpen}
            />
        )
    );
}

// ✨ We love shims! ✨
export { useAccount } from './useAccount';
