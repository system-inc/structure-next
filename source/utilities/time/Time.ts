// ================================================================================================
// Date Formatting
// ================================================================================================

/**
 * Formats a date as ISO 8601 format (YYYY-MM-DD).
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 *
 * @example
 * dateIso8601(new Date('2025-01-15T14:30:00'))
 * // Returns: "2025-01-15"
 */
export function dateIso8601(date: Date): string {
    return date.toISOString().split('T')[0] || '';
}

/**
 * Formats a date with full month name, day, and year.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 *
 * @example
 * dateFull(new Date('2025-01-15'))
 * // Returns: "January 15, 2025"
 */
export function dateFull(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Formats a date with weekday name, full month, day, and year.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 *
 * @example
 * weekdayDate(new Date('2025-01-15'))
 * // Returns: "Wednesday, January 15, 2025"
 */
export function weekdayDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Formats a date with abbreviated weekday, month, day, and year.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 *
 * @example
 * weekdayDateCompact(new Date('2025-01-15'))
 * // Returns: "Wed, Jan 15, 2025"
 */
export function weekdayDateCompact(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Formats a date as month and year only.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted month and year
 *
 * @example
 * monthYear(new Date('2025-01-15'))
 * // Returns: "January 2025"
 */
export function monthYear(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
}

// ================================================================================================
// Date with Contextual Formatting
// ================================================================================================

/**
 * Formats a date as "Today", "Yesterday", or the full date.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 *
 * @example
 * dateToTodayYesterdayOrDate(new Date()) // Returns: "Today"
 * dateToTodayYesterdayOrDate(yesterday)  // Returns: "Yesterday"
 * dateToTodayYesterdayOrDate(oldDate)    // Returns: "Wednesday, March 26"
 */
export function dateToTodayYesterdayOrDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if(messageDate.getTime() === today.getTime()) {
        return 'Today';
    }
    else if(messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }
    else {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }
}

/**
 * Formats a date showing time if today, otherwise shows the date.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted string
 *
 * @example
 * dateToTimeIfTodayOrDate(new Date()) // Returns: "2:30 PM" (if today)
 * dateToTimeIfTodayOrDate(oldDate)    // Returns: "Jan 15" (if not today)
 */
export function dateToTimeIfTodayOrDate(date: Date): string {
    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if(isToday) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour = hours % 12 || 12; // Convert 0 to 12
        return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ================================================================================================
// Date and Time Formatting
// ================================================================================================

/**
 * Formats a date with ISO date and 12-hour time.
 *
 * @param {Date} date - The date to format
 * @param {boolean} [useLocalTimezone=false] - Whether to use local timezone for the date portion
 * @returns {string} The formatted date and time string
 *
 * @example
 * dateIso8601WithTime(new Date('2025-01-15T14:30:00'))
 * // Returns: "2025-01-15 2:30 PM" (UTC date, local time)
 *
 * dateIso8601WithTime(new Date('2025-01-15T14:30:00'), true)
 * // Returns: "2025-01-15 2:30 PM" (local date and time)
 */
export function dateIso8601WithTime(date: Date, useLocalTimezone: boolean = false): string {
    let isoDate: string;

    if(useLocalTimezone) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        isoDate = `${year}-${month}-${day}`;
    }
    else {
        isoDate = date.toISOString().split('T')[0] || '';
    }

    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return `${isoDate} ${time}`;
}

/**
 * Formats a date with full date and time using "at" separator.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date and time string
 *
 * @example
 * dateTimeFull(new Date('2025-01-15T14:30:00'))
 * // Returns: "January 15, 2025 at 2:30 PM"
 */
export function dateTimeFull(date: Date): string {
    return (
        date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) +
        ' at ' +
        date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        })
    );
}

/**
 * Formats a date with compact date and time using "at" separator.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date and time string
 *
 * @example
 * dateTimeCompact(new Date('2025-01-15T14:30:00'))
 * // Returns: "Jan 15, 2025 at 2:30 pm"
 */
export function dateTimeCompact(date: Date): string {
    const timeString = date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        })
        .toLowerCase();

    return (
        date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }) +
        ' at ' +
        timeString
    );
}

/**
 * Formats a date with contextual prefix (Today/Yesterday/Date) and time.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted date and time string
 *
 * @example
 * dateAtTime(new Date())    // Returns: "Today at 2:30 pm"
 * dateAtTime(yesterday)     // Returns: "Yesterday at 3:45 pm"
 * dateAtTime(oldDate)       // Returns: "Jan 15, 2025 at 2:30 pm"
 */
