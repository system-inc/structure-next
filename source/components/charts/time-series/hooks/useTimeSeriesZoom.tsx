'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeRangeType } from '@structure/source/components/time/TimeRange';

// Type - TimeSeriesZoomState
export interface TimeSeriesZoomState {
    isZoomed: boolean;
    originalRange: TimeRangeType | null;
    zoomedRange: TimeRangeType | null;
}

// Type - TimeSeriesZoomActions
export interface TimeSeriesZoomActions {
    handleZoom: (startLabel: string, endLabel: string) => void;
    resetZoom: () => void;
}

// Type - UseTimeSeriesZoomResult
export interface UseTimeSeriesZoomResult extends TimeSeriesZoomState, TimeSeriesZoomActions {}

// Hook - useTimeSeriesZoom
export function useTimeSeriesZoom(
    currentRange: TimeRangeType,
    onRangeChange: (range: TimeRangeType) => void,
): UseTimeSeriesZoomResult {
    // State
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [originalRange, setOriginalRange] = React.useState<TimeRangeType | null>(null);
    const [zoomedRange, setZoomedRange] = React.useState<TimeRangeType | null>(null);

    // Handle zoom action
    const handleZoom = React.useCallback(
        function (startLabel: string, endLabel: string) {
            // Parse the labels to dates
            const startDate = new Date(startLabel);
            const endDate = new Date(endLabel);

            // Ensure start is before end
            const actualStart = startDate < endDate ? startDate : endDate;
            const actualEnd = startDate < endDate ? endDate : startDate;

            // Store original range if not already zoomed
            if(!isZoomed) {
                setOriginalRange(currentRange);
            }

            // Create new zoomed range
            const newRange: TimeRangeType = {
                startTime: actualStart,
                endTime: actualEnd,
            };

            // Update states
            setZoomedRange(newRange);
            setIsZoomed(true);

            // Apply the zoom
            onRangeChange(newRange);
        },
        [currentRange, isZoomed, onRangeChange],
    );

    // Reset zoom action
    const resetZoom = React.useCallback(
        function () {
            if(isZoomed && originalRange) {
                onRangeChange(originalRange);
                setIsZoomed(false);
                setOriginalRange(null);
                setZoomedRange(null);
            }
        },
        [isZoomed, originalRange, onRangeChange],
    );

    // Return state and actions
    return {
        isZoomed,
        originalRange,
        zoomedRange,
        handleZoom,
        resetZoom,
    };
}
