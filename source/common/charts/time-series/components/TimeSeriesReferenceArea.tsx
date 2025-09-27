// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ReferenceArea } from 'recharts';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Component - TimeSeriesReferenceArea
export interface TimeSeriesReferenceAreaProperties {
    referenceAreaStart: string | null;
    referenceAreaEnd: string | null;
    onReferenceAreaSelect?: (startLabel: string, endLabel: string) => void;
}
export function TimeSeriesReferenceArea(properties: TimeSeriesReferenceAreaProperties) {
    // Hooks
    const themeSettings = useThemeSettings();
    const isDarkMode = themeSettings.themeClassName === 'dark';

    // Only render if we have both start and end points and the callback
    if(!properties.referenceAreaStart || !properties.referenceAreaEnd || !properties.onReferenceAreaSelect) {
        return null;
    }

    // Render the component
    return (
        <ReferenceArea
            x1={properties.referenceAreaStart}
            x2={properties.referenceAreaEnd}
            strokeOpacity={0.3}
            fill={isDarkMode ? '#ffffff' : '#000000'}
            fillOpacity={0.1}
        />
    );
}
