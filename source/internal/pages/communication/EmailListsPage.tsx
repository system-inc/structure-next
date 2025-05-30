'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
// import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';

// Dependencies - API
// import { EmailListsDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - EmailListsPage
// export type EmailListsPageProperties = {};
export function EmailListsPage() {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1 className="mb-5">Email Lists</h1>

            {/* <GraphQlQueryTable queryDocument={EmailListsDocument} /> */}
        </>
    );
}

// Export - Default
export default EmailListsPage;
