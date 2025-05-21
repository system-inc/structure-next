// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Component - OrdersAbandonedCheckoutsPage
export function OrdersAbandonedCheckoutsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Abandoned Checkouts</h1>
        </div>
    );
}
