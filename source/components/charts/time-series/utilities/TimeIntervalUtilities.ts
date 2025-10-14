// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Helper function to check if an interval is a specialized interval
// Specialized intervals represent aggregate data across a date range (e.g., all Mondays, all 3PM hours)
// rather than time series progression, so zooming/selection doesn't make conceptual sense
export function isSpecializedInterval(interval: TimeInterval): boolean {
    return [
        TimeInterval.HourOfDay,
        TimeInterval.DayOfWeek,
        TimeInterval.DayOfMonth,
        TimeInterval.MonthOfYear,
        TimeInterval.WeekOfYear,
    ].includes(interval);
}
