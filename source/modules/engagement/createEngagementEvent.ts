'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Session Management
import { sessionManager } from '@structure/source/modules/engagement/SessionManager';

// Dependencies - API
import { networkService } from '@structure/source/services/network/NetworkService';
import { EngagementEventCreateDocument, DeviceOrientation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { getThirdPartyAttributionForEvents } from '@structure/source/modules/engagement/utilities/EngagementUtilities';

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

    // Perform the mutation
    networkService.graphQlRequest(EngagementEventCreateDocument, {
        input: {
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
        },
    });
}
