'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { AuthenticationPage } from '@structure/source/modules/account/pages/authentication/AuthenticationPage';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Sign In',
    };
}

// Component - SignInPage
export function SignInPage() {
    // Render the component
    return <AuthenticationPage scope="SignIn" />;
}
