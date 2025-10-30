'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ApiError } from '@structure/source/components/notifications/ApiError';
// import NotConnected from '@structure/source/components/notifications/NotConnected';
import { NotAuthorized } from '@structure/source/components/notifications/NotAuthorized';
import { NotSignedIn } from '@structure/source/components/notifications/NotSignedIn';

// Dependencies - Animation
import { LineLoadingAnimation } from '@structure/source/components/animations/LineLoadingAnimation';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { AccountRole } from '@structure/source/modules/account/Account';

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

    // Error loading account
    if(account.error) {
        return <ApiError error={account.error} />;
    }
    // Not signed in and no cached data available
    else if(!account.signedIn && !account.data) {
        // Still loading initial account data
        if(account.isLoading) {
            return <LineLoadingAnimation />;
        }
        // Not signed in and not loading - show sign in prompt
        return (
            <React.Suspense fallback={null}>
                <NotSignedIn />
            </React.Suspense>
        );
    }
    // If accessibleRoles are defined, check if the user has any of those roles
    else if(accessibleRoles.length > 0) {
        // Account info insufficient to authorize
        if(!account.data) {
            // Still loading account data
            if(account.isLoading) {
                return <LineLoadingAnimation />;
            }
            // Not loading and no data - not authorized
            return <NotAuthorized />;
        }

        // Check if the account has any of the accessible roles
        if(!account.data.isAdministrator() && !account.data.hasAnyRole(accessibleRoles)) {
            return <NotAuthorized />;
        }
    }
    // Render the component
    return properties.children;
}
