'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Session Management
import { sessionManager } from '@structure/source/modules/engagement/SessionManager';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { DeviceOrientation, CreateEngagementEventInput } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { getThirdPartyAttributionForEvents } from '@structure/source/modules/engagement/services/utilities/EngagementServiceUtilities';

// Class - EngagementService
class EngagementService {
    private eventQueue: CreateEngagementEventInput[] = [];
    private batchTimeout: NodeJS.Timeout | null = null;
    private readonly batchWindowSizeInMilliseconds = 250; // 250ms batching window
    private readonly maximumBatchSize = 50;
    private isProcessing = false;

    constructor() {
        // Register page unload handler
        if(typeof window !== 'undefined') {
            // Use both events for better coverage
            // Bind the flush method to maintain correct context
            this.flush = this.flush.bind(this);
            window.addEventListener('beforeunload', this.flush);
            window.addEventListener('pagehide', this.flush);
        }
    }

    // Main public method to track events
    collect(eventName: string, eventCategory?: string, eventSpecificData?: Record<string, unknown>): void {
        // Return early if the engagement module is not enabled
        if(!ProjectSettings.modules.engagement) {
            return;
        }

        // Return early if we are not in the browser
        if(typeof window !== 'object') {
            return;
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

        // Get third-party attribution data
        const thirdPartyAttributionData = getThirdPartyAttributionForEvents();

        // Merge third-party attribution data with event-specific data
        const mergedAdditionalData = {
            ...thirdPartyAttributionData,
            ...(eventSpecificData || {}),
        };

        // Create the event object
        const eventData: CreateEngagementEventInput = {
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
                visitId: sessionManager.getVisitId(),
                visitStartAt: sessionManager.getVisitStartAt(),
                additionalData: Object.keys(mergedAdditionalData).length > 0 ? mergedAdditionalData : undefined,
                loggedAt: new Date().toISOString(),
            },
        };

        // Add the event to the queue
        this.eventQueue.push(eventData);

        // Check if we should send immediately due to batch size
        if(this.eventQueue.length >= this.maximumBatchSize) {
            this.processBatch();
            return;
        }

        // Schedule batch processing if not already scheduled
        if(!this.batchTimeout) {
            this.batchTimeout = setTimeout(() => {
                this.processBatch();
            }, this.batchWindowSizeInMilliseconds);
        }
    }

    // Process and send the event queue
    private async processBatch(): Promise<void> {
        // Clear the timeout
        if(this.batchTimeout !== null) {
            clearTimeout(this.batchTimeout);
        }
        this.batchTimeout = null;

        // If already processing or queue is empty, do nothing
        if(this.isProcessing || this.eventQueue.length === 0) {
            return;
        }

        // Mark as processing
        this.isProcessing = true;

        // Copy the current queue and clear it
        const eventsToSend = [...this.eventQueue];
        this.eventQueue = [];

        try {
            // Send the batch of events
            await networkService.graphQlRequest(
                gql(`
                    mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {
                        engagementEventsCreate(inputs: $inputs) {
                            success
                        }
                    }
                `),
                {
                    inputs: eventsToSend,
                },
            );
        }
        catch(error) {
            // Log error but don't throw - we don't want to break the user experience
            console.warn('Failed to send engagement events:', error);

            // Optionally, we could try to re-queue the events, but for now we'll just drop them
            // to avoid memory issues and infinite retry loops
        } finally {
            this.isProcessing = false;
        }
    }

    // Flush any remaining events (called on page unload)
    flush(): void {
        // Immediately process any queued events
        if(this.eventQueue.length > 0) {
            // Cancel any pending timeout
            if(this.batchTimeout !== null) {
                clearTimeout(this.batchTimeout);
            }
            this.batchTimeout = null;

            // Process synchronously for page unload
            // Note: This might not complete on page unload, but we try our best
            this.processBatch();
        }
    }
}

// Export singleton instance
export const engagementService = new EngagementService();
