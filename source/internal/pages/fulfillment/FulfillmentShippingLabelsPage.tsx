// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - FulfillmentShippingLabelsPage
export type FulfillmentShippingLabelsPageProperties = {};
export function FulfillmentShippingLabelsPage(properties: FulfillmentShippingLabelsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Shipping Labels</h1>
        </>
    );
}

// Export - Default
export default FulfillmentShippingLabelsPage;
