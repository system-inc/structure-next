// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - MarketingPage
export type MarketingPageProperties = {};
export function MarketingPage(properties: MarketingPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Marketing</h1>
        </>
    );
}

// Export - Default
export default MarketingPage;
