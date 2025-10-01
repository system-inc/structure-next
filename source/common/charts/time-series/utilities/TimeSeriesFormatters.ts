// Dependencies - Types
import { TimeInterval } from '../TimeInterval';

// Dependencies - Utilities
import { format } from 'date-fns';
import { monthAbbreviation } from '@structure/source/utilities/Time';

// Function to format a date value based on the interval
export function formatDateByTimeInterval(date: Date, interval: TimeInterval): string {
    switch(interval) {
        case TimeInterval.Year:
            return format(date, 'yyyy');
        case TimeInterval.Quarter: {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `${format(date, 'yyyy')}-Q${quarter}`;
        }
        case TimeInterval.Month:
            return format(date, 'yyyy-MM');
        case TimeInterval.Day:
            return format(date, 'yyyy-MM-dd');
        case TimeInterval.Hour:
            return format(date, "yyyy-MM-dd'T'HH:00:00");
        default:
            return format(date, 'yyyy-MM-dd');
    }
}

// Function to format a tip label based on interval
export function formatTipLabelByTimeInterval(label: string, interval: TimeInterval): string {
    const date = new Date(label);

    switch(interval) {
        case TimeInterval.Year:
            return format(date, 'yyyy');
        case TimeInterval.Quarter: {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `Q${quarter} ${format(date, 'yyyy')}`;
        }
        case TimeInterval.Month:
            return format(date, 'MMMM yyyy');
        case TimeInterval.Day:
            return format(date, 'MMM d, yyyy');
        case TimeInterval.Hour:
            return format(date, "MMMM d, yyyy 'at' h a");
        default:
            return label;
    }
}

// Get the display name for an interval
export function getTimeIntervalDisplayName(interval: TimeInterval): string {
    switch(interval) {
        case TimeInterval.Year:
            return 'Year';
        case TimeInterval.Quarter:
            return 'Quarter';
        case TimeInterval.Month:
            return 'Month';
        case TimeInterval.Day:
            return 'Day';
        case TimeInterval.Hour:
            return 'Hour';
        default:
            return interval;
    }
}

// Track day changes for primary axis (reset when index is 0)
let lastSeenDay: number | null = null;

// Track month changes for secondary axis (reset when index is 0)
let lastSeenMonth: number | null = null;

