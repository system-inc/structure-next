'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Dependencies - Main Components
import { EngagementContainer } from '@structure/source/modules/engagement/EngagementContainer';

// Dependencies - Utilities
import { createEngagementEvent } from '@structure/source/modules/engagement/createEngagementEvent';
import { sessionManager } from '@structure/source/modules/engagement/SessionManager';
import { initializeMetaAttribution } from '@structure/source/modules/engagement/utilities/EngagementUtilities';

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

    // References
    const engagementEventsSentReference = React.useRef(0);
    const previousViewIdentifierReference = React.useRef('');
    const previousViewTitleReference = React.useRef('');
    const loadDurationInMillisecondsReference = React.useRef(0);
    const currentViewStartTimeReference = React.useRef(Date.now());

    // Initialize session start time once
    React.useEffect(function () {
        // Initialize the global session manager
        sessionManager.initializeSession();
        // console.log('🚀 Session initialized');
    }, []);

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

            // Initialize Meta attribution tracking
            initializeMetaAttribution(urlSearchParameters);

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

            // Get the time on the previous view
            let previousViewDurationInMilliseconds = Date.now() - currentViewStartTimeReference.current;
            if(engagementEventsSentReference.current === 0) {
                previousViewDurationInMilliseconds = 0;
            }
            // console.log('previousViewDurationInMilliseconds', previousViewDurationInMilliseconds);

            // Send the PageView engagement event with timing data
            createEngagementEvent('PageView', 'Navigation', {
                loadDurationInMilliseconds: loadDurationInMillisecondsReference.current || undefined,
                previousViewDurationInMilliseconds: previousViewDurationInMilliseconds || undefined,
                previousViewTitle: previousViewTitleReference.current || undefined,
                previousViewIdentifier: previousViewIdentifierReference.current || undefined,
            });

            // Increment the number of engagement events sent
            engagementEventsSentReference.current++;

            // Update references for the next event
            previousViewIdentifierReference.current = urlPath;
            previousViewTitleReference.current = document.title;
            currentViewStartTimeReference.current = Date.now();

            // Function which runs when component unmounts or before rerunning the effect
            return function () {
                // console.log('Cleaning up after route change...');
            };
        },
        [urlPath, urlSearchParameters],
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
