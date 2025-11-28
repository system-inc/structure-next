// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';

// Component - TeamEmployeesPage
export function TeamEmployeesPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1 className="mb-6">Employees</h1>
        </div>
    );
}
