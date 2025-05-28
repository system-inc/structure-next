'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Context
import { useEngagement } from '@structure/source/modules/engagement/EngagementProvider';

// Dependencies - Utilities
import { createEngagementEvent } from '@structure/source/modules/engagement/createEngagementEvent';

// Hook - useEngagementEvent
export function useEngagementEvent() {
    const { getSessionDurationInMilliseconds } = useEngagement();

    const sendEngagementEvent = React.useCallback(
        function (eventName: string, eventCategory?: string, eventSpecificData?: Record<string, unknown>) {
            createEngagementEvent(getSessionDurationInMilliseconds, eventName, eventCategory, eventSpecificData);
        },
        [getSessionDurationInMilliseconds],
    );

    return { sendEngagementEvent };
}
