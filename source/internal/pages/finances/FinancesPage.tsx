// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - FinancesPage
export type FinancesPageProperties = {};
export function FinancesPage(properties: FinancesPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Finances</h1>
        </>
    );
}

// Export - Default
export default FinancesPage;
