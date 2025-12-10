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
import { Link } from '@structure/source/components/navigation/Link';

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
const sessionsPagePath = '/ops/analytics/sessions';

// Interface - DeviceActivity
export interface DeviceActivityInterface {
    deviceId: string;
    currentPage: string; // Most recent viewIdentifier
    pageCount: number; // Total event count (named pageCount for historical reasons)
    events: EngagementEventInterface[]; // All events for this device, sorted by time
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
    cardClassName?: string;
    truncatePaths?: boolean;
    databaseName: string;
}
export function EngagementActivity(properties: EngagementActivityProperties) {
    // State
    const deviceActivitiesReference = React.useRef<Map<string, DeviceActivityInterface>>(new Map());
    const [deviceActivities, setDeviceActivities] = React.useState<Map<string, DeviceActivityInterface>>(new Map());
    const [newDeviceIds, setNewDeviceIds] = React.useState<Set<string>>(new Set());
    const [updatedDeviceIds, setUpdatedDeviceIds] = React.useState<Set<string>>(new Set());
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

    // Group events by device and merge with existing device data
    React.useEffect(
        function () {
            if(events.length === 0) {
                return;
            }

            const foundNewDevices = new Set<string>();
            const foundUpdatedDevices = new Set<string>();
            const processedDevices = new Set<string>();

            // Get current device activities from ref
            const currentActivities = new Map(deviceActivitiesReference.current);

            // Group events by deviceId (skip events without deviceId)
            events.forEach(function (event) {
                const deviceId = event.deviceId;

                // Skip events without a deviceId
                if(!deviceId) {
                    return;
                }

                // Skip if we've already processed this device in this batch
                if(processedDevices.has(deviceId)) {
                    return;
                }

                processedDevices.add(deviceId);

                // Find all events for this device from the query
                const deviceEvents = events.filter(function (eventItem) {
                    return eventItem.deviceId === deviceId;
                });

                if(deviceEvents.length === 0) {
                    return;
                }

                // Merge with existing events if device already exists
                let allDeviceEvents = deviceEvents;
                const existingActivity = currentActivities.get(deviceId);
                if(existingActivity) {
                    // Combine existing and new events, remove duplicates by event ID
                    const eventMap = new Map<string, EngagementEventInterface>();
                    existingActivity.events.forEach(function (existingEvent) {
                        eventMap.set(existingEvent.id, existingEvent);
                    });
                    deviceEvents.forEach(function (newEvent) {
                        eventMap.set(newEvent.id, newEvent);
                    });
                    allDeviceEvents = Array.from(eventMap.values());
                }

                // Sort events by time (newest first) using createdAt to avoid client clock skew
                allDeviceEvents.sort(function (a, b) {
                    return b.createdAt.localeCompare(a.createdAt);
                });

                const mostRecentEvent = allDeviceEvents[0]!;
                const oldestEvent = allDeviceEvents[allDeviceEvents.length - 1]!;

                const device = userDevicesRequest.devicesById.get(deviceId);
                const location = formatLocation(
                    mostRecentEvent.data?.city,
                    mostRecentEvent.data?.region,
                    mostRecentEvent.data?.country,
                );
                const attribution = getAttributionMessage(oldestEvent.referrer, oldestEvent.viewIdentifier);

                const activity: DeviceActivityInterface = {
                    deviceId: deviceId,
                    currentPage: mostRecentEvent.viewIdentifier || '/',
                    pageCount: allDeviceEvents.length,
                    events: allDeviceEvents,
                    lastActivityTime: mostRecentEvent.createdAt,
                    sessionStart: oldestEvent.createdAt, // Use createdAt to avoid client clock skew
                    location: location,
                    device: device,
                    referrer: oldestEvent.referrer,
                    attribution: attribution || undefined,
                };

                // Check if this is a new device or updated device
                if(!existingActivity) {
                    foundNewDevices.add(deviceId);
                }
                else if(existingActivity.lastActivityTime !== activity.lastActivityTime) {
                    foundUpdatedDevices.add(deviceId);
                }

                currentActivities.set(deviceId, activity);
            });

            // Update ref and state
            deviceActivitiesReference.current = currentActivities;
            setDeviceActivities(new Map(currentActivities));

            if(foundNewDevices.size > 0) {
                setNewDeviceIds(foundNewDevices);
                setTimeout(function () {
                    setNewDeviceIds(new Set());
                }, 1000);
            }

            if(foundUpdatedDevices.size > 0) {
                setUpdatedDeviceIds(foundUpdatedDevices);
                setTimeout(function () {
                    setUpdatedDeviceIds(new Set());
                }, 1000);
            }
        },
        [events, userDevicesRequest.devicesById],
    );

    // Sort devices by most recent activity and filter out sessions older than 30 minutes
    // Re-runs every 10 seconds when polling updates to check for expired sessions
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const filtered = Array.from(deviceActivities.values()).filter(function (deviceActivity) {
        // Using createdAt (server timestamp) instead of loggedAt (client timestamp)
        // to avoid issues with client clock skew
        const lastActivity = parseUtcDateString(deviceActivity.lastActivityTime);
        return lastActivity >= thirtyMinutesAgo;
    });

    const sortedDevices = filtered.sort(function (a, b) {
        return b.lastActivityTime.localeCompare(a.lastActivityTime);
    });

    // Determine content based on state
    let content;
    if(dataInteractionDatabaseTableRowsRequest.isLoading && events.length === 0) {
        content = (
            <>
                <Link href={sessionsPagePath} className="mb-4 block text-lg font-semibold hover:underline">
                    Sessions
                </Link>
                <div className="text-sm content--2">Loading sessions...</div>
            </>
        );
    }
    else if(dataInteractionDatabaseTableRowsRequest.error) {
        const errorMessage = dataInteractionDatabaseTableRowsRequest.error.message || 'Error loading sessions';
        content = (
            <>
                <Link href={sessionsPagePath} className="mb-4 block text-lg font-semibold hover:underline">
                    Sessions
                </Link>
                <div className="text-sm content--negative">
                    <div className="font-medium">Error:</div>
                    <div className="mt-1">{errorMessage}</div>
                    <div className="mt-2 text-xs content--2">Database: {properties.databaseName}</div>
                </div>
            </>
        );
    }
    else if(sortedDevices.length === 0) {
        content = (
            <>
                <Link href={sessionsPagePath} className="mb-4 block text-lg font-semibold hover:underline">
                    Sessions
                </Link>
                <div className="text-sm content--2">No active sessions</div>
            </>
        );
    }
    else {
        content = (
            <>
                {/* Header - fixed */}
                <div className="mb-4 flex shrink-0 items-center gap-2">
                    <Link href={sessionsPagePath} className="text-lg font-semibold hover:underline">
                        Sessions ({sortedDevices.length})
                    </Link>
                    <div className="h-2 w-2 animate-pulse rounded-full background--positive" />
                </div>

                {/* Devices list - scrollable, takes remaining height */}
                <ScrollArea containerClassName="flex-1" className="pb-6 md:pr-3 md:pb-3">
                    <div ref={containerReference} className="space-y-3">
                        <AnimatePresence initial={false} propagate>
                            {sortedDevices.map(function (deviceActivity) {
                                const isNew = newDeviceIds.has(deviceActivity.deviceId);
                                const wasUpdated = updatedDeviceIds.has(deviceActivity.deviceId);
                                return (
                                    <EngagementActivityCard
                                        key={deviceActivity.deviceId}
                                        className={properties.cardClassName}
                                        deviceId={deviceActivity.deviceId}
                                        deviceActivity={deviceActivity}
                                        isNew={isNew}
                                        wasUpdated={wasUpdated}
                                        truncatePaths={properties.truncatePaths}
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
