// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - FinancesPayoutPage
export type FinancesPayoutPageProperties = {};
export function FinancesPayoutPage(properties: FinancesPayoutPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Payout</h1>
        </div>
    );
}

// Export - Default
export default FinancesPayoutPage;
