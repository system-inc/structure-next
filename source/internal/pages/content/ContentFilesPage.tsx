// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - ContentFilesPage
export type ContentFilesPageProperties = {};
export function ContentFilesPage(properties: ContentFilesPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Content Files</h1>
        </>
    );
}

// Export - Default
export default ContentFilesPage;
