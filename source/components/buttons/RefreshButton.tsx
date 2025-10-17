'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { AnimatedButton, AnimatedButtonProperties } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Assets
import { ArrowClockwiseIcon } from '@phosphor-icons/react';

// Component - RefreshButton
export type RefreshButtonProperties = Omit<
    AnimatedButtonProperties,
    | 'icon'
    | 'iconLeft'
    | 'iconRight'
    | 'children'
    | 'processingIcon'
    | 'showResultIconAnimation'
    | 'showProcessedTimeTip'
>;
export function RefreshButton({ tip, ...animatedButtonProperties }: RefreshButtonProperties) {
    // Render the component
    return (
        <AnimatedButton
            icon={ArrowClockwiseIcon}
            processingIcon={ArrowClockwiseIcon}
            showResultIconAnimation={true}
            showProcessedTimeTip={true}
            tip={tip || 'Refresh'}
            {...animatedButtonProperties}
        />
    );
}
