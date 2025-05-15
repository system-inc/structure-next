// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import OpsNavigationTrail from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Component - FulfillmentPage
export function FulfillmentPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Fulfillment</h1>
        </div>
    );
}

// Export - Default
export default FulfillmentPage;
