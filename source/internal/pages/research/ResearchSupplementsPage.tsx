// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ResearchSupplementsPage
export type ResearchSupplementsPageProperties = {};
export function ResearchSupplementsPage(properties: ResearchSupplementsPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Supplements</h1>
        </div>
    );
}

// Export - Default
export default ResearchSupplementsPage;
