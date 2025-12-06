'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useSectionEngagement } from '@structure/source/modules/engagement/hooks/useSectionEngagement';

// Component - EngagementSection
export interface EngagementSectionProperties {
    sectionIdentifier: string;
    sectionTitle: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export function EngagementSection(properties: EngagementSectionProperties) {
    // Hooks
    const sectionEngagementReference = useSectionEngagement(
        properties.sectionIdentifier,
        properties.sectionTitle,
    );

    // Render the component
    return (
        <section ref={sectionEngagementReference} className={properties.className} style={properties.style}>
            {properties.children}
        </section>
    );
}
