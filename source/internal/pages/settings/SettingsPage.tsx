// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - SettingsPage
export type SettingsPageProperties = {};
export function SettingsPage(properties: SettingsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Settings</h1>
        </>
    );
}

// Export - Default
export default SettingsPage;
