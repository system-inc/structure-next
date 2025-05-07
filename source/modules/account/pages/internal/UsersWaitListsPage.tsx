'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';

// Dependencies - API
import { WaitListsDocument, WaitListCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Component - UsersWaitListsPage
export function UsersWaitListsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6">Wait Lists</h1>

            <GraphQlOperationForm className="mb-12" operation={WaitListCreateOperation} />

            <GraphQlQueryTable className="" queryDocument={WaitListsDocument} />
        </div>
    );
}

// Export - Default
export default UsersWaitListsPage;
