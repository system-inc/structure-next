// ================================================================================================
// Cron Expression Utilities
// ================================================================================================

// Common cron expression presets
export const cronPresets = [
    { label: 'Every 15 minutes', expression: '*/15 * * * *' },
    { label: 'Every hour', expression: '0 * * * *' },
    { label: 'Daily at midnight', expression: '0 0 * * *' },
    { label: 'Weekly on Monday', expression: '0 9 * * 1' },
    { label: 'First of the month', expression: '0 9 1 * *' },
];

/**
 * Converts a 5-part cron expression to a human-readable format.
 *
 * @param {string} expression - The cron expression (minute hour day-of-month month day-of-week)
 * @returns {string} A human-readable description of the schedule
 *
 * @example
 * cronExpressionHumanReadable("* * * * *")       // Returns: "every minute"
 * cronExpressionHumanReadable("0 * * * *")       // Returns: "every hour at minute 0"
 * cronExpressionHumanReadable("0 9 * * *")       // Returns: "daily at 09:00"
 * cronExpressionHumanReadable("0 9 * * 1")       // Returns: "every Monday at 09:00"
 * cronExpressionHumanReadable("0 9 1 * *")       // Returns: "monthly on the 1st at 09:00"
 */
export function cronExpressionHumanReadable(expression: string): string {
    const parts = expression.trim().split(/\s+/);
    if(parts.length !== 5) {
        return expression;
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Every minute: * * * * *
    if(minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return 'every minute';
    }

    // Every N minutes: */N * * * *
    const everyNMinutes = minute?.match(/^\*\/(\d+)$/);
    if(everyNMinutes && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        const n = parseInt(everyNMinutes[1] || '1');
        return `every ${n} minute${n !== 1 ? 's' : ''}`;
    }

    // Every hour at minute N: N * * * *
    const minuteNumber = parseInt(minute || '');
    if(!isNaN(minuteNumber) && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return `every hour at minute ${minuteNumber}`;
    }

    // Daily at specific time: N N * * *
    const hourNumber = parseInt(hour || '');
    if(!isNaN(minuteNumber) && !isNaN(hourNumber) && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        const timeStr = `${hourNumber.toString().padStart(2, '0')}:${minuteNumber.toString().padStart(2, '0')}`;
        return `daily at ${timeStr}`;
    }

    // Weekly: N N * * N
    const dayOfWeekNumber = parseInt(dayOfWeek || '');
    if(!isNaN(minuteNumber) && !isNaN(hourNumber) && dayOfMonth === '*' && month === '*' && !isNaN(dayOfWeekNumber)) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dayOfWeekNumber] || dayOfWeek;
        const timeStr = `${hourNumber.toString().padStart(2, '0')}:${minuteNumber.toString().padStart(2, '0')}`;
        return `every ${dayName} at ${timeStr}`;
    }

    // Monthly: N N N * *
    const dayOfMonthNumber = parseInt(dayOfMonth || '');
    if(!isNaN(minuteNumber) && !isNaN(hourNumber) && !isNaN(dayOfMonthNumber) && month === '*' && dayOfWeek === '*') {
        const timeStr = `${hourNumber.toString().padStart(2, '0')}:${minuteNumber.toString().padStart(2, '0')}`;
        const daySuffix =
            dayOfMonthNumber === 1 ? 'st' : dayOfMonthNumber === 2 ? 'nd' : dayOfMonthNumber === 3 ? 'rd' : 'th';
        return `monthly on the ${dayOfMonthNumber}${daySuffix} at ${timeStr}`;
    }

    return `cron: ${expression}`;
}
