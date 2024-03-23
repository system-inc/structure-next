// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - AnalyticsPage
export type AnalyticsPageProperties = {};
export function AnalyticsPage(properties: AnalyticsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Analytics</h1>
        </>
    );
}

// Export - Default
export default AnalyticsPage;
