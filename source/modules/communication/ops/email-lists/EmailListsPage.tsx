'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
// import { GraphQlQueryTable } from '@structure/source/components/tables/GraphQlQueryTable';

// Dependencies - API
// import { EmailListsDocument } from '@project/app/_api/graphql/GraphQlGeneratedCode';

// Component - EmailListsPage
// export type EmailListsPageProperties = {};
export function EmailListsPage() {
    // Render the component
    return (
        <>
            <OpsNavigationTrail />

            <h1 className="mb-5">Email Lists</h1>

            {/* <GraphQlQueryTable queryDocument={EmailListsDocument} /> */}
        </>
    );
}
