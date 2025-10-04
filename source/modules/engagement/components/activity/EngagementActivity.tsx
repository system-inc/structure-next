'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import {
    EngagementEventInterface,
    UserDeviceInterface,
} from '@structure/source/modules/engagement/types/EngagementTypes';

// Dependencies - Main Components
import { EngagementActivityCard } from './EngagementActivityCard';
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';

// Dependencies - Hooks
import { useUserDevicesRequest } from '@structure/source/modules/engagement/hooks/useUserDevicesRequest';

// Dependencies - API
import { useDataInteractionDatabaseTableRowsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRowsRequest';
import { OrderByDirection, ColumnFilterConditionOperator } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Animation
import { AnimatePresence } from 'motion/react';

// Dependencies - Utilities
import { formatLocation, getAttributionMessage, parseUtcDateString } from './utilities/EngagementActivityUtilities';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Constants
const title = 'Sessions';

// Interface - VisitorActivity
export interface VisitorActivityInterface {
    visitorId: string; // visitId or deviceId
    currentPage: string; // Most recent viewIdentifier
    pageCount: number; // Total event count (named pageCount for historical reasons)
    events: EngagementEventInterface[]; // All events for this visitor, sorted by time
    lastActivityTime: string; // Most recent event timestamp
    sessionStart: string; // Visit start time
    location?: string; // City, region from most recent event
    device?: UserDeviceInterface | null; // Device info
    referrer?: string; // Original referrer
    attribution?: string; // Attribution message
}

// Component - EngagementActivity
export interface EngagementActivityProperties {
    className?: string;
    databaseName: string;
}
export function EngagementActivity(properties: EngagementActivityProperties) {
    // State
    const visitorActivitiesReference = React.useRef<Map<string, VisitorActivityInterface>>(new Map());
    const [visitorActivities, setVisitorActivities] = React.useState<Map<string, VisitorActivityInterface>>(new Map());
    const [newVisitorIds, setNewVisitorIds] = React.useState<Set<string>>(new Set());
    const [updatedVisitorIds, setUpdatedVisitorIds] = React.useState<Set<string>>(new Set());
    const containerReference = React.useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = React.useState(false);

    // Hooks - Query engagement events every 10 seconds (stop polling on error)
    const dataInteractionDatabaseTableRowsRequest = useDataInteractionDatabaseTableRowsRequest(
        properties.databaseName,
        'EngagementEvent',
        {
            itemsPerPage: 100,
            itemIndex: 0,
            orderBy: [
                {
                    key: 'loggedAt',
                    direction: OrderByDirection.Descending,
                },
            ],
        },
        {
            conditions: [
                // Exclude 'ViewContent' events
                {
                    column: 'name',
                    operator: ColumnFilterConditionOperator.NotEqual,
                    value: 'ViewContent',
                },
                // Only include events from the Production client environment
                {
                    column: 'clientEnvironment',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: 'Production',
                },
            ],
        },
        {
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

    // Extract events from response
    const events = React.useMemo(
        function () {
            return (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows.items ||
                []) as EngagementEventInterface[];
        },
        [dataInteractionDatabaseTableRowsRequest.data],
    );

    // Get unique device IDs from events
    const deviceIds = React.useMemo(
        function () {
            const ids = events
                .map(function (event) {
                    return event.deviceId;
                })
                .filter(function (id): id is string {
                    return !!id;
                });
            return Array.from(new Set(ids));
        },
        [events],
    );

    // Fetch device data for all unique device IDs
    const userDevicesRequest = useUserDevicesRequest(properties.databaseName, deviceIds);

    // Group events by visitor and merge with existing visitor data
    React.useEffect(
        function () {
            if(events.length === 0) {
                return;
            }

            const foundNewVisitors = new Set<string>();
            const foundUpdatedVisitors = new Set<string>();
            const processedVisitors = new Set<string>();

            // Get current visitor activities from ref
            const currentActivities = new Map(visitorActivitiesReference.current);

            // Group events by visitor (deviceId is primary, visitId is fallback)
            events.forEach(function (event) {
                // Prioritize deviceId (more stable across sessions), fall back to visitId
                const visitorId = event.deviceId || event.visitId;

                // Skip events without a proper visitor ID
                if(!visitorId) {
                    return;
                }

                // Skip if we've already processed this visitor in this batch
                if(processedVisitors.has(visitorId)) {
                    return;
                }

                processedVisitors.add(visitorId);

                // Find all events for this visitor from the query (using same priority)
                const visitorEvents = events.filter(function (eventItem) {
                    const eventVisitorId = eventItem.deviceId || eventItem.visitId;
                    return eventVisitorId === visitorId;
                });

                if(visitorEvents.length === 0) {
                    return;
                }

                // Merge with existing events if visitor already exists
                let allVisitorEvents = visitorEvents;
                const existingActivity = currentActivities.get(visitorId);
                if(existingActivity) {
                    // Combine existing and new events, remove duplicates by event ID
                    const eventMap = new Map<string, EngagementEventInterface>();
                    existingActivity.events.forEach(function (existingEvent) {
                        eventMap.set(existingEvent.id, existingEvent);
                    });
                    visitorEvents.forEach(function (newEvent) {
                        eventMap.set(newEvent.id, newEvent);
                    });
                    allVisitorEvents = Array.from(eventMap.values());
                }

                // Sort events by time (newest first)
                allVisitorEvents.sort(function (a, b) {
                    const timeA = a.loggedAt || a.createdAt;
                    const timeB = b.loggedAt || b.createdAt;
                    return timeB.localeCompare(timeA);
                });

                const mostRecentEvent = allVisitorEvents[0]!;
                const oldestEvent = allVisitorEvents[allVisitorEvents.length - 1]!;

                const device = event.deviceId ? userDevicesRequest.devicesById.get(event.deviceId) : undefined;
                const location = formatLocation(
                    mostRecentEvent.data?.city,
                    mostRecentEvent.data?.region,
                    mostRecentEvent.data?.country,
                );
                const attribution = getAttributionMessage(oldestEvent.referrer, oldestEvent.viewIdentifier);

                const activity: VisitorActivityInterface = {
                    visitorId: visitorId,
                    currentPage: mostRecentEvent.viewIdentifier || '/',
                    pageCount: allVisitorEvents.length,
                    events: allVisitorEvents,
                    lastActivityTime: mostRecentEvent.loggedAt || mostRecentEvent.createdAt,
                    sessionStart: oldestEvent.visitStartAt || oldestEvent.createdAt,
                    location: location,
                    device: device,
                    referrer: oldestEvent.referrer,
                    attribution: attribution || undefined,
                };

                // Check if this is a new visitor or updated visitor
                if(!existingActivity) {
                    foundNewVisitors.add(visitorId);
                }
                else if(existingActivity.lastActivityTime !== activity.lastActivityTime) {
                    foundUpdatedVisitors.add(visitorId);
                }

                currentActivities.set(visitorId, activity);
            });

            // Update ref and state
            visitorActivitiesReference.current = currentActivities;
            setVisitorActivities(new Map(currentActivities));

            if(foundNewVisitors.size > 0) {
                setNewVisitorIds(foundNewVisitors);
                setTimeout(function () {
                    setNewVisitorIds(new Set());
                }, 1000);
            }

            if(foundUpdatedVisitors.size > 0) {
                setUpdatedVisitorIds(foundUpdatedVisitors);
                setTimeout(function () {
                    setUpdatedVisitorIds(new Set());
                }, 1000);
            }
        },
        [events, userDevicesRequest.devicesById],
    );

    // Sort visitors by most recent activity and filter out sessions older than 30 minutes
    // Re-runs every 10 seconds when polling updates to check for expired sessions
    const sortedVisitors = React.useMemo(
        function () {
            const now = new Date();
            const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

            return Array.from(visitorActivities.values())
                .filter(function (visitor) {
                    const lastActivity = parseUtcDateString(visitor.lastActivityTime);
                    return lastActivity >= thirtyMinutesAgo;
                })
                .sort(function (a, b) {
                    return b.lastActivityTime.localeCompare(a.lastActivityTime);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visitorActivities, dataInteractionDatabaseTableRowsRequest.data],
    );

    // Determine content based on state
    let content;
    if(dataInteractionDatabaseTableRowsRequest.isLoading && events.length === 0) {
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-neutral-400 dark:text-neutral-500 text-sm">Loading sessions...</div>
            </>
        );
    }
    else if(dataInteractionDatabaseTableRowsRequest.error) {
        const errorMessage = dataInteractionDatabaseTableRowsRequest.error.message || 'Error loading sessions';
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-sm text-red-500">
                    <div className="font-medium">Error:</div>
                    <div className="mt-1">{errorMessage}</div>
                    <div className="text-neutral-400 dark:text-neutral-500 mt-2 text-xs">
                        Database: {properties.databaseName}
                    </div>
                </div>
            </>
        );
    }
    else if(sortedVisitors.length === 0) {
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-neutral-400 dark:text-neutral-500 text-sm">No active sessions</div>
            </>
        );
    }
    else {
        content = (
            <>
                {/* Header - fixed */}
                <div className="mb-4 flex shrink-0 items-center gap-2">
                    <h2 className="text-lg font-semibold">
                        {title} ({sortedVisitors.length})
                    </h2>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                </div>

                {/* Visitors list - scrollable, takes remaining height */}
                <ScrollArea className="flex-1 pb-3 pr-2.5">
                    <div ref={containerReference} className="space-y-3 pb-6">
                        <AnimatePresence>
                            {sortedVisitors.map(function (visitor) {
                                const isNew = newVisitorIds.has(visitor.visitorId);
                                const wasUpdated = updatedVisitorIds.has(visitor.visitorId);
                                return (
                                    <EngagementActivityCard
                                        key={visitor.visitorId}
                                        visitorActivity={visitor}
                                        isNew={isNew}
                                        wasUpdated={wasUpdated}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </>
        );
    }

    // Render the component
    return <div className={mergeClassNames('flex w-80 shrink-0 flex-col', properties.className)}>{content}</div>;
}
