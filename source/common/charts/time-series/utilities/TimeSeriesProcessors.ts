// Dependencies - Types
import { TimeInterval } from '../TimeInterval';

// Dependencies - Utilities
import {
    startOfMinute,
    startOfHour,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfYear,
    endOfMinute,
    endOfHour,
    endOfDay,
    endOfWeek,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    addMinutes,
    addHours,
    addDays,
    addWeeks,
    addMonths,
    addQuarters,
    addYears,
    getWeek,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInQuarters,
    differenceInYears,
} from 'date-fns';

// Type - TimeSeriesRawDataPoint
export interface TimeSeriesRawDataPoint {
    timeIntervalValue: string | number;
    total: number;
}

// Type - TimeSeriesProcessedDataPoint
export interface TimeSeriesProcessedDataPoint {
    label: string;
    [key: string]: number | string;
}

// Function to fill missing interval values with zeroes
export function fillMissingTimeIntervalValuesWithZeroes(
    data: TimeSeriesRawDataPoint[],
    startDate: Date,
    endDate: Date,
    interval: TimeInterval,
): TimeSeriesRawDataPoint[] {
    if(!data || data.length === 0) {
        return generateEmptyDataPoints(startDate, endDate, interval);
    }

    // Create a map of existing data points
    const dataMap = new Map<string, number>();
    data.forEach(function (point) {
        dataMap.set(String(point.timeIntervalValue), point.total);
    });

    // Generate all expected intervals
    const filledData: TimeSeriesRawDataPoint[] = [];
    let currentDate = getTimeIntervalStart(startDate, interval);
    const endIntervalDate = getTimeIntervalEnd(endDate, interval);

    // Iterate over each interval and fill missing data points with zeroes
    while(currentDate <= endIntervalDate) {
        const intervalKey = formatTimeIntervalKey(currentDate, interval);
        filledData.push({
            timeIntervalValue: intervalKey,
            total: dataMap.get(intervalKey) || 0,
        });
        currentDate = addTimeInterval(currentDate, interval, 1);
    }

    return filledData;
}

// Function to generate empty data points for a date range
export function generateEmptyDataPoints(
    startDate: Date,
    endDate: Date,
    interval: TimeInterval,
): TimeSeriesRawDataPoint[] {
    const dataPoints: TimeSeriesRawDataPoint[] = [];
    let currentDate = getTimeIntervalStart(startDate, interval);
    const endIntervalDate = getTimeIntervalEnd(endDate, interval);

    while(currentDate <= endIntervalDate) {
        dataPoints.push({
            timeIntervalValue: formatTimeIntervalKey(currentDate, interval),
            total: 0,
        });
        currentDate = addTimeInterval(currentDate, interval, 1);
    }

    return dataPoints;
}

// Function to get the start of an interval
export function getTimeIntervalStart(date: Date, interval: TimeInterval): Date {
    switch(interval) {
        case TimeInterval.Minute:
            return startOfMinute(date);
        case TimeInterval.Hour:
            return startOfHour(date);
        case TimeInterval.Day:
            return startOfDay(date);
        case TimeInterval.Week:
            return startOfWeek(date);
        case TimeInterval.Month:
            return startOfMonth(date);
        case TimeInterval.Quarter:
            return startOfQuarter(date);
        case TimeInterval.Year:
            return startOfYear(date);
        // Specialized intervals use hour as base unit
        case TimeInterval.HourOfDay:
            return startOfHour(date);
        case TimeInterval.DayOfWeek:
            return startOfDay(date);
        case TimeInterval.DayOfMonth:
            return startOfDay(date);
        case TimeInterval.MonthOfYear:
            return startOfMonth(date);
        case TimeInterval.WeekOfYear:
            return startOfWeek(date);
        default:
            return startOfDay(date);
    }
}

// Function to get the end of an interval
export function getTimeIntervalEnd(date: Date, interval: TimeInterval): Date {
    switch(interval) {
        case TimeInterval.Minute:
            return endOfMinute(date);
        case TimeInterval.Hour:
            return endOfHour(date);
        case TimeInterval.Day:
            return endOfDay(date);
        case TimeInterval.Week:
            return endOfWeek(date);
        case TimeInterval.Month:
            return endOfMonth(date);
        case TimeInterval.Quarter:
            return endOfQuarter(date);
        case TimeInterval.Year:
            return endOfYear(date);
        // Specialized intervals use hour/day/month/week/year as base unit
        case TimeInterval.HourOfDay:
            return endOfHour(date);
        case TimeInterval.DayOfWeek:
            return endOfDay(date);
        case TimeInterval.DayOfMonth:
            return endOfDay(date);
        case TimeInterval.MonthOfYear:
            return endOfMonth(date);
        case TimeInterval.WeekOfYear:
            return endOfWeek(date);
        default:
            return endOfDay(date);
    }
}

// Function to add intervals to a date
export function addTimeInterval(date: Date, interval: TimeInterval, count: number): Date {
    switch(interval) {
        case TimeInterval.Minute:
            return addMinutes(date, count);
        case TimeInterval.Hour:
            return addHours(date, count);
        case TimeInterval.Day:
            return addDays(date, count);
        case TimeInterval.Week:
            return addWeeks(date, count);
        case TimeInterval.Month:
            return addMonths(date, count);
        case TimeInterval.Quarter:
            return addQuarters(date, count);
        case TimeInterval.Year:
            return addYears(date, count);
        // Specialized intervals increment by their base unit
        case TimeInterval.HourOfDay:
            return addHours(date, count);
        case TimeInterval.DayOfWeek:
            return addDays(date, count);
        case TimeInterval.DayOfMonth:
            return addDays(date, count);
        case TimeInterval.MonthOfYear:
            return addMonths(date, count);
        case TimeInterval.WeekOfYear:
            return addWeeks(date, count);
        default:
            return addDays(date, count);
    }
}

