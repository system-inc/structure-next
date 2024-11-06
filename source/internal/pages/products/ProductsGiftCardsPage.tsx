// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ProductsGiftCardsPage
export type ProductsGiftCardsPageProperties = {};
export function ProductsGiftCardsPage(properties: ProductsGiftCardsPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Gift Cards</h1>
        </div>
    );
}

// Export - Default
export default ProductsGiftCardsPage;
