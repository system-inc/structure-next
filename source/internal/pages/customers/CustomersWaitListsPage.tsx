// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - CustomersWaitListsPage
export type CustomersWaitListsPageProperties = {};
export function CustomersWaitListsPage(properties: CustomersWaitListsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Wait Lists</h1>
        </>
    );
}

// Export - Default
export default CustomersWaitListsPage;
