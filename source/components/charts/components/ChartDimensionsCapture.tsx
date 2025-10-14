'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useChartWidth, useChartHeight, useOffset } from 'recharts';

// Type - ChartContentDimensions
export interface ChartContentDimensions {
    width: number;
    height: number;
}

// Component - ChartDimensionsCapture
// This component uses Recharts hooks to capture the exact chart content area dimensions
export interface ChartDimensionsCaptureProperties {
    onDimensionsChange: (dimensions: ChartContentDimensions) => void;
}
export function ChartDimensionsCapture(properties: ChartDimensionsCaptureProperties) {
    const chartWidth = useChartWidth();
    const chartHeight = useChartHeight();
    const offset = useOffset();

    // Extract callback to avoid dependency on entire properties object
    const onDimensionsChange = properties.onDimensionsChange;

    // Calculate the exact content dimensions (chart dimensions minus offsets)
    React.useEffect(
        function () {
            if(chartWidth && chartHeight && offset) {
                const contentDimensions: ChartContentDimensions = {
                    width: chartWidth - offset.left - offset.right,
                    height: chartHeight - offset.top - offset.bottom,
                };
                onDimensionsChange(contentDimensions);
            }
        },
        [chartWidth, chartHeight, offset, onDimensionsChange],
    );

    // This component doesn't render anything
    return null;
}
