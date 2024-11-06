// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - CommunicationPage
export type CommunicationPageProperties = {};
export function CommunicationPage(properties: CommunicationPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Communication</h1>
        </div>
    );
}

// Export - Default
export default CommunicationPage;
