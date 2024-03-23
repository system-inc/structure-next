// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - ProductsGiftCardsPage
export type ProductsGiftCardsPageProperties = {};
export function ProductsGiftCardsPage(properties: ProductsGiftCardsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Gift Cards</h1>
        </>
    );
}

// Export - Default
export default ProductsGiftCardsPage;
