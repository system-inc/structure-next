'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { Button, ButtonProperties } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import { CheckCircleIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';

// Component - RefreshButton
export type RefreshButtonProperties = ButtonProperties;
export function RefreshButton(properties: RefreshButtonProperties) {
    // Render the component
    return (
        <Button
            size="icon"
            tip="Refresh"
            processingIcon={ArrowClockwiseIcon}
            processingSuccessIcon={CheckCircleIcon}
            showProcessedTimeTip={true}
            {...properties}
        />
    );
}
