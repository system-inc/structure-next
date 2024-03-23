/**
 * Function to convert a timestamp (in milliseconds since the Unix epoch) into a
 * human-readable "time ago" string. The output string represents the elapsed time
 * (in seconds, minutes, hours, days, weeks, months, or years) since the provided timestamp.
 *
 * @param {number} millisecondsSinceUnixEpoch - The timestamp to convert, represented as milliseconds since the Unix epoch.
 * @returns {string} A string representing the elapsed time since the timestamp in a human-readable format.
 */
export function getTimeAgoString(millisecondsSinceUnixEpoch: number) {
    const deltaMillisecondsSinceUnixEpoch = new Date().getTime() - millisecondsSinceUnixEpoch;

    const secondsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / 1000).toFixed(0);
    const minutesAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60)).toFixed(0);
    const hoursAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60)).toFixed(0);
    const daysAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24)).toFixed(0);
    const weeksAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
    const monthsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 30)).toFixed(0);
    const yearsAgo = Math.floor(deltaMillisecondsSinceUnixEpoch / (1000 * 60 * 60 * 24 * 365)).toFixed(0);

    if(Number(secondsAgo) < 5) {
        return `now`;
    }
    if(Number(secondsAgo) < 60) {
        return `${secondsAgo} second${Number(secondsAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(minutesAgo) < 60) {
        return `${minutesAgo} minute${Number(minutesAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(hoursAgo) < 24) {
        return `${hoursAgo} hour${Number(hoursAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(daysAgo) < 7) {
        return `${daysAgo} day${Number(daysAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(weeksAgo) < 4) {
        return `${weeksAgo} week${Number(weeksAgo) === 1 ? '' : 's'} ago`;
    }
    if(Number(monthsAgo) < 12) {
        return `${monthsAgo} month${Number(monthsAgo) === 1 ? '' : 's'} ago`;
    }

    return `${yearsAgo} year${Number(yearsAgo) === 1 ? '' : 's'} ago`;
}
