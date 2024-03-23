// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - FinancesPayoutPage
export type FinancesPayoutPageProperties = {};
export function FinancesPayoutPage(properties: FinancesPayoutPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Payout</h1>
        </>
    );
}

// Export - Default
export default FinancesPayoutPage;
