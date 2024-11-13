'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';

// Dependencies - API
import { CommerceOrdersAdminDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - OrdersPage
export function OrdersPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6">Orders</h1>

            <GraphQlQueryTable queryDocument={CommerceOrdersAdminDocument} />
        </div>
    );
}

// Export - Default
export default OrdersPage;
