'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ApiError from '@structure/source/common/notifications/ApiError';
import NotConnected from '@structure/source/common/notifications/NotConnected';
import NotAuthorized from '@structure/source/common/notifications/NotAuthorized';
import NotSignedIn from '@structure/source/common/notifications/NotSignedIn';

// Dependencies - Animation
import LineLoadingAnimation from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Account
import { useAccountCurrent } from '@structure/source/modules/account/Account';

// Component - AuthorizationLayout
export interface AuthorizationLayoutInterface {
    children: React.ReactNode;
}
export function AuthorizationLayout(properties: AuthorizationLayoutInterface) {
    // throw new Error('hi!');
    // return <NotAuthorized />;
    // return <NotConnected />;
    // return <NotSignedIn />;
    // return <LineLoadingAnimation />;
    // return <ApiError />;

    // Hooks
    const currentAccountState = useAccountCurrent();
    const account = currentAccountState.data;

    // Loading account or rendering on server
    if(currentAccountState.loading) {
        return <LineLoadingAnimation />;
    }
    // Not signed in
    else if(!account) {
        return <NotSignedIn />;
    }
    // Error loading account
    else if(currentAccountState.error) {
        return <ApiError error={currentAccountState.error} />;
    }
    // Not authorized
    else if(account && !account.isAdministator()) {
        return <NotAuthorized />;
    }

    return properties.children;
}

// Export - Default
export default AuthorizationLayout;
