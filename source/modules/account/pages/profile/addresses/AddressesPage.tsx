'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Animation
import LoadingAnimation from '@structure/source/common/animations/LoadingAnimation';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Addresses',
    };
}

// Component - AddressesPage
export interface AddressesPageInterface {}
export function AddressesPage(properties: AddressesPageInterface) {
    // Render the component
    return (
        <>
            {false ? (
                // Loading
                <LoadingAnimation />
            ) : (
                // Data
                <div>
                    <h1>Addresses</h1>
                </div>
            )}
        </>
    );
}

// Export - Default
export default AddressesPage;
