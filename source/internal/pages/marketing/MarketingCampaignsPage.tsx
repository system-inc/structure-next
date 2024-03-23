// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - MarketingCampaignsPage
export type MarketingCampaignsPageProperties = {};
export function MarketingCampaignsPage(properties: MarketingCampaignsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Campaigns</h1>
        </>
    );
}

// Export - Default
export default MarketingCampaignsPage;
