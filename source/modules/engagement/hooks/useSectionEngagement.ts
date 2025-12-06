'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { engagementService } from '@structure/source/modules/engagement/services/engagement/EngagementService';

// Hook - useSectionEngagement
// Tracks when a section enters the viewport, firing a SectionView event.
// Includes a delay before starting observation to avoid racing with PageView events.
// Future: will also track SectionLeave and sectionDurationInMilliseconds.
export function useSectionEngagement<T extends HTMLElement = HTMLElement>(
    sectionIdentifier: string,
    sectionTitle?: string,
): React.RefObject<T | null> {
    const sectionReference = React.useRef<T | null>(null);
    const hasFiredReference = React.useRef(false);

    React.useEffect(
        function () {
            const element = sectionReference.current;
            if(!element) return;

            // Check for IntersectionObserver support
            if(typeof IntersectionObserver === 'undefined') return;

            // Reference for storing observer for cleanup
            let observer: IntersectionObserver | null = null;

            // Delay before starting observation to ensure PageView fires first
            const delayTimeout = setTimeout(function () {
                observer = new IntersectionObserver(
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
            }, 500); // 500ms delay to ensure PageView fires first

            return function () {
                clearTimeout(delayTimeout);
                observer?.disconnect();
            };
        },
        [sectionIdentifier, sectionTitle],
    );

    return sectionReference;
}
