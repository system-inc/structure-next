// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ProductsCategoriesPage
export type ProductsCategoriesPageProperties = {};
export function ProductsCategoriesPage(properties: ProductsCategoriesPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Categories</h1>
        </div>
    );
}

// Export - Default
export default ProductsCategoriesPage;
