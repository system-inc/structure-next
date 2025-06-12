'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { Button, ButtonProperties } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';
import ReloadIcon from '@structure/assets/icons/interface/ReloadIcon.svg';

// Component - RefreshButton
export type RefreshButtonProperties = ButtonProperties;
export function RefreshButton(properties: RefreshButtonProperties) {
    // Render the component
    return (
        <Button
            size="icon"
            tip="Refresh"
            processingIcon={ReloadIcon}
            processingSuccessIcon={CheckCircledIcon}
            showProcessedTimeTip={true}
            {...properties}
        />
    );
}
