// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - OrdersPage
export type OrdersPageProperties = {};
export function OrdersPage(properties: OrdersPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Orders</h1>
        </>
    );
}

// Export - Default
export default OrdersPage;
