'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';
import { GraphQlOperationForm } from '@structure/source/api/GraphQlOperationForm';

// Dependencies - API
import { WaitListsDocument, WaitListCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Component - CustomersWaitListsPage
export type CustomersWaitListsPageProperties = {};
export function CustomersWaitListsPage(properties: CustomersWaitListsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1 className="mb-6">Wait Lists</h1>

            <GraphQlOperationForm operation={WaitListCreateOperation} />

            <GraphQlQueryTable queryDocument={WaitListsDocument} />
        </>
    );
}

// Export - Default
export default CustomersWaitListsPage;
