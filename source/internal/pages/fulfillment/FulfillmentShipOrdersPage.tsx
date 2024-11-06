// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - FulfillmentShipOrdersPage
export type FulfillmentShipOrdersPageProperties = {};
export function FulfillmentShipOrdersPage(properties: FulfillmentShipOrdersPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Ship Orders</h1>
        </div>
    );
}

// Export - Default
export default FulfillmentShipOrdersPage;
