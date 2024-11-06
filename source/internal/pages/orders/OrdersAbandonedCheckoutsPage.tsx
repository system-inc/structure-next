// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - OrdersAbandonedCheckoutsPage
export type OrdersAbandonedCheckoutsPageProperties = {};
export function OrdersAbandonedCheckoutsPage(properties: OrdersAbandonedCheckoutsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Abandoned Checkouts</h1>
        </div>
    );
}

// Export - Default
export default OrdersAbandonedCheckoutsPage;
