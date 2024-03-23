// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - CustomersSegmentsPage
export type CustomersSegmentsPageProperties = {};
export function CustomersSegmentsPage(properties: CustomersSegmentsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Segments</h1>
        </>
    );
}

// Export - Default
export default CustomersSegmentsPage;
