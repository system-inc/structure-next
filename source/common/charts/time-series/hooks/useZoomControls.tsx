'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeInterval } from '../TimeInterval';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';

// Dependencies - Utilities
import {
    addYears,
    subYears,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    addHours,
    subHours,
    addMinutes,
    subMinutes,
    startOfYear,
    endOfYear,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay,
    startOfHour,
    endOfHour,
    startOfMinute,
    endOfMinute,
    differenceInYears,
    differenceInMonths,
    differenceInWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
} from 'date-fns';

// Type - UseZoomControlsOptions
export interface UseZoomControlsOptions {
    currentTimeRange: TimeRangeType;
    currentTimeInterval: TimeInterval;
    onTimeRangeChange: (range: TimeRangeType) => void;
    onTimeIntervalChange: (interval: TimeInterval) => void;
}

// Type - UseZoomControlsResult
export interface UseZoomControlsResult {
    zoomIn: () => void;
    zoomOut: () => void;
}

// Hook - useZoomControls
// Provides button-driven zoom in/out functionality for time-series charts
// Automatically adjusts both the time range and interval for intelligent zooming
export function useZoomControls(options: UseZoomControlsOptions): UseZoomControlsResult {
    // Zoom in handler
    const zoomIn = React.useCallback(
        function () {
            const fromDate = new Date(options.currentTimeRange.startTime || new Date());
            const toDate = new Date(options.currentTimeRange.endTime || new Date());

            const result = determineNewTimeRangeAndInterval(
                options.currentTimeInterval,
                fromDate,
                toDate,
                true, // zoomIn = true
            );

            if(result.newTimeInterval !== options.currentTimeInterval) {
                options.onTimeIntervalChange(result.newTimeInterval);
            }
            options.onTimeRangeChange({
                startTime: result.newStartTime,
                endTime: result.newEndTime,
            });
        },
        [options],
    );

    // Zoom out handler
    const zoomOut = React.useCallback(
        function () {
            const fromDate = new Date(options.currentTimeRange.startTime || new Date());
            const toDate = new Date(options.currentTimeRange.endTime || new Date());

            const result = determineNewTimeRangeAndInterval(
                options.currentTimeInterval,
                fromDate,
                toDate,
                false, // zoomIn = false
            );

            if(result.newTimeInterval !== options.currentTimeInterval) {
                options.onTimeIntervalChange(result.newTimeInterval);
            }
            options.onTimeRangeChange({
                startTime: result.newStartTime,
                endTime: result.newEndTime,
            });
        },
        [options],
    );

    return {
        zoomIn,
        zoomOut,
    };
}

