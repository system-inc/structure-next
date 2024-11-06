// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - AnalyticsLivePage
export type AnalyticsLivePageProperties = {};
export function AnalyticsLivePage(properties: AnalyticsLivePageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Live</h1>
        </div>
    );
}

// Export - Default
export default AnalyticsLivePage;
