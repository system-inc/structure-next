'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Authentication } from '@structure/source/modules/account/authentication/Authentication';

// Component - RegisterPage
export interface RegisterPageInterface {}
export function RegisterPage(properties: RegisterPageInterface) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="min-w-80 p-4">
                <Authentication />
            </div>
        </div>
    );
}

// Export - Default
export default RegisterPage;
