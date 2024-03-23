// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - AnalyticsReportsPage
export type AnalyticsReportsPageProperties = {};
export function AnalyticsReportsPage(properties: AnalyticsReportsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Reports</h1>
        </>
    );
}

// Export - Default
export default AnalyticsReportsPage;
