'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';

// Dependencies - API
import { EmailCampaignsDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - EmailCampaignsPage
export interface EmailCampaignsPageInterface {}
export function EmailCampaignsPage(properties: EmailCampaignsPageInterface) {
    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1 className="mb-5">Email Campaigns</h1>

            <GraphQlQueryTable queryDocument={EmailCampaignsDocument} />
        </>
    );
}

// Export - Default
export default EmailCampaignsPage;
