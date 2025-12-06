'use client'; // This hook uses client-only features

// Dependencies - Utilities
import { engagementService } from '@structure/source/modules/engagement/services/engagement/EngagementService';

// Interface - UseEngagementResult
interface UseEngagementResult {
    collectEvent: (eventName: string, category?: string, eventData?: Record<string, unknown>) => void;
}

// Hook - useEngagement
export function useEngagement(): UseEngagementResult {
    // Function to collect an engagement event
    function collectEvent(eventName: string, category?: string, eventData?: Record<string, unknown>): void {
        engagementService.collectEvent(eventName, category, eventData);
    }

    return { collectEvent };
}
