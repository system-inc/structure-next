// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - OrdersPage
export type OrdersPageProperties = {};
export function OrdersPage(properties: OrdersPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Orders</h1>
        </div>
    );
}

// Export - Default
export default OrdersPage;
