'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ApiError } from '@structure/source/common/notifications/ApiError';
// import NotConnected from '@structure/source/common/notifications/NotConnected';
import { NotAuthorized } from '@structure/source/common/notifications/NotAuthorized';
import { NotSignedIn } from '@structure/source/common/notifications/NotSignedIn';

// Dependencies - Animation
import { LineLoadingAnimation } from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Component - AuthorizationLayout
export interface AuthorizationLayoutProperties {
    children: React.ReactNode;
    mustBeAdministrator?: boolean;
    // If defined, further restrictions are applied and the user is only
    // authorized if the user has any one of these roles.
    accessibleRoles?: string[];
}

/**
 * Component that validates the user's authorization (logged in state) and renders the children if authorized.
 */
export function AuthorizationLayout(properties: AuthorizationLayoutProperties) {
    // Defaults
    const accessibleRoles = properties.accessibleRoles || [];

    // Hooks
    const account = useAccount();

    // Loading account or rendering on server
    if(!account.signedIn && account.isLoading) {
        return <LineLoadingAnimation />;
    }
    // Not signed in
    else if(!account.signedIn && !account.data) {
        return (
            <React.Suspense fallback={null}>
                <NotSignedIn />
            </React.Suspense>
        );
    }
    // Error loading account
    else if(account.error) {
        return <ApiError error={account.error} />;
    }
    // If accessibleRoles are defined, check if the user has any of those roles
    else if(accessibleRoles.length > 0) {
        // Account info is still loading, wait
        if(account.isLoading) {
            return <LineLoadingAnimation />;
        }

        // Account info insufficient to authorize
        if(!account.data) {
            return <NotAuthorized />;
        }

        // Check if the account has any of the accessible roles
        if(!account.data.isAdministator() && !account.data.hasAnyRole(accessibleRoles)) {
            return <NotAuthorized />;
        }
    }
    // Render the component
    return properties.children;
}
