// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - MarketingAutomationsPage
export type MarketingAutomationsPageProperties = {};
export function MarketingAutomationsPage(properties: MarketingAutomationsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Automations</h1>
        </>
    );
}

// Export - Default
export default MarketingAutomationsPage;
