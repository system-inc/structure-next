// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - DiscountsVouchersPage
export type DiscountsVouchersPageProperties = {};
export function DiscountsVouchersPage(properties: DiscountsVouchersPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Vouchers</h1>
        </>
    );
}

// Export - Default
export default DiscountsVouchersPage;
