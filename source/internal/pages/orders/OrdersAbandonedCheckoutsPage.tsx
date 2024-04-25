// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - OrdersAbandonedCheckoutsPage
export type OrdersAbandonedCheckoutsPageProperties = {};
export function OrdersAbandonedCheckoutsPage(properties: OrdersAbandonedCheckoutsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Abandoned Checkouts</h1>
        </>
    );
}

// Export - Default
export default OrdersAbandonedCheckoutsPage;
