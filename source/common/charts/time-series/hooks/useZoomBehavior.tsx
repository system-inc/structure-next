'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';

// Dependencies - Utilities
import {
    startOfHour,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfMinute,
    endOfHour,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfYear,
    addMinutes,
    addHours,
    addDays,
    addWeeks,
    addMonths,
} from 'date-fns';
import { convertIntervalValueToDate } from '@structure/source/utilities/chart/ChartData';

// Type - UseZoomBehaviorOptions
export interface UseZoomBehaviorOptions {
    currentTimeRange: TimeRangeType;
    currentTimeInterval: TimeInterval;
    onTimeRangeChange: (range: TimeRangeType) => void;
    onTimeIntervalChange: (interval: TimeInterval) => void;
}

// Type - UseZoomBehaviorResult
export interface UseZoomBehaviorResult {
    handleSelection: (startLabel: string, endLabel: string) => void;
    isZoomed: boolean;
    originalRange: TimeRangeType | null;
    resetZoom: () => void;
}

// Hook - useZoomBehavior
// This hook provides intelligent zoom behavior for time-series charts
// It handles range selection and automatically zooms to finer intervals when appropriate
export function useZoomBehavior(options: UseZoomBehaviorOptions): UseZoomBehaviorResult {
    // State for zoom tracking
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [originalRange, setOriginalRange] = React.useState<TimeRangeType | null>(null);

    // Handle range selection and zoom
    const handleSelection = React.useCallback(
        function (startLabel: string, endLabel: string) {
            const startDate = convertIntervalValueToDate(startLabel, options.currentTimeInterval);
            const endDate = convertIntervalValueToDate(endLabel, options.currentTimeInterval);

            // Determine start and end dates
            let startIntervalTime: Date, endIntervalTime: Date;
            if(startDate.getTime() > endDate.getTime()) {
                startIntervalTime = endDate;
                endIntervalTime = startDate;
            }
            else {
                startIntervalTime = startDate;
                endIntervalTime = endDate;
            }

            // Update the end interval date to be the end of the interval period
            if(options.currentTimeInterval === TimeInterval.Year) {
                endIntervalTime = endOfYear(endIntervalTime);
            }
            else if(options.currentTimeInterval === TimeInterval.Quarter) {
                // For quarters, set to the end of the last month of the quarter
                const quarter = Math.ceil((endIntervalTime.getMonth() + 1) / 3);
                const lastMonthOfQuarter = quarter * 3 - 1;
                endIntervalTime = endOfMonth(new Date(endIntervalTime.getFullYear(), lastMonthOfQuarter, 1));
            }
            else if(options.currentTimeInterval === TimeInterval.Month) {
                endIntervalTime = endOfMonth(endIntervalTime);
            }
            else if(options.currentTimeInterval === TimeInterval.Week) {
                endIntervalTime = endOfWeek(endIntervalTime);
            }
            else if(options.currentTimeInterval === TimeInterval.Day) {
                endIntervalTime = endOfDay(endIntervalTime);
            }
            else if(options.currentTimeInterval === TimeInterval.Hour) {
                endIntervalTime = endOfHour(endIntervalTime);
            }
            else if(options.currentTimeInterval === TimeInterval.Minute) {
                endIntervalTime = endOfMinute(endIntervalTime);
            }

            // Check if the intervals are adjacent or the same
            let intervalsAreAdjacentOrSame = false;
            if(options.currentTimeInterval === TimeInterval.Year) {
                intervalsAreAdjacentOrSame = startIntervalTime.getFullYear() === endIntervalTime.getFullYear();
            }
            else if(options.currentTimeInterval === TimeInterval.Quarter) {
                // For quarters, check if they are the same or 3 months apart
                const monthDiff = Math.abs(endIntervalTime.getMonth() - startIntervalTime.getMonth());
                intervalsAreAdjacentOrSame = monthDiff === 0 || monthDiff === 3;
            }
            else if(options.currentTimeInterval === TimeInterval.Month) {
                intervalsAreAdjacentOrSame = addMonths(startIntervalTime, 1).getMonth() === endIntervalTime.getMonth();
            }
            else if(options.currentTimeInterval === TimeInterval.Week) {
                intervalsAreAdjacentOrSame =
                    addWeeks(startIntervalTime, 1).toISOString() === endIntervalTime.toISOString();
            }
            else if(options.currentTimeInterval === TimeInterval.Day) {
                intervalsAreAdjacentOrSame =
                    addDays(startIntervalTime, 1).toDateString() === endIntervalTime.toDateString();
            }
            else if(options.currentTimeInterval === TimeInterval.Hour) {
                intervalsAreAdjacentOrSame =
                    addHours(startIntervalTime, 1).toISOString() === endIntervalTime.toISOString();
            }
            else if(options.currentTimeInterval === TimeInterval.Minute) {
                intervalsAreAdjacentOrSame =
                    addMinutes(startIntervalTime, 1).toISOString() === endIntervalTime.toISOString();
            }

            // If the user has selected one or two adjacent interval values, zoom to finer interval
            let newTimeInterval = options.currentTimeInterval;
            if(startLabel === endLabel || intervalsAreAdjacentOrSame) {
                // Zoom in on the interval
                if(options.currentTimeInterval === TimeInterval.Year) {
                    newTimeInterval = TimeInterval.Month;
                    startIntervalTime = startOfYear(startIntervalTime);
                    endIntervalTime = endOfYear(endIntervalTime);
                }
                else if(options.currentTimeInterval === TimeInterval.Quarter) {
                    newTimeInterval = TimeInterval.Month;
                    // For quarters, we need to find the start and end of the quarter
                    const quarter = Math.ceil((startIntervalTime.getMonth() + 1) / 3);
                    const quarterStartMonth = (quarter - 1) * 3;
                    startIntervalTime = new Date(startIntervalTime.getFullYear(), quarterStartMonth, 1);
                    endIntervalTime = new Date(
                        startIntervalTime.getFullYear(),
                        quarterStartMonth + 3,
                        0,
                        23,
                        59,
                        59,
                        999,
                    );
                }
                else if(options.currentTimeInterval === TimeInterval.Month) {
                    newTimeInterval = TimeInterval.Day;
                    startIntervalTime = startOfMonth(startIntervalTime);
                    endIntervalTime = endOfMonth(endIntervalTime);
                }
                else if(options.currentTimeInterval === TimeInterval.Week) {
                    newTimeInterval = TimeInterval.Day;
                    startIntervalTime = startOfWeek(startIntervalTime);
                    endIntervalTime = endOfWeek(endIntervalTime);
                }
                else if(options.currentTimeInterval === TimeInterval.Day) {
                    newTimeInterval = TimeInterval.Hour;
                    startIntervalTime = startOfDay(startIntervalTime);
                    endIntervalTime = endOfDay(endIntervalTime);
                }
                else if(options.currentTimeInterval === TimeInterval.Hour) {
                    newTimeInterval = TimeInterval.Minute;
                    startIntervalTime = startOfHour(startIntervalTime);
                    endIntervalTime = endOfHour(endIntervalTime);
                }
            }

            // Store original range if this is the first zoom
            if(!isZoomed) {
                setOriginalRange(options.currentTimeRange);
                setIsZoomed(true);
            }

            // Update the interval
            options.onTimeIntervalChange(newTimeInterval);

            // Don't allow clicking on minutes to zoom (minute is the finest level)
            if(options.currentTimeInterval === TimeInterval.Minute && startLabel === endLabel) {
                // Do nothing - we're at the zoom limit
            }
            else {
                // Update the date range
                options.onTimeRangeChange({
                    startTime: startIntervalTime,
                    endTime: endIntervalTime,
                });
            }
        },
        [options, isZoomed],
    );

    // Reset zoom function
    const resetZoom = React.useCallback(
        function () {
            if(isZoomed && originalRange) {
                options.onTimeRangeChange(originalRange);
                setIsZoomed(false);
                setOriginalRange(null);
            }
        },
        [isZoomed, originalRange, options],
    );

    return {
        handleSelection,
        isZoomed,
        originalRange,
        resetZoom,
    };
}
