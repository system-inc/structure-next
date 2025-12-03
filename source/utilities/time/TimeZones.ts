// ================================================================================================
// Time Zone Utilities
// ================================================================================================

/**
 * Gets the current UTC offset for a time zone (e.g., "UTC-5", "UTC+9", "UTC+0").
 *
 * @param {string} timeZone - IANA time zone identifier (e.g., "America/New_York")
 * @returns {string} The UTC offset string
 */
export function timeZoneOffset(timeZone: string): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const offset =
        parts.find(function (part) {
            return part.type === 'timeZoneName';
        })?.value || '';

    // Convert GMT to UTC and ensure +0 for consistency
    if(offset === 'GMT') {
        return 'UTC+0';
    }

    return offset.replace('GMT', 'UTC');
}

/**
 * Formats a time zone identifier for display (e.g., "America/New_York" -> "New York").
 *
 * @param {string} timeZone - IANA time zone identifier
 * @returns {string} Human-readable city/region name
 */
export function formatTimeZoneName(timeZone: string): string {
    // Get the city part (after the last slash)
    const parts = timeZone.split('/');
    const city = parts[parts.length - 1] || timeZone;
    // Replace underscores with spaces
    return city.replace(/_/g, ' ');
}

/**
 * Formats a time zone identifier with full path for display
 * (e.g., "America/New_York" -> "America / New York").
 *
 * @param {string} timeZone - IANA time zone identifier
 * @returns {string} Human-readable full path
 */
export function formatTimeZoneFullPath(timeZone: string): string {
    return timeZone.replace(/_/g, ' ').replace(/\//g, ' / ');
}

/**
 * Gets the user's current time zone from the browser.
 *
 * @returns {string} IANA time zone identifier (e.g., "America/New_York")
 */
export function userTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Type for time zone option
export interface TimeZoneMenuItemInterface {
    value: string;
    children: string;
}

/**
 * Gets all available time zones as options for a select component.
 * Time zones are sorted by UTC offset, then alphabetically by name.
 * Includes UTC at the beginning of the list.
 *
 * @returns {TimeZoneMenuItemInterface[]} Array of time zone options with value and display label
 */
export function timeZoneMenuItems(): TimeZoneMenuItemInterface[] {
    // Get all IANA time zones and add UTC (which is not included by default)
    const timeZones = ['UTC', ...Intl.supportedValuesOf('timeZone')];

    // Build options with offset for sorting
    const optionsWithOffset = timeZones.map(function (timeZone) {
        const offset = timeZoneOffset(timeZone);
        const fullPath = formatTimeZoneFullPath(timeZone);

        // Parse offset for sorting (e.g., "UTC-5" -> -5, "UTC+9" -> 9)
        let offsetMinutes = 0;
        const offsetMatch = offset.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
        if(offsetMatch) {
            const sign = offsetMatch[1] === '+' ? 1 : -1;
            const hours = parseInt(offsetMatch[2] || '0');
            const minutes = parseInt(offsetMatch[3] || '0');
            offsetMinutes = sign * (hours * 60 + minutes);
        }

        return {
            value: timeZone,
            children: `(${offset}) ${fullPath}`,
            offsetMinutes,
            fullPath,
        };
    });

    // Sort by offset, then alphabetically by full path
    optionsWithOffset.sort(function (a, b) {
        if(a.offsetMinutes !== b.offsetMinutes) {
            return a.offsetMinutes - b.offsetMinutes;
        }
        return a.fullPath.localeCompare(b.fullPath);
    });

    // Return without the sorting helper fields
    return optionsWithOffset.map(function (option) {
        return {
            value: option.value,
            children: option.children,
        };
    });
}
