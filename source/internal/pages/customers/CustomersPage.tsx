// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - CustomersPage
export type CustomersPageProperties = {};
export function CustomersPage(properties: CustomersPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Customers</h1>
        </>
    );
}

// Export - Default
export default CustomersPage;
