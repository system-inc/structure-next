// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ContentPage
export type ContentPageProperties = {};
export function ContentPage(properties: ContentPageProperties) {
    // Render the component
    return (
        <div className="px-8 py-4">
            <InternalNavigationTrail />
            <h1>Content</h1>
        </div>
    );
}

// Export - Default
export default ContentPage;
