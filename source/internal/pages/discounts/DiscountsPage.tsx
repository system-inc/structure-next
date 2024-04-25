// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DiscountsPage
export type DiscountsPageProperties = {};
export function DiscountsPage(properties: DiscountsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Discounts</h1>
        </>
    );
}

// Export - Default
export default DiscountsPage;
