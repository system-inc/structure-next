'use client'; // This hook uses client-only features

// Dependencies - Utilities
import { engagementService } from '@structure/source/modules/engagement/services/engagement/EngagementService';

// Dependencies - Types
import {
    EngagementEventMap,
    EngagementEventName,
    engagementEventRegistry,
} from '@structure/source/modules/engagement/types/EngagementEventDefinitions';

// Interface - UseEngagementResult
interface UseEngagementResult {
    collectEvent: <T extends EngagementEventName>(eventName: T, eventData: EngagementEventMap[T]) => void;
}

// Hook - useEngagement
export function useEngagement(): UseEngagementResult {
    // Function to collect an engagement event with type-safe data
    function collectEvent<T extends EngagementEventName>(eventName: T, eventData: EngagementEventMap[T]): void {
        // Look up category from the registry
        const category = engagementEventRegistry[eventName].category;
        // Cast to Record<string, unknown> since EngagementService expects a generic object
        // but we've already validated the type at the call site
        engagementService.collectEvent(eventName, category, eventData as Record<string, unknown>);
    }

    return { collectEvent };
}
