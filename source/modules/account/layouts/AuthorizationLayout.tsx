'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ApiErrorNotice } from '@structure/source/components/notices/ApiErrorNotice';
// import NotConnected from '@structure/source/components/notifications/NotConnected';
import { NotAuthorizedNotice } from '@structure/source/components/notices/NotAuthorizedNotice';
import { NotSignedInNotice } from '@structure/source/components/notices/NotSignedInNotice';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { AccountRole } from '@structure/source/modules/account/Account';

// Dependencies - API
import { BaseError } from '@structure/source/api/errors/BaseError';

// Placeholder - Shown while loading to prevent layout shift
const authorizationLayoutPlaceholder = <div className="min-h-[75vh] w-full" />;

// Component - AuthorizationLayout
export interface AuthorizationLayoutProperties {
    children: React.ReactNode;
    mustBeAdministrator?: boolean;
    // If defined, further restrictions are applied and the user is only
    // authorized if the user has any one of these roles.
    accessibleRoles?: AccountRole[];
}

// Component that validates the user's authorization (logged in state) and renders the children if authorized.
export function AuthorizationLayout(properties: AuthorizationLayoutProperties) {
    // Defaults
    const accessibleRoles = properties.accessibleRoles || [];

    // Hooks
    const account = useAccount();

    // Not signed in and no cached data available
    if(!account.signedIn && !account.data) {
        // Still loading initial account data
        if(account.isLoading) {
            return authorizationLayoutPlaceholder;
        }

        // Not signed in and not loading - show sign in prompt
        return (
            <React.Suspense fallback={authorizationLayoutPlaceholder}>
                {authorizationLayoutPlaceholder}
                <NotSignedInNotice />
            </React.Suspense>
        );
    }
    // If accessibleRoles are defined, check if the user has any of those roles
    else if(accessibleRoles.length > 0) {
        // Account info insufficient to authorize
        if(!account.data) {
            // Still loading account data
            if(account.isLoading) {
                return authorizationLayoutPlaceholder;
            }
            // Not loading and no data - not authorized
            return <NotAuthorizedNotice />;
        }

        // Check if the account has any of the accessible roles
        if(!account.data.isAdministrator() && !account.data.hasAnyRole(accessibleRoles)) {
            return <NotAuthorizedNotice />;
        }
    }
    // Check for authentication errors first - these should show sign-in UI, not error UI
    // are expected for unauthenticated users and should trigger the sign-in flow
    else if(account.error && !BaseError.isAuthenticationError(account.error)) {
        // Other API errors (network, server, etc.) should show error screen
        return <ApiErrorNotice error={account.error} />;
    }

    // Render the component
    return properties.children;
}
