// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import OpsNavigationTrail from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Component - ContentFilesPage
export function ContentFilesPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Content Files</h1>
        </div>
    );
}

// Export - Default
export default ContentFilesPage;
