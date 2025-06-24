'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - Session Management
import { sessionManager } from '@structure/source/modules/engagement/SessionManager';

// Dependencies - API
import { apolloClient } from '@structure/source/api/apollo/ApolloClient';
import {
    // EngagementEventCreateDocument,
    EngagementEventsCreateDocument,
    DeviceOrientation,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/String';
import { getThirdPartyAttributionForEvents } from '@structure/source/modules/engagement/utilities/EngagementUtilities';

// Type for engagement event data
interface EngagementEventData {
    name: string;
    category?: string;
    deviceProperties: {
        orientation?: DeviceOrientation;
    };
    clientProperties: {
        environment: string;
    };
    eventContext: {
        viewIdentifier: string;
        viewTitle: string | null;
        referrer?: string;
        sessionDurationInMilliseconds?: number;
        additionalData?: Record<string, unknown>;
        loggedAt: string;
    };
}

// Queue for batching events
const eventQueue: Array<EngagementEventData> = [];
let batchTimeout: NodeJS.Timeout | null = null;
let isFirstEvent = true;

// Function to process and send the event queue
function processBatchQueue() {
    // If the queue is empty, do nothing
    if(eventQueue.length === 0) {
        return;
    }

    // Copy the current queue and clear it
    const eventsToSend = [...eventQueue];
    eventQueue.length = 0;

    // Reset the timeout
    batchTimeout = null;

    // Log the events being sent
    // console.log(
    //     '📊 Sending engagement events:',
    //     eventsToSend.map((event) => event.name),
    // );

    // Send the batch of events
    apolloClient.mutate({
        mutation: EngagementEventsCreateDocument,
        variables: {
            input: eventsToSend,
        },
    });
}

// Function to create an engagement event
export function createEngagementEvent(
    eventName: string,
    eventCategory?: string,
    eventSpecificData?: Record<string, unknown>,
) {
    // Return early if the engagement module is not enabled
    if(!ProjectSettings.modules.engagement) {
        return;
    }

    // Return early if we are not in the browser
    if(typeof window !== 'object') {
        return;
    }

    // Get the device ID from local storage
    const deviceIdLocalStorageKey = ProjectSettings.identifier + 'DeviceId';
    let deviceId = localStorage.getItem(deviceIdLocalStorageKey) || '';

    // If there is no device ID
    if(!deviceId) {
        // Create a new device ID
        deviceId = uniqueIdentifier();

        // Save the device ID to local storage
        localStorage.setItem(deviceIdLocalStorageKey, deviceId);
    }

    // Determine the device orientation
    const windowScreenOrientationType = window.screen?.orientation?.type?.toLowerCase();
    let orientation: DeviceOrientation | undefined = undefined;
    if(windowScreenOrientationType) {
        if(windowScreenOrientationType.includes('portrait')) {
            orientation = DeviceOrientation.Portrait;
        }
        else if(windowScreenOrientationType.includes('landscape')) {
            orientation = DeviceOrientation.Landscape;
        }
    }

    // Get the view identifier
    const viewIdentifier = window.location.pathname + window.location.search;

    // Get the view title
    const viewTitle = document.title;

    // Get session duration
    const sessionDurationInMilliseconds = sessionManager.getSessionDurationInMilliseconds();
    // console.log('📊 Session duration for GraphQL:', sessionDuration);

    // Get third-party attribution data
    const thirdPartyAttributionData = getThirdPartyAttributionForEvents();

    // Merge third-party attribution data with event-specific data
    const mergedAdditionalData = {
        ...thirdPartyAttributionData,
        ...(eventSpecificData || {}),
    };

    // Create the event object
    const eventData: EngagementEventData = {
        name: eventName,
        category: eventCategory,
        deviceProperties: {
            orientation: orientation,
        },
        clientProperties: {
            environment:
                window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1'
                    ? 'Development'
                    : 'Production',
        },
        eventContext: {
            viewIdentifier: viewIdentifier,
            viewTitle: viewTitle || null,
            referrer: document.referrer || undefined,
            sessionDurationInMilliseconds: sessionDurationInMilliseconds || undefined,
            additionalData: Object.keys(mergedAdditionalData).length > 0 ? mergedAdditionalData : undefined,
            loggedAt: new Date().toISOString(),
        },
    };

    // Add the event to the queue
    eventQueue.push(eventData);

    // Schedule batch processing
    if(!batchTimeout) {
        // Determine the delay
        let delay = 100; // Default 100ms delay for subsequent batches

        // If this is the first event, use a 1.5-second delay
        if(isFirstEvent) {
            delay = 1500;
            isFirstEvent = false;
            // console.log('📊 Page loaded... waiting 1.5 seconds before sending engagement events');
        }

        // Schedule the batch processing
        batchTimeout = setTimeout(processBatchQueue, delay);
    }
}
