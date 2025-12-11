'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { EngagementActivityCard } from '@structure/source/modules/engagement/components/activity/EngagementActivityCard';
import { DeviceActivityInterface } from '@structure/source/modules/engagement/components/activity/EngagementActivity';

// Dependencies - Hooks
import { useUrlParameters } from '@structure/source/router/Navigation';
import { useUserDevicesRequest } from '@structure/source/modules/engagement/hooks/useUserDevicesRequest';

// Dependencies - API
import { useDataInteractionDatabaseTableRowsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRowsRequest';
import { OrderByDirection, ColumnFilterConditionOperator } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Types
import { EngagementEventInterface } from '@structure/source/modules/engagement/types/EngagementTypes';

// Dependencies - Utilities
import {
    formatLocation,
    getAttributionMessage,
} from '@structure/source/modules/engagement/components/activity/utilities/EngagementActivityUtilities';

// Component - AnalyticsSessionPage
export function AnalyticsSessionPage() {
    // Hooks
    const urlParameters = useUrlParameters() as { deviceId: string };
    const deviceId = urlParameters.deviceId;

    // State
    const [hasError, setHasError] = React.useState(false);

    // Query engagement events for this specific device with 10-second polling
    const dataInteractionDatabaseTableRowsRequest = useDataInteractionDatabaseTableRowsRequest(
        'readonly',
        'EngagementEvent',
        {
            itemsPerPage: 500, // Get more events for the detail view
            itemIndex: 0,
            orderBy: [
                {
                    key: 'createdAt',
                    direction: OrderByDirection.Descending,
                },
            ],
        },
        {
            conditions: [
                // Filter by this specific device
                {
                    column: 'deviceId',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: deviceId,
                },
                // Exclude 'ViewContent' events
                {
                    column: 'name',
                    operator: ColumnFilterConditionOperator.NotEqual,
                    value: 'ViewContent',
                },
            ],
        },
        {
            cache: 'SessionStorage',
            refreshIntervalInMilliseconds: hasError ? undefined : 10000, // Stop polling on error
        },
    );

    // Track errors to stop polling
    React.useEffect(
        function () {
            if(dataInteractionDatabaseTableRowsRequest.error) {
                setHasError(true);
            }
        },
        [dataInteractionDatabaseTableRowsRequest.error],
    );

    // Fetch device data
    const userDevicesRequest = useUserDevicesRequest('readonly', [deviceId]);

    // Build device activity from events
    const deviceActivity = React.useMemo(
        function (): DeviceActivityInterface | null {
            const events = (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows.items ||
                []) as EngagementEventInterface[];

            if(events.length === 0) {
                return null;
            }

            // Sort events by time (newest first)
            const sortedEvents = [...events].sort(function (a, b) {
                return b.createdAt.localeCompare(a.createdAt);
            });

            const mostRecentEvent = sortedEvents[0]!;
            const oldestEvent = sortedEvents[sortedEvents.length - 1]!;

            const device = userDevicesRequest.devicesById.get(deviceId);
            const location = formatLocation(
                mostRecentEvent.data?.city,
                mostRecentEvent.data?.region,
                mostRecentEvent.data?.country,
            );
            const attribution = getAttributionMessage(oldestEvent.referrer, oldestEvent.viewIdentifier);

            return {
                deviceId: deviceId,
                currentPage: mostRecentEvent.viewIdentifier || '/',
                pageCount: sortedEvents.length,
                events: sortedEvents,
                lastActivityTime: mostRecentEvent.createdAt,
                sessionStart: oldestEvent.createdAt,
                location: location,
                device: device,
                referrer: oldestEvent.referrer,
                attribution: attribution || undefined,
            };
        },
        [dataInteractionDatabaseTableRowsRequest.data, deviceId, userDevicesRequest.devicesById],
    );

    // Check if we have events for the loading state
    const hasEvents =
        (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows.items?.length ?? 0) > 0;

    // Determine content based on state
    let content;
    if(dataInteractionDatabaseTableRowsRequest.isLoading && !hasEvents) {
        content = <div className="text-sm content--2">Loading session...</div>;
    }
    else if(dataInteractionDatabaseTableRowsRequest.error) {
        const errorMessage = dataInteractionDatabaseTableRowsRequest.error.message || 'Error loading session';
        content = (
            <div className="text-sm content--negative">
                <div className="font-medium">Error:</div>
                <div className="mt-1">{errorMessage}</div>
            </div>
        );
    }
    else if(!deviceActivity) {
        content = <div className="text-sm content--2">No events found for this device</div>;
    }
    else {
        content = (
            <EngagementActivityCard
                deviceId={deviceId}
                deviceActivity={deviceActivity}
                truncatePaths={false}
                defaultExpanded={true}
                showUserAgent={true}
                className="w-full"
            />
        );
    }

    // Render the component
    return (
        <ScrollArea>
            <div className="px-6 py-4 pb-8">
                <OpsNavigationTrail />

                <div className="mx-auto max-w-5xl">
                    <div className="mb-4 flex items-center gap-2">
                        <h1 className="text-lg font-semibold">Session</h1>
                        {deviceActivity && <div className="h-2 w-2 animate-pulse rounded-full background--positive" />}
                    </div>

                    {content}
                </div>
            </div>
        </ScrollArea>
    );
}
