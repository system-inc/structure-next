// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - FulfillmentPage
export type FulfillmentPageProperties = {};
export function FulfillmentPage(properties: FulfillmentPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Fulfillment</h1>
        </>
    );
}

// Export - Default
export default FulfillmentPage;
