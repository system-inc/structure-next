// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';

// Component - MarketingPage
export function MarketingPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Marketing</h1>
        </div>
    );
}
