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
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';

// Dependencies - Hooks
import { useUserDevicesRequest } from '@structure/source/modules/engagement/hooks/useUserDevicesRequest';

// Dependencies - API
import { useDataInteractionDatabaseTableRowsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRowsRequest';
import { OrderByDirection, ColumnFilterConditionOperator } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Animation
import { AnimatePresence } from 'motion/react';

// Dependencies - Utilities
import { formatLocation, getAttributionMessage, parseUtcDateString } from './utilities/EngagementActivityUtilities';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
    const [events, setEvents] = React.useState<EngagementEventInterface[]>([]);
    const [deviceIds, setDeviceIds] = React.useState<string[]>([]);

    // Hooks - Query engagement events every 10 seconds (stop polling on error)
    const dataInteractionDatabaseTableRowsRequest = useDataInteractionDatabaseTableRowsRequest(
        properties.databaseName,
        'EngagementEvent',
        {
            itemsPerPage: 100,
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

    // Extract events from response and compute device IDs
    React.useEffect(
        function () {
            const extractedEvents = (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows
                .items || []) as EngagementEventInterface[];

            setEvents(extractedEvents);

            // Get unique device IDs from events
            const ids = extractedEvents
                .map(function (event) {
                    return event.deviceId;
                })
                .filter(function (id): id is string {
                    return !!id;
                });
            setDeviceIds(Array.from(new Set(ids)));
        },
        [dataInteractionDatabaseTableRowsRequest.data],
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

                // Sort events by time (newest first) using createdAt to avoid client clock skew
                allVisitorEvents.sort(function (a, b) {
                    return b.createdAt.localeCompare(a.createdAt);
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
                    lastActivityTime: mostRecentEvent.createdAt,
                    sessionStart: oldestEvent.createdAt, // Use createdAt to avoid client clock skew
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
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const filtered = Array.from(visitorActivities.values()).filter(function (visitor) {
        // Using createdAt (server timestamp) instead of loggedAt (client timestamp)
        // to avoid issues with client clock skew
        const lastActivity = parseUtcDateString(visitor.lastActivityTime);
        return lastActivity >= thirtyMinutesAgo;
    });

    const sortedVisitors = filtered.sort(function (a, b) {
        return b.lastActivityTime.localeCompare(a.lastActivityTime);
    });

    // Determine content based on state
    let content;
    if(dataInteractionDatabaseTableRowsRequest.isLoading && events.length === 0) {
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-sm content--2">Loading sessions...</div>
            </>
        );
    }
    else if(dataInteractionDatabaseTableRowsRequest.error) {
        const errorMessage = dataInteractionDatabaseTableRowsRequest.error.message || 'Error loading sessions';
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-sm content--negative">
                    <div className="font-medium">Error:</div>
                    <div className="mt-1">{errorMessage}</div>
                    <div className="mt-2 text-xs content--2">Database: {properties.databaseName}</div>
                </div>
            </>
        );
    }
    else if(sortedVisitors.length === 0) {
        content = (
            <>
                <div className="mb-4 text-lg font-semibold">{title}</div>
                <div className="text-sm content--2">No active sessions</div>
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
                    <div className="h-2 w-2 animate-pulse rounded-full background--positive" />
                </div>

                {/* Visitors list - scrollable, takes remaining height */}
                <ScrollArea containerClassName="flex-1" className="pb-6 md:pr-3 md:pb-3">
                    <div ref={containerReference} className="space-y-3">
                        <AnimatePresence initial={false} propagate>
                            {sortedVisitors.map(function (visitor) {
                                const isNew = newVisitorIds.has(visitor.visitorId);
                                const wasUpdated = updatedVisitorIds.has(visitor.visitorId);
                                return (
                                    <EngagementActivityCard
                                        key={visitor.visitorId}
                                        visitorId={visitor.visitorId}
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
    return <div className={mergeClassNames('flex flex-col', properties.className)}>{content}</div>;
}
