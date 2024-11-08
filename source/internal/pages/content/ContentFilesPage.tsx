// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - ContentFilesPage
export type ContentFilesPageProperties = {};
export function ContentFilesPage(properties: ContentFilesPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Content Files</h1>
        </div>
    );
}

// Export - Default
export default ContentFilesPage;
