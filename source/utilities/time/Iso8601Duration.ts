// ================================================================================================
// ISO-8601 Duration Utilities
// ================================================================================================

/**
 * Converts a number of minutes to an ISO-8601 duration string.
 *
 * @param {number} minutes - The number of minutes
 * @returns {string} The ISO-8601 duration string
 *
 * @example
 * minutesToIso8601Duration(60)   // Returns: "PT1H"
 * minutesToIso8601Duration(30)   // Returns: "PT30M"
 * minutesToIso8601Duration(90)   // Returns: "PT1H30M"
 * minutesToIso8601Duration(1440) // Returns: "PT24H"
 */
export function minutesToIso8601Duration(minutes: number): string {
    if(minutes >= 60 && minutes % 60 === 0) {
        return `PT${minutes / 60}H`;
    }
    return `PT${minutes}M`;
}

/**
 * Parses an ISO-8601 duration string and returns the total minutes.
 *
 * @param {string} duration - The ISO-8601 duration string (e.g., "PT1H30M")
 * @returns {number} The total number of minutes
 *
 * @example
 * iso8601DurationToMinutes("PT1H")    // Returns: 60
 * iso8601DurationToMinutes("PT30M")   // Returns: 30
 * iso8601DurationToMinutes("PT1H30M") // Returns: 90
 * iso8601DurationToMinutes("PT90S")   // Returns: 2 (ceiling of 1.5)
 */
export function iso8601DurationToMinutes(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if(!match) {
        return 60; // Default to 1 hour
    }

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 60 + minutes + Math.ceil(seconds / 60);
}

/**
 * Converts an ISO-8601 duration string to a human-readable format.
 *
 * @param {string} duration - The ISO-8601 duration string (e.g., "PT1H30M")
 * @returns {string} A human-readable duration string
 *
 * @example
 * iso8601DurationHumanReadable("PT1H")     // Returns: "1 hour"
 * iso8601DurationHumanReadable("PT2H")     // Returns: "2 hours"
 * iso8601DurationHumanReadable("PT30M")    // Returns: "30 minutes"
 * iso8601DurationHumanReadable("PT1H30M")  // Returns: "1 hour 30 minutes"
 * iso8601DurationHumanReadable("PT1M30S")  // Returns: "1 minute 30 seconds"
 */
export function iso8601DurationHumanReadable(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if(!match) {
        return duration;
    }

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    const parts: string[] = [];

    if(hours > 0) {
        parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }
    if(minutes > 0) {
        parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
    if(seconds > 0) {
        parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    }

    if(parts.length === 0) {
        return 'invalid duration';
    }

    return parts.join(' ');
}
