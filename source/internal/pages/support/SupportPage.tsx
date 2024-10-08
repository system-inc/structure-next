// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - SupportPage
export interface SupportPageInterface {}
export function SupportPage() {
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
