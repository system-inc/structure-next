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
export interface AuthorizationLayoutInterface {
    children: React.ReactNode;

    // If the user has any one of these roles, they are authorized
    requiredAccessRoles?: string[];
}
export function AuthorizationLayout(properties: AuthorizationLayoutInterface) {
    // throw new Error('hi!');
    // return <NotAuthorized />;
    // return <NotConnected />;
    // return <NotSignedIn />;
    // return <LineLoadingAnimation />;
    // return <ApiError />;

    // Defaults
    const requiredRoles = properties.requiredAccessRoles || [];

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
    // Not authorized - check both mustBeAdministrator and requiredRoles
    else if(requiredRoles.length > 0 && (!accountState.account || !accountState.account.hasAnyRole(requiredRoles))) {
        return <NotAuthorized />;
    }

    // Render the component
    return properties.children;
}

// Export - Default
export default AuthorizationLayout;
