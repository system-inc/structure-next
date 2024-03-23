'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';

// Dependencies - API
import { emailListsQueryDocument } from '@structure/source/modules/email/api/EmailDocuments';

// Component - EmailListsPage
export type EmailListsPageProperties = {};
export function EmailListsPage(properties: EmailListsPageProperties) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1 className="mb-5">Email Lists</h1>

            <GraphQlQueryTable queryDocument={emailListsQueryDocument} />
        </>
    );
}

// Export - Default
export default EmailListsPage;
