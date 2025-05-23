'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { EngagementEventCreateDocument, DeviceOrientation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Dependencies - Context
import { useEngagement } from '@structure/source/modules/engagement/EngagementProvider';

// Hook - useEngagementEvent
export function useEngagementEvent() {
    const { getSessionDurationInMilliseconds } = useEngagement();
    const [engagementEventCreateMutation] = useMutation(EngagementEventCreateDocument);

    const sendEngagementEvent = React.useCallback(
        function (eventName: string, eventCategory?: string, eventSpecificData?: Record<string, unknown>) {
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

            // Perform the mutation
            void engagementEventCreateMutation({
                variables: {
                    input: {
                        name: eventName,
                        category: eventCategory,
                        deviceProperties: {
                            orientation: orientation,
                        },
                        clientProperties: {
                            environment:
                                window.location.hostname.includes('localhost') ||
                                window.location.hostname === '127.0.0.1'
                                    ? 'Development'
                                    : 'Production',
                        },
                        eventContext: {
                            viewIdentifier: viewIdentifier,
                            viewTitle: viewTitle,
                            referrer: document.referrer || undefined,
                            sessionDurationInMilliseconds: getSessionDurationInMilliseconds() || undefined,
                            data: eventSpecificData || undefined,
                            loggedAt: new Date().toISOString(),
                        },
                    },
                },
            });
        },
        [engagementEventCreateMutation, getSessionDurationInMilliseconds],
    );

    return { sendEngagementEvent };
}
