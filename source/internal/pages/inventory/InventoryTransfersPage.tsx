// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - InventoryTransfersPage
export type InventoryTransfersPageProperties = {};
export function InventoryTransfersPage(properties: InventoryTransfersPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Transfers</h1>
        </>
    );
}

// Export - Default
export default InventoryTransfersPage;
