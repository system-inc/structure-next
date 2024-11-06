// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - AnalyticsPage
export type AnalyticsPageProperties = {};
export function AnalyticsPage(properties: AnalyticsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Analytics</h1>
        </div>
    );
}

// Export - Default
export default AnalyticsPage;
