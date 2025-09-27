// Dependencies - API
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { format } from 'date-fns';

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
            return format(date, 'MMM d, yyyy h:mm a');
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

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[parseInt(currentMonth) - 1] || '';

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
            // Since we're controlling the interval at the XAxis level,
            // we can show the day for all ticks that Recharts decides to show
            tickValue = day.toString();
        }
        else if(type === 'secondary') {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // Show month name when it changes or at the start
            if(index === 0 || !previousDate || date.getMonth() !== previousDate.getMonth()) {
                tickValue = monthNames[date.getMonth()] || '';
            }
        }
    }
    // Handle hours
    else if(timeInterval === TimeInterval.Hour) {
        const date = new Date(value);
        const hour = date.getHours();
        const previousDate = previousTickValue ? new Date(previousTickValue) : null;

        if(type === 'primary') {
            const hourString = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;

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
            else if(totalTicks <= 72) {
                if(hour % 6 === 0) {
                    tickValue = hourString;
                }
            }
            else {
                if(hour === 0 || hour === 12) {
                    tickValue = hourString;
                }
            }
        }
        else if(type === 'secondary') {
            if(index === 0 || !previousDate || date.getDate() !== previousDate.getDate()) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                tickValue = `${monthNames[date.getMonth()]} ${date.getDate()}`;
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
