// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - FulfillmentShippingLabelsPage
export type FulfillmentShippingLabelsPageProperties = {};
export function FulfillmentShippingLabelsPage(properties: FulfillmentShippingLabelsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Shipping Labels</h1>
        </div>
    );
}

// Export - Default
export default FulfillmentShippingLabelsPage;
