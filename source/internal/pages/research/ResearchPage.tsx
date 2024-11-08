// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ResearchPage
export type ResearchPageProperties = {};
export function ResearchPage(properties: ResearchPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Research</h1>
        </div>
    );
}

// Export - Default
export default ResearchPage;
