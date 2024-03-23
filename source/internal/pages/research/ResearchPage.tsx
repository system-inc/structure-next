// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - ResearchPage
export type ResearchPageProperties = {};
export function ResearchPage(properties: ResearchPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Research</h1>
        </>
    );
}

// Export - Default
export default ResearchPage;
