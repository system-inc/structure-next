/**
 * Function to convert a timestamp (in milliseconds since the Unix epoch) into a
 * human-readable string representing time from now (past or future).
 *
 * @param {number} millisecondsSinceUnixEpoch - The timestamp to convert, represented as milliseconds since the Unix epoch.
 * @param {boolean} abbreviated - Whether to return an abbreviated format (e.g., "7s" instead of "7 seconds ago").
 * @returns {string} A string representing the time from now in a human-readable format.
 */
export function timeFromNow(millisecondsSinceUnixEpoch: number, abbreviated: boolean = false) {
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

// Function to convert a date object into the format January 12, 2020
export function fullDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Function to convert a date object into the format Friday, January 12, 2020
export function dayNameWithFullDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Function to convert a date object into the format January 12, 2020 at 3:30 PM
export function fullDateWithTime(date: Date) {
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

// Function to convert a date object into the ISO 8601 format 2020-01-12
export function iso8601Date(date: Date) {
    return date.toISOString().split('T')[0];
}

// Function to convert a date object into the format 2020-01-12 12:30 PM
export function iso8601DateWithTime(date: Date) {
    return (
        date.toISOString().split('T')[0] +
        ' ' +
        date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        })
    );
}

// Function to convert a date object into January 2024
export function monthYear(date: Date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
}

// Function to format the date with time if the date is today, otherwise just the date
export function formatDateWithTimeIfToday(date: Date): string {
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

// Function to format the date to "Today", "Yesterday", or the date
// Example: "Today" or "Yesterday" or "Wednesday, March 26"
export function formatDateToTodayYesterdayOrDate(date: Date): string {
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

// Function to format the date to a short date with time
// Example: "Feb 12, 2025 at 12:12 pm"
export function formatDateToShortDateWithTime(date: Date): string {
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

// Function to format the date to just show the time and am/pm
// If the date is today or yesterday, it will show "Today" or "Yesterday" in front of the time
// If not today or yesterday, it will show just the time
// Example: "Today, 12:45 am" or "Yesterday, 3:30 pm" or "3:30 pm"
export function formatDateToTimeWithTodayOrYesterday(date: Date): string {
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

// Function to format the date to show the date and time using date "at" time
// If the date is today or yesterday, it will show "Today" or "Yesterday" in front of the time
// If not today or yesterday, it will show the date in front of the time
// Example: "Today at 12:45 am" or "Yesterday at 3:30 pm" or "Jan 12, 2025 at 3:30 pm"
export function formatDateToDateAtTime(date: Date): string {
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

// Function to format the date to show the day of the ween and the date
// Example: "Mon, Jan 12, 2025"
export function formatDateToDayOfWeekAndDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// Function to format the date to just show the time and am/pm
// Example: "12:45 am" or "3:30 pm"
export function formatDateOnlyTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Function to convert milliseconds into Years:Months:Days:Hours:Minutes:Seconds
// It will not show leading zeros for hours or minutes, but always show minutes and seconds
export function millisecondsToDuration(milliseconds: number) {
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
