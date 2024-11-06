// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - MarketingCampaignsPage
export type MarketingCampaignsPageProperties = {};
export function MarketingCampaignsPage(properties: MarketingCampaignsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Campaigns</h1>
        </div>
    );
}

// Export - Default
export default MarketingCampaignsPage;
