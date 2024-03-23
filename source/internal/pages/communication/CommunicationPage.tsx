// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - CommunicationPage
export type CommunicationPageProperties = {};
export function CommunicationPage(properties: CommunicationPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Communication</h1>
        </>
    );
}

// Export - Default
export default CommunicationPage;
