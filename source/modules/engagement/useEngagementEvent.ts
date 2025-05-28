'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { createEngagementEvent } from '@structure/source/modules/engagement/createEngagementEvent';

// Hook - useEngagementEvent
export function useEngagementEvent() {
    const sendEngagementEvent = React.useCallback(function (
        eventName: string,
        eventCategory?: string,
        eventSpecificData?: Record<string, unknown>,
    ) {
        createEngagementEvent(eventName, eventCategory, eventSpecificData);
    }, []);

    return { sendEngagementEvent };
}