// Format tick for chart axis based on interval and position
export function formatAxisTick(
    type: 'primary' | 'secondary',
    timeInterval: TimeInterval,
    value: string,
    index: number,
    previousTickValue: string,
    totalTicks: number,
): string {
    let tickValue = '';

    // Handle years
    if(timeInterval === TimeInterval.Year) {
        if(type === 'primary') {
            if(totalTicks <= 25) {
                tickValue = value;
            }
            else if(totalTicks <= 50) {
                if(index === 0 || index == totalTicks - 1 || parseInt(value) % 5 === 0) {
                    tickValue = value;
                }
            }
            else {
                if(index === 0 || index == totalTicks - 1 || parseInt(value) % 10 === 0) {
                    tickValue = value.toString().slice(-2);
                }
            }
        }
    }
    // Handle quarters
    else if(timeInterval === TimeInterval.Quarter) {
        const quarter = value.slice(-2);
        const currentYear = value.slice(0, 4);
        const previousTickValueYear = previousTickValue.slice(0, 4);

        if(type === 'primary') {
            if(index === 0 || index === totalTicks - 1) {
                tickValue = quarter;
            }
            else if(totalTicks <= 30) {
                tickValue = quarter;
            }
            else {
                if(quarter === 'Q1') {
                    tickValue = quarter;
                }
            }
        }
        else if(type === 'secondary') {
            if(index === 0 || currentYear !== previousTickValueYear) {
                tickValue = currentYear;
            }
        }
    }
    // Handle months
    else if(timeInterval === TimeInterval.Month) {
        const currentYear = value.slice(0, 4);
        const currentMonth = value.slice(5, 7);
        const previousTickValueYear = previousTickValue.slice(0, 4);

        const monthName = monthAbbreviation(parseInt(currentMonth));

        if(type === 'primary') {
            if(index === 0 || index === totalTicks - 1) {
                tickValue = monthName;
            }
            else if(totalTicks <= 15) {
                tickValue = monthName;
            }
            else if(totalTicks <= 50) {
                if(currentMonth === '01' || currentMonth === '07') {
                    tickValue = monthName;
                }
            }
            else {
                if(currentMonth === '01') {
                    tickValue = monthName;
                }
            }
        }
        else if(type === 'secondary') {
            if(index === 0 || currentYear !== previousTickValueYear) {
                tickValue = currentYear;
            }
        }
    }
    // Handle days
    else if(timeInterval === TimeInterval.Day) {
        // Parse date string to avoid timezone issues
        // Expecting format: "YYYY-MM-DD"
        const dateParts = value.split('-');
        const year = parseInt(dateParts[0] || '2025', 10);
        const month = parseInt(dateParts[1] || '1', 10);
        const dayStr = parseInt(dateParts[2] || '1', 10);
        const date = new Date(year, month - 1, dayStr); // month is 0-indexed
        const day = date.getDate();
        const previousDate = previousTickValue
            ? (() => {
                  const prevParts = previousTickValue.split('-');
                  const prevYear = parseInt(prevParts[0] || '2025', 10);
                  const prevMonth = parseInt(prevParts[1] || '1', 10);
                  const prevDay = parseInt(prevParts[2] || '1', 10);
                  return new Date(prevYear, prevMonth - 1, prevDay);
              })()
            : null;

        if(type === 'primary') {
            // Show day numbers based on density
            if(index === 0 || index === totalTicks - 1) {
                tickValue = day.toString();
            }
            else if(totalTicks <= 7) {
                // Show all days for a week or less
                tickValue = day.toString();
            }
            else if(totalTicks <= 14) {
                // Show every other day
                if(day % 2 === 1) {
                    tickValue = day.toString();
                }
            }
            else if(totalTicks <= 31) {
                // Show every 3rd day
                if(day % 3 === 0 || day === 1) {
                    tickValue = day.toString();
                }
            }
            else {
                // Show every 5th day for longer ranges
                if(day % 5 === 0 || day === 1) {
                    tickValue = day.toString();
                }
            }
        }
        else if(type === 'secondary') {
            // Show month name when it changes or at the start
            if(index === 0 || !previousDate || date.getMonth() !== previousDate.getMonth()) {
                tickValue = monthAbbreviation(date.getMonth() + 1);
            }
        }
    }
    // Handle hours
    else if(timeInterval === TimeInterval.Hour) {
        const date = new Date(value);
        const hour = date.getHours();
        const currentDay = date.getDate();

        // Estimate number of days: ticks / 24 hours per day
        const estimatedDays = Math.ceil(totalTicks / 24);

        if(type === 'primary') {
            // For single day (≤24 hours), show hours on primary axis
            if(estimatedDays <= 1) {
                const hourString =
                    hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

                if(index === 0 || index === totalTicks - 1) {
                    tickValue = hourString;
                }
                else if(totalTicks <= 12) {
                    tickValue = hourString;
                }
                else if(totalTicks <= 24) {
                    if(hour % 3 === 0) {
                        tickValue = hourString;
                    }
                }
            }
            // For multiple days, show day numbers on primary axis
            else {
                // Reset tracking when we start rendering (index 0)
                if(index === 0) {
                    lastSeenDay = null;
                }

                // Check if day actually changed
                const dayChanged = lastSeenDay === null || currentDay !== lastSeenDay;

                // Update tracking
                if(dayChanged) {
                    lastSeenDay = currentDay;
                }

                // Show day numbers when day changes
                if(dayChanged) {
                    tickValue = currentDay.toString();
                }
            }
        }
        else if(type === 'secondary') {
            // For single day, show "Month Day" on secondary axis
            if(estimatedDays <= 1) {
                if(index === 0) {
                    tickValue = `${monthAbbreviation(date.getMonth() + 1)} ${currentDay}`;
                }
            }
            // For multiple days, show month when it changes
            else {
                const currentMonth = date.getMonth();

                // Reset tracking when we start rendering (index 0)
                if(index === 0) {
                    lastSeenMonth = null;
                }

                // Check if month actually changed
                const monthChanged = lastSeenMonth === null || currentMonth !== lastSeenMonth;

                // Update tracking
                if(monthChanged) {
                    lastSeenMonth = currentMonth;
                }

                // Show month name when month changes
                if(monthChanged) {
                    tickValue = monthAbbreviation(currentMonth + 1);
                }
            }
        }
    }
    // Handle minutes
    else if(timeInterval === TimeInterval.Minute) {
        const date = new Date(value);
        const minute = date.getMinutes();
        const hour = date.getHours();
        const previousDate = previousTickValue ? new Date(previousTickValue) : null;

        if(type === 'primary') {
            const minuteString = `:${String(minute).padStart(2, '0')}`;

            if(index === 0 || index === totalTicks - 1) {
                tickValue = minuteString;
            }
            else if(totalTicks <= 15) {
                tickValue = minuteString;
            }
            else if(totalTicks <= 60) {
                if(minute % 5 === 0) {
                    tickValue = minuteString;
                }
            }
            else if(totalTicks <= 180) {
                if(minute % 15 === 0) {
                    tickValue = minuteString;
                }
            }
            else {
                if(minute === 0 || minute === 30) {
                    tickValue = minuteString;
                }
            }
        }
        else if(type === 'secondary') {
            if(index === 0 || !previousDate || date.getHours() !== previousDate.getHours()) {
                const hourString =
                    hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
                tickValue = hourString;
            }
        }
    }
    // Handle weeks
    else if(timeInterval === TimeInterval.Week) {
        // Week format: "YYYY-WWW"
        const weekMatch = value.match(/^(\d{4})-W(\d{2})$/);
        if(weekMatch) {
            const year = weekMatch[1]!;
            const week = weekMatch[2]!;
            const previousYear = previousTickValue.slice(0, 4);

            if(type === 'primary') {
                if(index === 0 || index === totalTicks - 1) {
                    tickValue = `W${week}`;
                }
                else if(totalTicks <= 20) {
                    tickValue = `W${week}`;
                }
                else {
                    if(parseInt(week) % 4 === 0) {
                        tickValue = `W${week}`;
                    }
                }
            }
            else if(type === 'secondary') {
                if(index === 0 || year !== previousYear) {
                    tickValue = year;
                }
            }
        }
    }

    return tickValue;
}

// Calculate tick interval based on data density
export function calculateTickInterval(dataLength: number): number {
    if(dataLength > 180) {
        return Math.floor(dataLength / 30);
    }
    else if(dataLength > 90) {
        return Math.floor(dataLength / 20);
    }
    else if(dataLength > 30) {
        return Math.floor(dataLength / 15);
    }
    return 0;
}
