// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - FulfillmentPage
export type FulfillmentPageProperties = {};
export function FulfillmentPage(properties: FulfillmentPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Fulfillment</h1>
        </div>
    );
}

// Export - Default
export default FulfillmentPage;
