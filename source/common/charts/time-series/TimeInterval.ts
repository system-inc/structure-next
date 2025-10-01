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
