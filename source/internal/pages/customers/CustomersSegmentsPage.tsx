// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - CustomersSegmentsPage
export function CustomersSegmentsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Segments</h1>
        </div>
    );
}

// Export - Default
export default CustomersSegmentsPage;
