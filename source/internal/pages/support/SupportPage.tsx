// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - SupportPage
export type SupportPageProperties = {};
export function SupportPage(properties: SupportPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Support</h1>
        </>
    );
}

// Export - Default
export default SupportPage;
