// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - InventoryPage
export type InventoryPageProperties = {};
export function InventoryPage(properties: InventoryPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Inventory</h1>
        </>
    );
}

// Export - Default
export default InventoryPage;
