// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - InventoryTransfersPage
export type InventoryTransfersPageProperties = {};
export function InventoryTransfersPage(properties: InventoryTransfersPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Transfers</h1>
        </div>
    );
}

// Export - Default
export default InventoryTransfersPage;
