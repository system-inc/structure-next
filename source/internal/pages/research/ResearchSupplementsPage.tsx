// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ResearchSupplementsPage
export type ResearchSupplementsPageProperties = {};
export function ResearchSupplementsPage(properties: ResearchSupplementsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Supplements</h1>
        </>
    );
}

// Export - Default
export default ResearchSupplementsPage;
