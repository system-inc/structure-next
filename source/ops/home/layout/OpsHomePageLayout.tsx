'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { EngagementActivity } from '@structure/source/modules/engagement/components/activity/EngagementActivity';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';

// Dependencies - Hooks
import { useMediaQuery } from '@structure/source/utilities/react/hooks/useMediaQuery';

// Component - OpsHomePageLayout
export interface OpsHomePageLayoutProperties {
    children: React.ReactNode;
    databaseName?: string;
}
export function OpsHomePageLayout(properties: OpsHomePageLayoutProperties) {
    // Hooks
    // xl breakpoint is 1280px - show sidebar on larger screens
    const isLargeScreenMediaQuery = useMediaQuery('(min-width: 1280px)');

    // State
    const [isMounted, setIsMounted] = React.useState(false);

    // Whether to show the sidebar (only after mounted and on large screens)
    const showSidebar = isMounted && isLargeScreenMediaQuery;

    // Effects
    React.useEffect(function () {
        // Mark as mounted to avoid hydration mismatch with media query
        setIsMounted(true);
    }, []);

    // Render the component
    return (
        <div className="flex h-full w-full background--0">
            {/* Dashboard - fills remaining space, scrolls independently */}
            <div className="min-w-0 flex-1">{properties.children}</div>

            {/* Sidebar - fixed width on right, hidden on small screens */}
            {showSidebar && (
                <ScrollArea containerClassName="h-full w-80 shrink-0">
                    <EngagementActivity
                        className="mt-6 flex h-full flex-col"
                        databaseName={properties.databaseName ?? 'readonly'}
                    />
                </ScrollArea>
            )}
        </div>
    );
}
