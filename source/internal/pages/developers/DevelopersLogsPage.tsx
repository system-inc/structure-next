// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DevelopersLogsPage
export type DevelopersLogsPageProperties = {};
export function DevelopersLogsPage(properties: DevelopersLogsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Logs</h1>
        </>
    );
}

// Export - Default
export default DevelopersLogsPage;
