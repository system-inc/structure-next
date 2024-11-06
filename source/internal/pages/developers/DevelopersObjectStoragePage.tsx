// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DevelopersObjectStoragePage
export type DevelopersObjectStoragePageProperties = {};
export function DevelopersObjectStoragePage(properties: DevelopersObjectStoragePageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Object Storage</h1>
        </div>
    );
}

// Export - Default
export default DevelopersObjectStoragePage;
