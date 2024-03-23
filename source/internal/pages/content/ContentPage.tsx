// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - ContentPage
export type ContentPageProperties = {};
export function ContentPage(properties: ContentPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Content</h1>
        </>
    );
}

// Export - Default
export default ContentPage;
