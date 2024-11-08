// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - MarketingAutomationsPage
export type MarketingAutomationsPageProperties = {};
export function MarketingAutomationsPage(properties: MarketingAutomationsPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Automations</h1>
        </div>
    );
}

// Export - Default
export default MarketingAutomationsPage;
