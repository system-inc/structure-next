// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InternalNavigationTrail } from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { SideNavigationLayoutContentHeaderLeft } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContentHeaderLeft';

// Component - SettingsPage
export type SettingsPageProperties = {};
export function SettingsPage(properties: SettingsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail className="mb-4" />
            <h1>Settings</h1>
        </>
    );
}

// Export - Default
export default SettingsPage;
