// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - ProductsPage
export type ProductsPageProperties = {};
export function ProductsPage(properties: ProductsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Products</h1>
        </>
    );
}

// Export - Default
export default ProductsPage;
