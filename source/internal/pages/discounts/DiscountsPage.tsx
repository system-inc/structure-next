// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DiscountsPage
export type DiscountsPageProperties = {};
export function DiscountsPage(properties: DiscountsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Discounts</h1>
        </div>
    );
}

// Export - Default
export default DiscountsPage;