// Function to calculate difference between dates in intervals
export function differenceInTimeIntervals(startDate: Date, endDate: Date, interval: TimeInterval): number {
    switch(interval) {
        case TimeInterval.Minute:
            return differenceInMinutes(endDate, startDate);
        case TimeInterval.Hour:
            return differenceInHours(endDate, startDate);
        case TimeInterval.Day:
            return differenceInDays(endDate, startDate);
        case TimeInterval.Week:
            return differenceInWeeks(endDate, startDate);
        case TimeInterval.Month:
            return differenceInMonths(endDate, startDate);
        case TimeInterval.Quarter:
            return differenceInQuarters(endDate, startDate);
        case TimeInterval.Year:
            return differenceInYears(endDate, startDate);
        // Specialized intervals use their base unit for difference calculation
        case TimeInterval.HourOfDay:
            return differenceInHours(endDate, startDate);
        case TimeInterval.DayOfWeek:
            return differenceInDays(endDate, startDate);
        case TimeInterval.DayOfMonth:
            return differenceInDays(endDate, startDate);
        case TimeInterval.MonthOfYear:
            return differenceInMonths(endDate, startDate);
        case TimeInterval.WeekOfYear:
            return differenceInWeeks(endDate, startDate);
        default:
            return differenceInDays(endDate, startDate);
    }
}

// Function to format interval key for consistent data mapping
export function formatTimeIntervalKey(date: Date, interval: TimeInterval): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    switch(interval) {
        case TimeInterval.Minute:
            return `${year}-${month}-${day}T${hour}:${minute}:00`;
        case TimeInterval.Hour:
            return `${year}-${month}-${day}T${hour}:00:00`;
        case TimeInterval.Day:
            return `${year}-${month}-${day}`;
        case TimeInterval.Week: {
            const weekNumber = getWeek(date);
            return `${year}-W${String(weekNumber).padStart(2, '0')}`;
        }
        case TimeInterval.Month:
            return `${year}-${month}`;
        case TimeInterval.Quarter: {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `${year}-Q${quarter}`;
        }
        case TimeInterval.Year:
            return String(year);
        // Specialized intervals return just the component value
        case TimeInterval.HourOfDay:
            return String(date.getHours());
        case TimeInterval.DayOfWeek:
            return String(date.getDay()); // 0 = Sunday, 6 = Saturday
        case TimeInterval.DayOfMonth:
            return String(date.getDate());
        case TimeInterval.MonthOfYear:
            return String(date.getMonth() + 1); // 1 = January, 12 = December
        case TimeInterval.WeekOfYear: {
            const weekNumber = getWeek(date);
            return String(weekNumber);
        }
        default:
            return `${year}-${month}-${day}`;
    }
}

// Function to convert raw data to processed format for chart consumption
export function processTimeSeriesData(
    rawData: TimeSeriesRawDataPoint[],
    dataKey: string,
): TimeSeriesProcessedDataPoint[] {
    return rawData.map((point) => ({
        label: String(point.timeIntervalValue),
        [dataKey]: point.total,
    }));
}

// Function to merge multiple data series into a single dataset
export function mergeTimeSeriesData(
    dataSeries: Array<{ key: string; data: TimeSeriesRawDataPoint[] }>,
): TimeSeriesProcessedDataPoint[] {
    // Create a map to store merged data
    const mergedMap = new Map<string, TimeSeriesProcessedDataPoint>();

    // Process each data series
    dataSeries.forEach(function ({ key, data }) {
        data.forEach(function (point) {
            const label = String(point.timeIntervalValue);
            const existing = mergedMap.get(label) || { label };
            existing[key] = point.total;
            mergedMap.set(label, existing);
        });
    });

    // Convert map to array and sort by label
    return Array.from(mergedMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

// Calculate optimal interval based on date range
export function calculateOptimalInterval(startDate: Date, endDate: Date, maxDataPoints: number = 999): TimeInterval {
    const hours = differenceInHours(endDate, startDate);
    const days = differenceInDays(endDate, startDate);
    const months = differenceInMonths(endDate, startDate);
    const years = differenceInYears(endDate, startDate);

    // Choose interval based on range and max data points
    if(hours <= maxDataPoints && hours <= 72) {
        return TimeInterval.Hour;
    }
    if(days <= maxDataPoints && days <= 90) {
        return TimeInterval.Day;
    }
    if(months <= maxDataPoints && months <= 36) {
        return TimeInterval.Month;
    }
    if(years <= maxDataPoints && years <= 10) {
        return TimeInterval.Year;
    }

    // Default to month for larger ranges
    return TimeInterval.Month;
}

// Get the topmost non-zero bar in a stacked chart
export function getTopBarDataKey<T extends Record<string, number | string>>(
    dataPoint: T,
    dataKeys: string[],
): string | null {
    // Iterate dataKeys in reverse (they're rendered bottom-to-top in stacked charts)
    for(let i = dataKeys.length - 1; i >= 0; i--) {
        const dataKey = dataKeys[i];
        if(!dataKey) continue;

        const value = dataPoint[dataKey];
        if(typeof value === 'number' && value > 0) {
            return dataKey;
        }
    }
    return null;
}

// Maximum number of data points allowed in a time series chart
export const maximumDataPoints = 370;

// Function to check if data points exceed maximum allowed
export function exceedsMaximumDataPoints(dataPointCount: number, maximum?: number): boolean {
    const limit = maximum ?? maximumDataPoints;
    return dataPointCount > limit;
}
