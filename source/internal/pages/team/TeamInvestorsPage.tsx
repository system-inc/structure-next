// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';

// Component - TeamInvestorsPage
export type TeamInvestorsPageProperties = {};
export function TeamInvestorsPage(properties: TeamInvestorsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Investors</h1>
        </>
    );
}

// Export - Default
export default TeamInvestorsPage;
