/**
 * Function to convert a timestamp (in milliseconds since the Unix epoch) into a
 * human-readable "time ago" string. The output string represents the elapsed time
 * (in seconds, minutes, hours, days, weeks, months, or years) since the provided timestamp.
 *
 * @param {number} millisecondsSinceUnixEpoch - The timestamp to convert, represented as milliseconds since the Unix epoch.
 * @param {boolean} abbreviated - Whether to return an abbreviated format (e.g., "7s" instead of "7 seconds ago").
 * @returns {string} A string representing the elapsed time since the timestamp in a human-readable format.
 */
export function timeAgo(millisecondsSinceUnixEpoch: number, abbreviated: boolean = false) {
    const deltaMillisecondsSinceUnixEpoch = new Date().getTime() - millisecondsSinceUnixEpoch;

    const secondsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / 1000).toFixed(0);
    const minutesAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60)).toFixed(0);
    const hoursAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60)).toFixed(0);
    const daysAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24)).toFixed(0);
    const weeksAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
    const monthsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
    const yearsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 365)).toFixed(0);

    if(Number(secondsAgo) < 5) {
        return abbreviated ? `now` : `now`;
    }
    if(Number(secondsAgo) < 60) {
        return abbreviated ? `${secondsAgo}s` : `${secondsAgo} second${Number(secondsAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(minutesAgo) < 60) {
        return abbreviated ? `${minutesAgo}m` : `${minutesAgo} minute${Number(minutesAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(hoursAgo) < 24) {
        return abbreviated ? `${hoursAgo}h` : `${hoursAgo} hour${Number(hoursAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(daysAgo) < 7) {
        return abbreviated ? `${daysAgo}d` : `${daysAgo} day${Number(daysAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(weeksAgo) < 4) {
        return abbreviated ? `${weeksAgo}w` : `${weeksAgo} week${Number(weeksAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(monthsAgo) < 1) {
        return abbreviated ? `${weeksAgo}w` : `${weeksAgo} week${Number(weeksAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(monthsAgo) < 12) {
        return abbreviated ? `${monthsAgo}mo` : `${monthsAgo} month${Number(monthsAgo) === 1 ? '' : 's'} ago`;
    }

    return abbreviated ? `${yearsAgo}y` : `${yearsAgo} year${Number(yearsAgo) === 1 ? '' : 's'} ago`;
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

// Function to convert a date object into January 2024
export function monthYear(date: Date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
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
