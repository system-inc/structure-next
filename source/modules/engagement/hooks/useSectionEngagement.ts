'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { engagementService } from '@structure/source/modules/engagement/services/engagement/EngagementService';

// Hook - useSectionEngagement
// Tracks when a section enters the viewport, firing a SectionView event.
// Future: will also track SectionLeave and sectionDurationInMilliseconds.
export function useSectionEngagement(
    sectionIdentifier: string,
    sectionTitle?: string,
): React.RefObject<HTMLElement | null> {
    const sectionReference = React.useRef<HTMLElement | null>(null);
    const hasFiredReference = React.useRef(false);

    React.useEffect(
        function () {
            const element = sectionReference.current;
            if(!element) return;

            // Check for IntersectionObserver support
            if(typeof IntersectionObserver === 'undefined') return;

            const observer = new IntersectionObserver(
                function (entries) {
                    const entry = entries[0];
                    if(entry?.isIntersecting && !hasFiredReference.current) {
                        hasFiredReference.current = true;
                        engagementService.collectEvent('SectionView', 'Navigation', {
                            sectionIdentifier,
                            sectionTitle,
                        });
                    }
                },
                { threshold: 0.5 }, // Fire when 50% of the section is visible
            );

            observer.observe(element);

            return function () {
                observer.disconnect();
            };
        },
        [sectionIdentifier, sectionTitle],
    );

    return sectionReference;
}
