'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@structure/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';
import { SignInForm } from '@structure/source/modules/account/SignInForm';

// Component - RootPage
export interface HomePageInterface {}
export function HomePage(properties: HomePageInterface) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="rounded-md border p-8">
                <SignInForm className="mb-2 w-80" />
            </div>
        </div>
    );
}

// Export - Default
export default HomePage;