// Utility function to determine new time range and interval based on zoom direction
function determineNewTimeRangeAndInterval(
    currentInterval: TimeInterval,
    startTime: Date,
    endTime: Date,
    zoomIn: boolean,
): {
    newTimeInterval: TimeInterval;
    newStartTime: Date;
    newEndTime: Date;
} {
    let newTimeInterval = currentInterval;
    let newStartTime: Date;
    let newEndTime: Date;

    if(zoomIn) {
        // Zoom In Logic - Contract the range, step to finer interval when appropriate
        switch(currentInterval) {
            case TimeInterval.Year:
                // If 3+ years are currently being shown
                if(differenceInMonths(endTime, startTime) > 24) {
                    // Contract a year to the left and right
                    newStartTime = startOfYear(addYears(startTime, 1));
                    newEndTime = endOfYear(subYears(endTime, 1));

                    // If we are left with 1 or 2 years
                    if(differenceInYears(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the month boundary
                        newTimeInterval = TimeInterval.Month;
                    }
                }
                // If less than 3 years are currently being shown
                else {
                    // Zoom in to the month boundary
                    newTimeInterval = TimeInterval.Month;
                    newStartTime = startOfYear(startTime);
                    newEndTime = endOfYear(endTime);
                }
                break;

            case TimeInterval.Quarter:
                // If 2+ quarters are currently being shown
                if(differenceInMonths(endTime, startTime) >= 6) {
                    // Contract a quarter to the left and right
                    newStartTime = startOfMonth(addMonths(startTime, 3));
                    newEndTime = endOfMonth(subMonths(endTime, 3));

                    // If we are left with 1 or 2 quarters
                    if(differenceInMonths(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the month boundary
                        newTimeInterval = TimeInterval.Month;
                    }
                }
                // If less than 2 quarters are currently being shown
                else {
                    // Zoom in to the month boundary
                    newTimeInterval = TimeInterval.Month;
                    newStartTime = startOfMonth(startTime);
                    newEndTime = endOfMonth(endTime);
                }
                break;

            case TimeInterval.Month:
                // If 2+ months are currently being shown
                if(differenceInMonths(endTime, startTime) >= 2) {
                    // Contract a month to the left and right
                    newStartTime = startOfMonth(addMonths(startTime, 1));
                    newEndTime = endOfMonth(subMonths(endTime, 1));

                    // If we are left with 1 or 2 months
                    if(differenceInMonths(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the day boundary
                        newTimeInterval = TimeInterval.Day;
                    }
                }
                // If less than 2 months are currently being shown
                else {
                    // Zoom in to the week boundary
                    newTimeInterval = TimeInterval.Week;
                    newStartTime = startOfMonth(startTime);
                    newEndTime = endOfMonth(endTime);
                }
                break;

            case TimeInterval.Week:
                // If 2+ weeks are currently being shown
                if(differenceInWeeks(endTime, startTime) >= 2) {
                    // Contract a week to the left and right
                    newStartTime = startOfWeek(addWeeks(startTime, 1));
                    newEndTime = endOfWeek(subWeeks(endTime, 1));

                    // If we are left with 1 or 2 weeks
                    if(differenceInWeeks(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the day boundary
                        newTimeInterval = TimeInterval.Day;
                    }
                }
                // If less than 2 weeks are currently being shown
                else {
                    // Zoom in to the day boundary
                    newTimeInterval = TimeInterval.Day;
                    newStartTime = startOfWeek(startTime);
                    newEndTime = endOfWeek(endTime);
                }
                break;

            case TimeInterval.Day:
                // If 2+ days are currently being shown
                if(differenceInDays(endTime, startTime) >= 2) {
                    // Contract a day to the left and right
                    newStartTime = startOfDay(addDays(startTime, 1));
                    newEndTime = endOfDay(subDays(endTime, 1));

                    // If we are left with 1 or 2 days
                    if(differenceInDays(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the hour boundary
                        newTimeInterval = TimeInterval.Hour;
                    }
                }
                // If less than 2 days are currently being shown
                else {
                    // Zoom in to the hour boundary
                    newTimeInterval = TimeInterval.Hour;
                    newStartTime = startOfDay(startTime);
                    newEndTime = endOfDay(endTime);
                }
                break;

            case TimeInterval.Hour:
                // If 2+ hours are currently being shown
                if(differenceInHours(endTime, startTime) >= 2) {
                    // Contract an hour to the left and right
                    newStartTime = startOfHour(addHours(startTime, 1));
                    newEndTime = endOfHour(subHours(endTime, 1));

                    // If we are left with 1 or 2 hours
                    if(differenceInHours(newEndTime, newStartTime) <= 2) {
                        // Zoom in to the minute boundary
                        newTimeInterval = TimeInterval.Minute;
                    }
                }
                // If less than 2 hours are currently being shown
                else {
                    // Zoom in to the minute boundary
                    newTimeInterval = TimeInterval.Minute;
                    newStartTime = startOfHour(startTime);
                    newEndTime = endOfHour(endTime);
                }
                break;

            case TimeInterval.Minute:
                // If 2+ minutes are currently being shown
                if(differenceInMinutes(endTime, startTime) >= 2) {
                    // Contract a minute to the left and right
                    newStartTime = startOfMinute(addMinutes(startTime, 1));
                    newEndTime = endOfMinute(subMinutes(endTime, 1));
                }
                // If less than 2 minutes are currently being shown
                else {
                    // Can't zoom in further from minute level
                    newStartTime = startOfMinute(startTime);
                    newEndTime = endOfMinute(endTime);
                }
                break;

            default:
                throw new Error('Invalid interval for determining new date range.');
        }
    }
    else {
        // Zoom Out Logic - Expand the range, step to coarser interval when appropriate
        switch(currentInterval) {
            case TimeInterval.Minute: {
                // Check if we're already showing a full hour
                const isFullHour =
                    startOfHour(startTime).getTime() === startTime.getTime() &&
                    endOfHour(endTime).getTime() === endTime.getTime() &&
                    differenceInMinutes(endTime, startTime) === 59;

                // If showing full hour, zoom out to show full 24 hours at Hour interval
                if(isFullHour) {
                    newTimeInterval = TimeInterval.Hour;
                    newStartTime = startOfDay(startTime);
                    newEndTime = endOfDay(endTime);
                }
                // If less than full hour, first snap to full hour at Minute interval
                else {
                    newStartTime = startOfHour(startTime);
                    newEndTime = endOfHour(endTime);
                }
                break;
            }

            case TimeInterval.Hour:
                // If less than 24 hours are currently being shown
                if(differenceInHours(endTime, startTime) <= 24) {
                    // If exactly one day is already being shown
                    if(
                        startOfDay(startTime).getTime() === startTime.getTime() &&
                        endOfDay(endTime).getTime() === endTime.getTime()
                    ) {
                        // Zoom out to the day boundary and show the surrounding two days
                        newTimeInterval = TimeInterval.Day;
                        newStartTime = subDays(startTime, 1);
                        newEndTime = addDays(endTime, 1);
                    }
                    // Zoom out to the day boundary
                    else {
                        newStartTime = startOfDay(startTime);
                        newEndTime = endOfDay(endTime);
                    }
                }
                // If more than 24 hours are being shown
                else {
                    // Switch to day interval
                    newTimeInterval = TimeInterval.Day;
                    newStartTime = startTime;
                    newEndTime = endTime;
                }
                break;

            case TimeInterval.Day:
                // Always zoom out to Month and show current month plus left and right months
                newTimeInterval = TimeInterval.Month;
                newStartTime = subMonths(startOfMonth(startTime), 1);
                newEndTime = addMonths(endOfMonth(endTime), 1);
                break;

            case TimeInterval.Week:
                // If less than two months are currently being shown
                if(differenceInMonths(endTime, startTime) <= 2) {
                    // If exactly one month is already being shown
                    if(
                        startOfMonth(startTime).getTime() === startTime.getTime() &&
                        endOfMonth(endTime).getTime() === endTime.getTime()
                    ) {
                        // Zoom out to the month boundary and show the surrounding two months
                        newTimeInterval = TimeInterval.Month;
                        newStartTime = subMonths(startTime, 1);
                        newEndTime = addMonths(endTime, 1);
                    }
                    // Zoom out to the month boundary
                    else {
                        newStartTime = startOfMonth(startTime);
                        newEndTime = endOfMonth(endTime);
                    }
                }
                // If more than two months are being shown
                else {
                    // Switch to month interval
                    newTimeInterval = TimeInterval.Month;
                    newStartTime = startTime;
                    newEndTime = endTime;
                }
                break;

            case TimeInterval.Month:
                // If exactly one month is being shown
                if(
                    startOfMonth(startTime).getTime() === startTime.getTime() &&
                    endOfMonth(endTime).getTime() === endTime.getTime() &&
                    differenceInMonths(endTime, startTime) === 0
                ) {
                    // Show current month plus left and right months
                    newStartTime = subMonths(startTime, 1);
                    newEndTime = addMonths(endTime, 1);
                }
                // If less than two years are currently being shown
                else if(differenceInMonths(endTime, startTime) < 24) {
                    // If exactly one year is already being shown
                    if(
                        startOfYear(startTime).getTime() === startTime.getTime() &&
                        endOfYear(endTime).getTime() === endTime.getTime()
                    ) {
                        // Zoom out to the year boundary and show the surrounding two years
                        newTimeInterval = TimeInterval.Year;
                        newStartTime = subYears(startTime, 1);
                        newEndTime = addYears(endTime, 1);
                    }
                    // Zoom out to the year boundary
                    else {
                        newStartTime = startOfYear(startTime);
                        newEndTime = endOfYear(endTime);
                    }
                }
                // If more than 24 months are being shown
                else {
                    // Switch to year interval
                    newTimeInterval = TimeInterval.Year;
                    newStartTime = startTime;
                    newEndTime = endTime;
                }
                break;

            case TimeInterval.Quarter:
                // If less than four years are currently being shown
                if(differenceInMonths(endTime, startTime) < 48) {
                    // If exactly one year is already being shown
                    if(
                        startOfYear(startTime).getTime() === startTime.getTime() &&
                        endOfYear(endTime).getTime() === endTime.getTime()
                    ) {
                        // Zoom out to the year boundary and show the surrounding two years
                        newTimeInterval = TimeInterval.Year;
                        newStartTime = subYears(startTime, 1);
                        newEndTime = addYears(endTime, 1);
                    }
                    // Zoom out to the year boundary
                    else {
                        newStartTime = startOfYear(startTime);
                        newEndTime = endOfYear(endTime);
                    }
                }
                // If more than 48 months are being shown
                else {
                    // Switch to year interval
                    newTimeInterval = TimeInterval.Year;
                    newStartTime = startTime;
                    newEndTime = endTime;
                }
                break;

            case TimeInterval.Year:
                // Expand a year to the left and right
                newStartTime = subYears(startTime, 1);
                newEndTime = addYears(endTime, 1);
                break;

            default:
                throw new Error('Invalid interval for determining new date range.');
        }
    }

    return {
        newTimeInterval,
        newStartTime,
        newEndTime,
    };
}
