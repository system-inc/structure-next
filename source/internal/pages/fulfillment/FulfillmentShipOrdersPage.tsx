// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - FulfillmentShipOrdersPage
export type FulfillmentShipOrdersPageProperties = {};
export function FulfillmentShipOrdersPage(properties: FulfillmentShipOrdersPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Ship Orders</h1>
        </>
    );
}

// Export - Default
export default FulfillmentShipOrdersPage;
