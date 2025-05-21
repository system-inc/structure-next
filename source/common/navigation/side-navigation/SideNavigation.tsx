'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    SideNavigationSectionProperties,
    SideNavigationSection,
} from '@structure/source/common/navigation/side-navigation/SideNavigationSection';

// Component - SideNavigation
export interface SideNavigationProperties {
    sections: SideNavigationSectionProperties[];
}
export function SideNavigation(properties: SideNavigationProperties) {
    // Render the component
    return (
        <div className="space-y-4">
            {properties.sections.map(function (section, sectionIndex) {
                return <SideNavigationSection key={sectionIndex} {...section} />;
            })}
        </div>
    );
}
