'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import OpsNavigationTrail from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';

// Dependencies - API
import {
    WaitListsPrivilegedDocument,
    WaitListCreatePrivilegedOperation,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - UsersWaitListsPage
export function UsersWaitListsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <h1 className="mb-6">Wait Lists</h1>

            <GraphQlOperationForm className="mb-12" operation={WaitListCreatePrivilegedOperation} />

            <GraphQlQueryTable className="" queryDocument={WaitListsPrivilegedDocument} />
        </div>
    );
}
