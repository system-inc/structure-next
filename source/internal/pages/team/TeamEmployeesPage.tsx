// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Component - TeamEmployeesPage
export type TeamEmployeesPageProperties = {};
export function TeamEmployeesPage(properties: TeamEmployeesPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1 className="mb-6">Employees</h1>
        </>
    );
}

// Export - Default
export default TeamEmployeesPage;
