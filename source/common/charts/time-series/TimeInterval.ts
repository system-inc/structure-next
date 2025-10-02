// Custom TimeInterval enum that extends the GraphQL version with additional intervals
// This will eventually be merged into the Structure GraphQL schema

export enum TimeInterval {
    Minute = 'Minute',
    Hour = 'Hour',
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Quarter = 'Quarter',
    Year = 'Year',
    // Specialized intervals
    HourOfDay = 'HourOfDay',
    DayOfWeek = 'DayOfWeek',
    DayOfMonth = 'DayOfMonth',
    MonthOfYear = 'MonthOfYear',
    WeekOfYear = 'WeekOfYear',
}

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
