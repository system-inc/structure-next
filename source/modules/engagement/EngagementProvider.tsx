'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Dependencies - Main Components
import { EngagementContainer } from '@structure/source/modules/engagement/EngagementContainer';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { EngagementEventCreateDocument, DeviceOrientation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Context - Engagement
interface EngagementContextInterface {
    path: string;
}
const EngagementContext = React.createContext<EngagementContextInterface>({
    path: '',
});

// Track if the provider is mounted in order to avoid sending two events in development mode
let engagementProviderMounted = false;

// Component - EngagementProvider
export interface EngagementProviderInterface {
    children: React.ReactNode;
}
export function EngagementProvider(properties: EngagementProviderInterface) {
    // Hooks
    const urlPath = usePathname() ?? '';
    const urlSearchParameters = useSearchParams();
    const [engagementEventCreateMutation] = useMutation(EngagementEventCreateDocument);

    // References
    const engagementEventsSentReference = React.useRef(0);
    const previousViewIdentifierReference = React.useRef('');
    const previousViewTitleReference = React.useRef('');
    const loadDurationInMillisecondsReference = React.useRef(0);
    const sessionStartTimeReference = React.useRef(Date.now());
    const currentViewStartTimeReference = React.useRef(Date.now());

    // Trigger whenever the URL changes
    React.useEffect(
        function () {
            // Return early if the engagement module is not enabled
            if(ProjectSettings.modules.engagement === false) {
                return;
            }

            // Return early if we are not in the browser
            if(typeof window !== 'object') {
                return;
            }

            // In development mode, NextJS runs effects twice on the first render, so we need to avoid sending two events
            if(window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1') {
                if(!engagementProviderMounted) {
                    engagementProviderMounted = true;
                    return;
                }
            }

            // console.log('Current page:', urlPath);

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

            // Get the view title
            const viewTitle = document.title;

            // Get the view load time in milliseconds
            if(performance && performance.getEntriesByType && engagementEventsSentReference.current === 0) {
                const performanceEntries = performance.getEntriesByType('navigation');
                if(performanceEntries.length > 0) {
                    const navigationEntry = performanceEntries[0];
                    if(navigationEntry) {
                        loadDurationInMillisecondsReference.current = Math.round(navigationEntry.duration);
                    }
                }
            }
            // TODO: Get the load time of the Next.js route
            // https://github.com/vercel/next.js/discussions/64784
            else {
                // Use 0 for now
                loadDurationInMillisecondsReference.current = 0;
            }
            // console.log('Load duration: ' + loadDurationInMillisecondsReference.current + ' milliseconds.');

            // The view identifier is the URL path
            let viewIdentifier = urlPath;

            // If present, add the search parameters to the view identifier
            const urlSearchParametersString = urlSearchParameters?.toString();
            if(urlSearchParametersString) {
                viewIdentifier += '?' + urlSearchParametersString;
            }

            // Get the session duration in milliseconds
            let sessionDurationInMilliseconds = Date.now() - sessionStartTimeReference.current;

            // If the session duration is greater than 30 minutes, reset the session start time
            if(sessionDurationInMilliseconds > 30 * 60 * 1000) {
                sessionStartTimeReference.current = Date.now();
                sessionDurationInMilliseconds = 0;
            }
            else if(engagementEventsSentReference.current === 0) {
                sessionDurationInMilliseconds = 0;
            }
            // console.log('sessionDurationInMilliseconds', sessionDurationInMilliseconds);

            // Get the time on the previous view
            let previousViewDurationInMilliseconds = Date.now() - currentViewStartTimeReference.current;
            if(engagementEventsSentReference.current === 0) {
                previousViewDurationInMilliseconds = 0;
            }
            // console.log('previousViewDurationInMilliseconds', previousViewDurationInMilliseconds);

            // Determine the device orientation
            const windowScreenOrientationType = window.screen?.orientation?.type?.toLowerCase();
            let orientation = undefined;
            if(windowScreenOrientationType) {
                if(windowScreenOrientationType.includes('portrait')) {
                    orientation = DeviceOrientation.Portrait;
                }
                else if(windowScreenOrientationType.includes('landscape')) {
                    orientation = DeviceOrientation.Landscape;
                }
            }

            // Perform the mutation
            engagementEventCreateMutation({
                variables: {
                    input: {
                        name: 'PageView',
                        deviceProperties: {
                            orientation: orientation,
                        },
                        clientProperties: {
                            // Development or Production
                            environment:
                                window.location.hostname.includes('localhost') ||
                                window.location.hostname === '127.0.0.1'
                                    ? 'Development'
                                    : 'Production',
                        },
                        eventContext: {
                            loadDurationInMilliseconds: loadDurationInMillisecondsReference.current || undefined,
                            sessionDurationInMilliseconds: sessionDurationInMilliseconds || undefined,
                            previousViewDurationInMilliseconds: previousViewDurationInMilliseconds || undefined,
                            viewTitle: viewTitle || undefined,
                            viewIdentifier: viewIdentifier,
                            previousViewTitle: previousViewTitleReference.current || undefined,
                            previousViewIdentifier: previousViewIdentifierReference.current || undefined,
                            referrer: document.referrer || undefined,
                        },
                    },
                },
            });

            // Increment the number of engagement events sent
            engagementEventsSentReference.current++;

            // Update references for the next event
            previousViewIdentifierReference.current = urlPath;
            previousViewTitleReference.current = viewTitle;
            currentViewStartTimeReference.current = Date.now();

            // Function which runs when component unmounts or before rerunning the effect
            return function () {
                // console.log('Cleaning up after route change...');
            };
        },
        [urlPath, urlSearchParameters, engagementEventCreateMutation],
    );

    // Render the component
    return (
        <EngagementContext.Provider value={{ path: urlPath }}>
            {properties.children}
            <EngagementContainer path={urlPath} />
        </EngagementContext.Provider>
    );
}

// Hook - useEngagement
export function useEngagement() {
    return React.useContext(EngagementContext);
}

// Export - Default
export default EngagementProvider;
