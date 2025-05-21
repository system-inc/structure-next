'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ApiError from '@structure/source/common/notifications/ApiError';
// import NotConnected from '@structure/source/common/notifications/NotConnected';
import NotAuthorized from '@structure/source/common/notifications/NotAuthorized';
import NotSignedIn from '@structure/source/common/notifications/NotSignedIn';

// Dependencies - Animation
import LineLoadingAnimation from '@structure/source/common/animations/LineLoadingAnimation';

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
    const { accountState, signedIn } = useAccount();

    // Loading account or rendering on server
    if(!signedIn && accountState.loading) {
        return <LineLoadingAnimation />;
    }
    // Not signed in
    else if(!signedIn && !accountState.account) {
        return (
            <React.Suspense fallback={null}>
                <NotSignedIn />
            </React.Suspense>
        );
    }
    // Error loading account
    else if(accountState.error) {
        return <ApiError error={accountState.error} />;
    }
    // If accessibleRoles are defined, check if the user has any of those roles
    else if(accessibleRoles.length > 0) {
        // Account info is still loading, wait
        if(accountState.loading) {
            return <LineLoadingAnimation />;
        }

        // Account info insufficient to authorize
        if(!accountState.account) {
            return <NotAuthorized />;
        }

        // Check if the account has any of the accessible roles
        if(!accountState.account.isAdministator() && !accountState.account.hasAnyRole(accessibleRoles)) {
            return <NotAuthorized />;
        }
    }
    // Render the component
    return properties.children;
}

// Export - Default
export default AuthorizationLayout;
