'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { SideNavigationLayout } from '@structure/source/layouts/side-navigation/SideNavigationLayout';
import { AuthorizationLayout } from '@structure/source/layouts/AuthorizationLayout';
import { OpsSupportPageNavigation } from '@structure/source/modules/support/ops/layout/OpsSupportPageNavigation';
import { AccountRole } from '@structure/source/modules/account/Account';

// Component - OpsSupportLayout
export interface OpsSupportLayoutProperties {
    children: React.ReactNode;
}
export function OpsSupportLayout(properties: OpsSupportLayoutProperties) {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();

    // Get the currently viewed ticket identifier from the URL parameters
    const currentlyViewedTicketIdentifier = urlSearchParameters?.get('ticket') ?? null;

    // Render the component
    return (
        <AuthorizationLayout accessibleRoles={[AccountRole.Support]}>
            <SideNavigationLayout
                identifier="OpsSupport"
                layout="Flex"
                showHeader={false}
                defaultNavigationWidth={360}
                maximumNavigationWidth={640}
                alwaysShowNavigationOnDesktop={true}
                navigation={
                    <OpsSupportPageNavigation currentlyViewedTicketIdentifier={currentlyViewedTicketIdentifier} />
                }
                contentBody={properties.children}
            />
        </AuthorizationLayout>
    );
}
