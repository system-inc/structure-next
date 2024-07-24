'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    AuthenticationInterface,
    Authentication,
} from '@structure/source/modules/account/authentication/Authentication';
import { ThemeToggle } from '@structure/source/theme/ThemeToggle';

// Component - AuthenticationPage
export interface AuthenticationPageInterface {
    scope: AuthenticationInterface['scope'];
}
export function AuthenticationPage(properties: AuthenticationPageInterface) {
    // Render the component
    return (
        <>
            {/* Theme Toggle */}
            <div className="fixed right-5 top-5 z-10">
                <ThemeToggle />
            </div>

            {/* Authentication */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Authentication className="min-w-96 px-5 md:max-w-md" scope={properties.scope} />
            </div>
        </>
    );
}

// Export - Default
export default AuthenticationPage;
