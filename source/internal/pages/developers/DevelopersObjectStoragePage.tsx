// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DevelopersObjectStoragePage
export type DevelopersObjectStoragePageProperties = {};
export function DevelopersObjectStoragePage(properties: DevelopersObjectStoragePageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Object Storage</h1>
        </>
    );
}

// Export - Default
export default DevelopersObjectStoragePage;
