'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    SideNavigationCategoryInterface,
    SideNavigationCategory,
} from '@structure/source/common/navigation/side-navigation/SideNavigationCategory';

// Component - SideNavigation
export interface SideNavigationInterface {
    categories: SideNavigationCategoryInterface[];
}
export function SideNavigation(properties: SideNavigationInterface) {
    // Memoize the categories array to prevent unnecessary re-renders
    const memoizedCategories = React.useMemo(
        function () {
            return properties.categories;
        },
        [properties.categories],
    );

    // Render the component
    return (
        <div className="space-y-4">
            {memoizedCategories.map(function (category) {
                return <SideNavigationCategory key={category.title} {...category} />;
            })}
        </div>
    );
}
