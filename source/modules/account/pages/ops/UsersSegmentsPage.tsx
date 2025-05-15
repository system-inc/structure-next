// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import OpsNavigationTrail from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Component - UsersSegmentsPage
export function UsersSegmentsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Segments</h1>
        </div>
    );
}

// Export - Default
export default UsersSegmentsPage;
