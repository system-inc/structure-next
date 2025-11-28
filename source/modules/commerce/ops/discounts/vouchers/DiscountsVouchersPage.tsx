// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';

// Component - DiscountsVouchersPage
export function DiscountsVouchersPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Vouchers</h1>
        </div>
    );
}
