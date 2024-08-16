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
import { useAccount } from '@structure/source/modules/account/AccountProvider';

// Component - AuthorizationLayout
export interface AuthorizationLayoutInterface {
    children: React.ReactNode;
    mustBeAdministrator?: boolean;
}
export function AuthorizationLayout(properties: AuthorizationLayoutInterface) {
    // throw new Error('hi!');
    // return <NotAuthorized />;
    // return <NotConnected />;
    // return <NotSignedIn />;
    // return <LineLoadingAnimation />;
    // return <ApiError />;

    // Defaults
    const mustBeAdministrator = properties.mustBeAdministrator || false;

    // Hooks
    const { accountState } = useAccount();

    // Loading account or rendering on server
    if(accountState.loading) {
        return <LineLoadingAnimation />;
    }
    // Not signed in
    else if(!accountState.account) {
        return <NotSignedIn />;
    }
    // Error loading account
    else if(accountState.error) {
        return <ApiError error={accountState.error} />;
    }
    // Not authorized
    else if(mustBeAdministrator && accountState.account && !accountState.account.isAdministator()) {
        return <NotAuthorized />;
    }

    // Render the component
    return properties.children;
}

// Export - Default
export default AuthorizationLayout;
