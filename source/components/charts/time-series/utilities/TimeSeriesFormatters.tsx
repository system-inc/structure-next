// Dependencies - React
import React from 'react';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { format } from 'date-fns';
import { monthAbbreviation, timeOnly } from '@structure/source/utilities/time/Time';

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
export function formatTipLabelByTimeInterval(label: string, interval: TimeInterval): string | React.ReactNode {
    switch(interval) {
        case TimeInterval.Year:
            // Backend sends "2025", use as-is to avoid timezone issues
            return label;
        case TimeInterval.Quarter: {
            // Backend sends "2025-Q4", parse directly to avoid timezone issues
            // Format is "YYYY-QN"
            const parts = label.split('-Q');
            const year = parts[0];
            const quarter = parts[1];
            return `${year} Q${quarter}`;
        }
        case TimeInterval.Month: {
            // Parse month directly from string to avoid timezone issues
            // Format is "YYYY-MM"
            const parts = label.split('-');
            const year = parts[0];
            const month = parseInt(parts[1] || '1', 10);
            const monthDate = new Date(parseInt(year || '2025', 10), month - 1, 1);
            return format(monthDate, 'MMMM yyyy');
        }
        case TimeInterval.Day: {
            // Parse date directly from string to avoid timezone issues
            // Format is "YYYY-MM-DD"
            const parts = label.split('-');
            const year = parseInt(parts[0] || '2025', 10);
            const month = parseInt(parts[1] || '1', 10);
            const day = parseInt(parts[2] || '1', 10);
            const date = new Date(year, month - 1, day);
            return (
                <div>
                    <div>{format(date, 'MMMM d, yyyy')}</div>
                    <div>{format(date, 'EEEE')}</div>
                </div>
            );
        }
        case TimeInterval.Hour: {
            const date = new Date(label);
            return (
                <div>
                    <div>{format(date, 'MMMM d, yyyy')}</div>
                    <div>
                        {timeOnly(date)} ({format(date, 'EEEE')})
                    </div>
                </div>
            );
        }
        case TimeInterval.Minute: {
            const date = new Date(label);
            return (
                <div>
                    <div>{format(date, 'MMMM d, yyyy')}</div>
                    <div>
                        {timeOnly(date)} ({format(date, 'EEEE')})
                    </div>
                </div>
            );
        }
        case TimeInterval.HourOfDay: {
            // Label is "0" to "23"
            const hour = parseInt(label, 10);
            return hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
        }
        case TimeInterval.DayOfWeek: {
            // Label could be "Monday" or "0"-"6"
            const dayNumber = parseInt(label, 10);
            if(!isNaN(dayNumber)) {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return days[dayNumber] || label;
            }
            return label;
        }
        case TimeInterval.DayOfMonth: {
            // Label is "1" to "31"
            return `Day ${label}`;
        }
        case TimeInterval.MonthOfYear: {
            // Label could be "1"-"12" or "January"-"December"
            const monthNumber = parseInt(label, 10);
            if(!isNaN(monthNumber)) {
                const months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ];
                return months[monthNumber - 1] || label;
            }
            return label;
        }
        case TimeInterval.WeekOfYear: {
            // Label is "1" to "52" or "W01" to "W52"
            const weekMatch = label.match(/^W?(\d+)$/);
            if(weekMatch) {
                return `Week ${weekMatch[1]}`;
            }
            return label;
        }
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

// Track highest index seen for detecting last tick
let highestIndexSeen = -1;

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

    // Track if this is the last tick by monitoring the highest index seen
    // Reset when we see index 0 (new render cycle)
    if(index === 0) {
        highestIndexSeen = 0;
    }
    const isLastTick = index > highestIndexSeen;
    if(isLastTick) {
        highestIndexSeen = index;
    }

    // Handle years
    if(timeInterval === TimeInterval.Year) {
        if(type === 'primary') {
            if(totalTicks <= 10) {
                // Show all years for 10 or fewer
                tickValue = value;
            }
            else if(totalTicks <= 20) {
                // Show every other year, with smart first/last
                const year = parseInt(value);
                const isDivisibleBy2 = year % 2 === 0;
                const isFirst = index === 0;
                const isLast = index === totalTicks - 1;

                // Only show first/last if they're at least 2 years from nearest even year
                if(isDivisibleBy2 || (isFirst && year % 2 !== 0) || (isLast && year % 2 !== 0)) {
                    tickValue = value;
                }
            }
            else if(totalTicks <= 50) {
                // Show every 5th year, with smart first/last
                const year = parseInt(value);
                const isDivisibleBy5 = year % 5 === 0;
                const isFirst = index === 0;
                const isLast = index === totalTicks - 1;
                const yearMod = year % 5;

                // Only show first/last if they're at least 2 years from nearest multiple of 5
                // yearMod of 1 or 4 means too close (only 1 year away), 2 or 3 means far enough
                if(
                    isDivisibleBy5 ||
                    (isFirst && yearMod >= 2 && yearMod <= 3) ||
                    (isLast && yearMod >= 2 && yearMod <= 3)
                ) {
                    tickValue = value;
                }
            }
            else {
                // Show every 10th year with 2-digit format, with smart first/last
                const year = parseInt(value);
                const isDivisibleBy10 = year % 10 === 0;
                const isFirst = index === 0;
                const isLast = index === totalTicks - 1;
                const yearMod = year % 10;

                // Only show first/last if they're at least 3 years from nearest multiple of 10
                if(
                    isDivisibleBy10 ||
                    (isFirst && yearMod >= 3 && yearMod <= 7) ||
                    (isLast && yearMod >= 3 && yearMod <= 7)
                ) {
                    tickValue = year.toString().slice(-2);
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
            if(totalTicks <= 31) {
                // Show every day for a month or less
                tickValue = day.toString();
            }
            else if(totalTicks <= 62) {
                // Show every other day for ~2 months
                if(day % 2 === 1) {
                    tickValue = day.toString();
                }
            }
            else if(totalTicks <= 90) {
                // Show every 3rd day for ~3 months
                if(day % 3 === 0 || day === 1) {
                    tickValue = day.toString();
                }
            }
            else if(totalTicks <= 180) {
                // Show every 5th day for ~6 months
                if(day % 5 === 0 || day === 1) {
                    tickValue = day.toString();
                }
            }
            else {
                // For a full year (365 days), show day 1 and 15 of each month
                if(day === 1 || day === 15) {
                    tickValue = day.toString();
                }
            }
        }
        else if(type === 'secondary') {
            // Show month name when month changes
            if(index === 0) {
                // Always show first tick
                tickValue = monthAbbreviation(date.getMonth() + 1);
            }
            else if(previousDate && date.getMonth() !== previousDate.getMonth()) {
                // Show when month actually changes from previous tick
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

        if(type === 'primary') {
            // Format hour in 12-hour format
            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const minuteString = `${hour12}:${String(minute).padStart(2, '0')}`;

            // Show all ticks (filtering is done by calculateTickInterval)
            tickValue = minuteString;
        }
        else if(type === 'secondary') {
            const isFirstTick = index === 0;
            const isEvery3Hours = minute === 0 && hour % 3 === 0; // Show every 3 hours on the hour

            // Only show labels at: first tick or every 3 hours on the hour
            if(isFirstTick || isEvery3Hours) {
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
            const weekNumber = parseInt(weekMatch[2]!, 10); // Parse to remove leading zeros
            const previousYear = previousTickValue.slice(0, 4);

            if(type === 'primary') {
                // Show all ticks that are rendered (calculateTickInterval already filtered them)
                tickValue = `W${weekNumber}`;
            }
            else if(type === 'secondary') {
                if(index === 0 || year !== previousYear) {
                    tickValue = year;
                }
            }
        }
    }
    // Handle HourOfDay (0-23)
    else if(timeInterval === TimeInterval.HourOfDay) {
        const hour = parseInt(value, 10);

        if(type === 'primary') {
            if(totalTicks <= 24) {
                // Show all hours
                const hourString = hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`;
                tickValue = hourString;
            }
            else {
                // Show every 3 hours
                if(hour % 3 === 0) {
                    const hourString =
                        hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`;
                    tickValue = hourString;
                }
            }
        }
    }
    // Handle DayOfWeek
    else if(timeInterval === TimeInterval.DayOfWeek) {
        if(type === 'primary') {
            // Use the bucket name from the server as-is (Sunday, Monday, etc.)
            tickValue = value;
        }
    }
    // Handle DayOfMonth (1-31)
    else if(timeInterval === TimeInterval.DayOfMonth) {
        if(type === 'primary') {
            const day = parseInt(value, 10);
            if(totalTicks <= 31) {
                tickValue = day.toString();
            }
            else {
                // Show every 5th day
                if(day % 5 === 0 || day === 1) {
                    tickValue = day.toString();
                }
            }
        }
    }
    // Handle MonthOfYear
    else if(timeInterval === TimeInterval.MonthOfYear) {
        if(type === 'primary') {
            // Value could be "1"-"12" or "January"-"December"
            const monthNumber = parseInt(value, 10);
            if(!isNaN(monthNumber)) {
                tickValue = monthAbbreviation(monthNumber);
            }
            else {
                // If already a string like "January", use first 3 chars
                tickValue = value.slice(0, 3);
            }
        }
    }
    // Handle WeekOfYear (1-52)
    else if(timeInterval === TimeInterval.WeekOfYear) {
        if(type === 'primary') {
            const weekMatch = value.match(/^W?(\d+)$/);
            const week = weekMatch ? parseInt(weekMatch[1]!, 10) : parseInt(value, 10);

            if(totalTicks <= 20) {
                tickValue = `W${week}`;
            }
            else {
                // Show every 4th week
                if(week % 4 === 0 || week === 1) {
                    tickValue = `W${week}`;
                }
            }
        }
    }

    return tickValue;
}

// Calculate tick interval based on data density
export function calculateTickInterval(dataLength: number, timeInterval?: TimeInterval): number {
    // For Minute interval, show ticks based on total range
    if(timeInterval === TimeInterval.Minute) {
        if(dataLength > 360) {
            // For 6+ hours, show every hour (every 60th minute)
            return 59; // 0-indexed, so 59 means every 60th item
        }
        else if(dataLength > 120) {
            // For 2-6 hours, show every 30 minutes
            return 29; // Every 30th item
        }
        else if(dataLength > 60) {
            // For 1-2 hours, show every 15 minutes
            return 14; // Every 15th item
        }
        else if(dataLength > 15) {
            // For less than 1 hour, show every 5 minutes
            return 4; // Every 5th item
        }
        return 0; // Show all ticks for very short ranges
    }

    // For Day interval, control ticks based on range
    if(timeInterval === TimeInterval.Day) {
        if(dataLength > 180) {
            // For full year, render all ticks but let formatAxisTick control which show labels
            return 0; // Show all ticks
        }
        else if(dataLength > 90) {
            return 1; // Every other day
        }
        else if(dataLength > 30) {
            return 0; // Show all days
        }
        return 0; // Show all days
    }

    // For Week interval, control tick rendering based on range
    if(timeInterval === TimeInterval.Week) {
        // ≤52 weeks (1 year): Show every 4th week (~13 ticks)
        if(dataLength <= 52) {
            return 3; // Every 4th week
        }
        // 53-104 weeks (1-2 years): Show every 8th week (~13 ticks)
        else if(dataLength <= 104) {
            return 7; // Every 8th week
        }
        // 105-156 weeks (2-3 years): Show every 12th week (~13 ticks)
        else if(dataLength <= 156) {
            return 11; // Every 12th week
        }
        // >156 weeks: Show every 16th week
        else {
            return 15; // Every 16th week
        }
    }

    // For DayOfWeek interval, always show all 7 days
    if(timeInterval === TimeInterval.DayOfWeek) {
        return 0; // Show all 7 days
    }

    // For DayOfMonth interval, always show all 31 days
    if(timeInterval === TimeInterval.DayOfMonth) {
        return 0; // Show all 31 days
    }

    // Default logic for other intervals
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
