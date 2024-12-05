'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    SideNavigationSectionInterface,
    SideNavigationSection,
} from '@structure/source/common/navigation/side-navigation/SideNavigationSection';

// Component - SideNavigation
export interface SideNavigationInterface {
    sections: SideNavigationSectionInterface[];
}
export function SideNavigation(properties: SideNavigationInterface) {
    // Memoize the categories array to prevent unnecessary re-renders
    const memoizedSections = React.useMemo(
        function () {
            return properties.sections;
        },
        [properties.sections],
    );

    // Render the component
    return (
        <div className="space-y-4">
            {memoizedSections.map(function (section) {
                return <SideNavigationSection key={section.title} {...section} />;
            })}
        </div>
    );
}
