// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - OrdersDraftsPage
export type OrdersDraftsPageProperties = {};
export function OrdersDraftsPage(properties: OrdersDraftsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Drafts</h1>
        </>
    );
}

// Export - Default
export default OrdersDraftsPage;
