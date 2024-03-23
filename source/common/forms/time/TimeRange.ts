// Dependencies - Utilities
import {
    startOfDay,
    endOfDay,
    startOfToday,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    endOfToday,
    endOfWeek,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    subDays,
    subWeeks,
    subMonths,
    subQuarters,
    subYears,
    isSameDay,
} from 'date-fns';

// Type - TimeRangeType
export type TimeRangeType = { startTime: Date | undefined; endTime: Date | undefined };

// Time Range Presets
export function getTimeRangePresets(): Record<string, TimeRangeType> {
    const startOfTodayDate = startOfToday();
    const endOfTodayDate = endOfToday();

    // This object maps preset names to their respective date ranges and handlers
    // This allows for easy management of presets and centralizes the logic for setting date ranges
    return {
        Today: {
            startTime: startOfToday(),
            endTime: endOfTodayDate,
        },
        Yesterday: {
            startTime: startOfDay(subDays(startOfTodayDate, 1)),
            endTime: endOfDay(subDays(startOfTodayDate, 1)),
        },
        'This Week': {
            startTime: startOfWeek(startOfTodayDate),
            endTime: endOfTodayDate,
        },
        'Last Week': {
            startTime: startOfWeek(subWeeks(startOfTodayDate, 1)),
            endTime: endOfWeek(subWeeks(startOfTodayDate, 1)),
        },
        'This Month': {
            startTime: startOfMonth(startOfTodayDate),
            endTime: endOfTodayDate,
        },
        'Last Month': {
            startTime: startOfMonth(subMonths(startOfTodayDate, 1)),
            endTime: endOfMonth(subMonths(startOfTodayDate, 1)),
        },
        'This Quarter': {
            startTime: startOfQuarter(startOfTodayDate),
            endTime: endOfTodayDate,
        },
        'Last Quarter': {
            startTime: startOfQuarter(subQuarters(startOfTodayDate, 1)),
            endTime: endOfQuarter(subQuarters(startOfTodayDate, 1)),
        },
        'This Year': {
            startTime: startOfYear(startOfTodayDate),
            endTime: endOfTodayDate,
        },
        'Last Year': {
            startTime: startOfYear(subYears(startOfTodayDate, 1)),
            endTime: endOfYear(subYears(startOfTodayDate, 1)),
        },
        'Last 7 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 6)),
            endTime: endOfTodayDate,
        },
        'Last 14 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 13)),
            endTime: endOfTodayDate,
        },
        'Last 28 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 27)),
            endTime: endOfTodayDate,
        },
        'Last 60 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 59)),
            endTime: endOfTodayDate,
        },
        'Last 90 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 89)),
            endTime: endOfTodayDate,
        },
        'Last 180 Days': {
            startTime: startOfDay(subDays(startOfTodayDate, 179)),
            endTime: endOfTodayDate,
        },
        'Last 12 Months': {
            startTime: startOfDay(subDays(startOfTodayDate, 364)),
            endTime: endOfTodayDate,
        },
        'Last 24 Months': {
            startTime: startOfDay(subDays(startOfTodayDate, 729)),
            endTime: endOfTodayDate,
        },
    };
}

// Find the key of a matching time range preset given a start and end time
export function getMatchingTimeRangePresetKey(timeRange: TimeRangeType | undefined) {
    const TimeRangePresets = getTimeRangePresets();
    let matchingTimeRangePresetKey = 'Custom';

    // Loop through the time range presets
    if(timeRange !== undefined) {
        for(const timeRangePresetKey in TimeRangePresets) {
            // Get the start and end time of the current time range preset
            const currentTimeRangePreset = TimeRangePresets[timeRangePresetKey]!;
            if(
                timeRange.startTime &&
                currentTimeRangePreset.startTime &&
                isSameDay(timeRange.startTime, currentTimeRangePreset.startTime) &&
                timeRange.endTime &&
                currentTimeRangePreset.endTime &&
                isSameDay(timeRange.endTime, currentTimeRangePreset.endTime)
            ) {
                matchingTimeRangePresetKey = timeRangePresetKey;
                break;
            }
        }
    }

    return matchingTimeRangePresetKey;
}
