'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AuthenticationPage } from '@structure/source/modules/account/pages/AuthenticationPage';

// Component - SignInPage
export interface SignInPageInterface {}
export function SignInPage(properties: SignInPageInterface) {
    // Render the component
    return <AuthenticationPage scope="SignIn" />;
}

// Export - Default
export default SignInPage;