export function dateAtTime(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let prefix = '';
    if(inputDate.getTime() === today.getTime()) {
        prefix = 'Today at ';
    }
    else if(inputDate.getTime() === yesterday.getTime()) {
        prefix = 'Yesterday at ';
    }
    else {
        prefix =
            date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }) + ' at ';
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${prefix}${formattedHours}:${formattedMinutes} ${ampm}`;
}

// ================================================================================================
// Time Formatting
// ================================================================================================

/**
 * Formats a date to show only the time in 12-hour format.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted time string
 *
 * @example
 * timeOnly(new Date('2025-01-15T14:30:00')) // Returns: "2:30 pm"
 * timeOnly(new Date('2025-01-15T09:05:00')) // Returns: "9:05 am"
 */
export function timeOnly(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
}

/**
 * Formats time with contextual day prefix (Today/Yesterday) if applicable.
 *
 * @param {Date} date - The date to format
 * @returns {string} The formatted time string with optional day prefix
 *
 * @example
 * dateToTimeWithTodayOrYesterday(new Date())  // Returns: "Today, 2:30 pm"
 * dateToTimeWithTodayOrYesterday(yesterday)   // Returns: "Yesterday, 3:45 pm"
 * dateToTimeWithTodayOrYesterday(oldDate)     // Returns: "2:30 pm"
 */
export function dateToTimeWithTodayOrYesterday(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let prefix = '';
    if(inputDate.getTime() === today.getTime()) {
        prefix = 'Today, ';
    }
    else if(inputDate.getTime() === yesterday.getTime()) {
        prefix = 'Yesterday, ';
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${prefix}${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Formats an hour value (0-23) to compact 12-hour format with am/pm.
 *
 * @param {number} hour - The hour in 24-hour format (0-23)
 * @returns {string} The formatted hour string
 *
 * @example
 * hourCompact(0)   // Returns: "12am"
 * hourCompact(9)   // Returns: "9am"
 * hourCompact(12)  // Returns: "12pm"
 * hourCompact(15)  // Returns: "3pm"
 */
export function hourCompact(hour: number): string {
    if(hour === 0) return '12am';
    if(hour < 12) return `${hour}am`;
    if(hour === 12) return '12pm';
    return `${hour - 12}pm`;
}

// ================================================================================================
// Relative Time
// ================================================================================================

/**
 * Converts a timestamp to a human-readable relative time string.
 *
 * @param {number} millisecondsSinceUnixEpoch - The timestamp in milliseconds since Unix epoch
 * @param {boolean} [abbreviated=false] - Whether to use abbreviated format
 * @returns {string} The relative time string
 *
 * @example
 * timeFromNow(Date.now() - 5000)        // Returns: "5 seconds ago"
 * timeFromNow(Date.now() - 3600000)     // Returns: "1 hour ago"
 * timeFromNow(Date.now() - 3600000, true) // Returns: "1h"
 * timeFromNow(Date.now() + 86400000)    // Returns: "in 1 day"
 */
export function timeFromNow(millisecondsSinceUnixEpoch: number, abbreviated: boolean = false): string {
    const delta = new Date().getTime() - millisecondsSinceUnixEpoch;
    const isPast = delta > 0;
    const abs = Math.abs(delta);

    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(abs / (1000 * 60));
    const hours = Math.floor(abs / (1000 * 60 * 60));
    const days = Math.floor(abs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(abs / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(abs / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(abs / (1000 * 60 * 60 * 24 * 365));

    // Helper function to format the output
    const formatTimeFromNow = function (value: number, unit: string, abbreviation: string) {
        if(abbreviated) {
            return `${value}${abbreviation}`;
        }
        const plural = value === 1 ? '' : 's';
        return isPast ? `${value} ${unit}${plural} ago` : `in ${value} ${unit}${plural}`;
    };

    if(seconds <= 5) return 'now';
    if(seconds < 60) return formatTimeFromNow(seconds, 'second', 's');
    if(minutes < 60) return formatTimeFromNow(minutes, 'minute', 'm');
    if(hours < 24) return formatTimeFromNow(hours, 'hour', 'h');
    if(days < 7) return formatTimeFromNow(days, 'day', 'd');
    if(weeks < 4) return formatTimeFromNow(weeks, 'week', 'w');
    if(months < 1) return formatTimeFromNow(weeks, 'week', 'w');
    if(months < 12) return formatTimeFromNow(months, 'month', 'mo');
    return formatTimeFromNow(years, 'year', 'y');
}

// ================================================================================================
// Duration Formatting
// ================================================================================================

/**
 * Converts milliseconds to a duration string format.
 *
 * @param {number} milliseconds - The duration in milliseconds
 * @returns {string} The formatted duration string
 *
 * @example
 * millisecondsToDuration(3661000) // Returns: "1:1:01" (1 hour, 1 minute, 1 second)
 * millisecondsToDuration(90000)   // Returns: "1:30" (1 minute, 30 seconds)
 * millisecondsToDuration(5000)    // Returns: "0:05" (5 seconds)
 */
export function millisecondsToDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);

    const years = Math.floor(seconds / (365 * 24 * 3600));
    const remainingAfterYears = seconds % (365 * 24 * 3600);

    const months = Math.floor(remainingAfterYears / (30 * 24 * 3600));
    const remainingAfterMonths = remainingAfterYears % (30 * 24 * 3600);

    const days = Math.floor(remainingAfterMonths / (24 * 3600));
    const remainingAfterDays = remainingAfterMonths % (24 * 3600);

    const hours = Math.floor(remainingAfterDays / 3600);
    const remainingAfterHours = remainingAfterDays % 3600;

    const minutes = Math.floor(remainingAfterHours / 60);
    const remainingSeconds = remainingAfterHours % 60;

    const parts = [];

    if(years > 0) parts.push(`${years}`);
    if(months > 0) parts.push(`${months}`);
    if(days > 0) parts.push(`${days}`);
    if(hours > 0) parts.push(`${hours}`);

    // Always show minutes and seconds
    parts.push(`${minutes}`);
    parts.push(`${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);

    return parts.join(':');
}

// ================================================================================================
// Month Helpers
// ================================================================================================

/**
 * Gets the abbreviated month name for a given month number (1-based).
 *
 * @param {number} month - The month number (1 = January, 12 = December)
 * @returns {string} The three-letter abbreviated month name
 *
 * @example
 * monthAbbreviation(1)  // Returns: "Jan"
 * monthAbbreviation(6)  // Returns: "Jun"
 * monthAbbreviation(12) // Returns: "Dec"
 */
export function monthAbbreviation(month: number): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Convert from 1-based to 0-based index
    return monthNames[month - 1] || '';
}
