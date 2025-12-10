'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { EngagementActivity } from '@structure/source/modules/engagement/components/activity/EngagementActivity';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';

// Component - AnalyticsSessionsPage
export function AnalyticsSessionsPage() {
    // Render the component
    return (
        <ScrollArea>
            <div className="px-6 py-4 pb-8">
                <OpsNavigationTrail />

                <div className="mx-auto max-w-5xl">
                    <EngagementActivity databaseName="readonly" cardClassName="w-full" truncatePaths={false} />
                </div>
            </div>
        </ScrollArea>
    );
}
