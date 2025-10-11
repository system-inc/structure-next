'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { AnimatedButton, AnimatedButtonProperties } from '@structure/source/common/buttons/AnimatedButton';

// Dependencies - Assets
import { ArrowClockwiseIcon } from '@phosphor-icons/react';

// Component - RefreshButton
export type RefreshButtonProperties = AnimatedButtonProperties;
export function RefreshButton(properties: RefreshButtonProperties) {
    // Render the component
    return (
        <AnimatedButton
            size="icon"
            tip="Refresh"
            processingIcon={ArrowClockwiseIcon}
            showProcessedTimeTip={true}
            {...properties}
        />
    );
}
