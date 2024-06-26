// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ProductsCollectionsPage
export type ProductsCollectionsPageProperties = {};
export function ProductsCollectionsPage(properties: ProductsCollectionsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Collections</h1>
        </>
    );
}

// Export - Default
export default ProductsCollectionsPage;
