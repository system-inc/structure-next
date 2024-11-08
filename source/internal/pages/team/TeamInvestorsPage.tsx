// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - TeamInvestorsPage
export type TeamInvestorsPageProperties = {};
export function TeamInvestorsPage(properties: TeamInvestorsPageProperties) {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />
            <h1>Investors</h1>
        </div>
    );
}

// Export - Default
export default TeamInvestorsPage;
