// Utilities - EngagementEventsActivityUtilities
import { timeFromNow } from '@structure/source/utilities/time/Time';
import { differenceInSeconds } from 'date-fns';

// Creates attribution message from entrance page, referrer, and UTM parameters
export function getAttributionMessage(referrer?: string, viewIdentifier?: string): string | null {
    // Parse UTM parameters from viewIdentifier if available
    let utmSource = '';
    let utmMedium = '';
    let utmCampaign = '';

    if(viewIdentifier && viewIdentifier.includes('?')) {
        const queryString = viewIdentifier.split('?')[1];
        if(queryString) {
            const params = new URLSearchParams(queryString);
            utmSource = params.get('utm_source') || '';
            utmMedium = params.get('utm_medium') || '';
            utmCampaign = params.get('utm_campaign') || '';
        }
    }

    // Get entrance page path (without query params for cleaner display)
    const entrancePage = viewIdentifier ? viewIdentifier.split('?')[0] : null;

    // Priority 1: UTM parameters (best attribution)
    if(utmSource || utmCampaign) {
        const parts = [];

        if(utmCampaign) {
            parts.push(utmCampaign);
        }
        else if(utmSource) {
            const sourceName = utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
            parts.push(sourceName);
        }

        if(utmMedium) {
            if(utmMedium === 'cpc' || utmMedium === 'paid') {
                parts.push('Ad');
            }
            else if(utmMedium === 'email') {
                parts.push('Email');
            }
            else if(utmMedium === 'social') {
                parts.push('Social');
            }
            else {
                parts.push(utmMedium);
            }
        }

        return parts.join(' ');
    }

    // Priority 2: Entrance page + Referrer domain
    if(entrancePage && referrer) {
        const referrerDomain = parseReferrerDomain(referrer);
        if(referrerDomain) {
            return `${entrancePage} from ${referrerDomain}`;
        }
    }

    // Priority 3: Just entrance page
    if(entrancePage) {
        return entrancePage;
    }

    // Priority 4: Just referrer domain
    if(referrer) {
        const referrerDomain = parseReferrerDomain(referrer);
        if(referrerDomain) {
            return `from ${referrerDomain}`;
        }
    }

    return null;
}

// Helper function to parse referrer domain to friendly name
function parseReferrerDomain(referrer: string): string | null {
    try {
        const url = new URL(referrer);
        const domain = url.hostname.replace('www.', '');

        // Map common domains to friendly names
        const domainMap: Record<string, string> = {
            'facebook.com': 'Facebook',
            'instagram.com': 'Instagram',
            'twitter.com': 'Twitter',
            'x.com': 'X (Twitter)',
            'linkedin.com': 'LinkedIn',
            'google.com': 'Google',
            'bing.com': 'Bing',
            'yahoo.com': 'Yahoo',
            't.co': 'Twitter',
            'youtube.com': 'YouTube',
            'reddit.com': 'Reddit',
        };

        return domainMap[domain] || domain;
    } catch {
        return null;
    }
}

// Export function to get referrer name for display
export function getReferrerName(referrer?: string): string | null {
    if(!referrer) {
        return null;
    }
    return parseReferrerDomain(referrer);
}

// Determines referrer icon based on referrer URL
export function getReferrerIconType(
    referrer?: string,
): 'youtube' | 'instagram' | 'x' | 'reddit' | 'facebook' | 'google' | 'linkedin' | null {
    if(!referrer) {
        return null;
    }

    try {
        const url = new URL(referrer);
        const domain = url.hostname.replace('www.', '');

        if(domain.includes('youtube.com')) {
            return 'youtube';
        }
        if(domain.includes('instagram.com')) {
            return 'instagram';
        }
        if(domain.includes('x.com') || domain.includes('twitter.com') || domain.includes('t.co')) {
            return 'x';
        }
        if(domain.includes('reddit.com')) {
            return 'reddit';
        }
        if(domain.includes('facebook.com')) {
            return 'facebook';
        }
        if(domain.includes('google.com')) {
            return 'google';
        }
        if(domain.includes('linkedin.com')) {
            return 'linkedin';
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Parses a date string from the database that may lack timezone information.
 * Database dates are in UTC but don't always have timezone markers, so we append 'Z' for UTC interpretation.
 */
export function parseUtcDateString(dateString: string): Date {
    let formattedDateString = dateString;

    // If the string doesn't have timezone info and doesn't have 'T' separator
    if(!formattedDateString.endsWith('Z') && !formattedDateString.includes('+') && !formattedDateString.includes('T')) {
        // Convert space-separated format to ISO format and add UTC marker
        formattedDateString = formattedDateString.replace(' ', 'T') + 'Z';
    }
    // If it has 'T' separator but no timezone marker
    else if(
        formattedDateString.includes('T') &&
        !formattedDateString.endsWith('Z') &&
        !formattedDateString.includes('+')
    ) {
        formattedDateString = formattedDateString + 'Z';
    }

    return new Date(formattedDateString);
}

// Calculates session duration from visit start time to last activity time
export function calculateSessionDuration(visitStartAt?: string, lastActivityTime?: string): string {
    if(!visitStartAt || !lastActivityTime) {
        return 'Unknown';
    }

    const startTime = parseUtcDateString(visitStartAt);
    const endTime = parseUtcDateString(lastActivityTime);
    const seconds = differenceInSeconds(endTime, startTime);

    if(seconds === 0) {
        return 'New';
    }

    if(seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if(minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours}h`;
}

// Formats time ago from a date string with "ago" suffix
export function formatTimeAgo(dateString?: string): string {
    if(!dateString) {
        return 'Unknown';
    }

    const date = parseUtcDateString(dateString);
    const timeAgo = timeFromNow(date.getTime(), true);

    // timeFromNow returns "now" for very recent times, don't add "ago" to that
    if(timeAgo === 'now') {
        return timeAgo;
    }

    return `${timeAgo} ago`;
}

// Formats location string from city and region
export function formatLocation(city?: string, region?: string, country?: string): string {
    if(!city && !region && !country) {
        return 'Unknown';
    }

    const parts = [];
    if(city) parts.push(city);
    if(region) parts.push(region);
    // Only add country if we don't have city/region, or if it's international
    if(country && !city && !region) {
        parts.push(country);
    }

    return parts.join(', ') || 'Unknown';
}

// Determines platform icon based on operating system
export function getPlatformIconType(operatingSystem?: string): 'apple' | 'android' | 'windows' | 'linux' | null {
    if(!operatingSystem) {
        return null;
    }

    const osLower = operatingSystem.toLowerCase();

    if(osLower.includes('ios') || osLower.includes('mac')) {
        return 'apple';
    }
    if(osLower.includes('android')) {
        return 'android';
    }
    if(osLower.includes('windows')) {
        return 'windows';
    }
    if(osLower.includes('linux')) {
        return 'linux';
    }

    return null;
}

// Determines device type icon based on device category with OS fallback
export function getDeviceTypeIconType(
    deviceCategory?: string,
    operatingSystem?: string,
): 'desktop' | 'mobile' | 'tablet' | null {
    // Try device category first
    if(deviceCategory) {
        const categoryLower = deviceCategory.toLowerCase();

        if(categoryLower.includes('desktop') || categoryLower.includes('computer')) {
            return 'desktop';
        }
        if(categoryLower.includes('tablet')) {
            return 'tablet';
        }
        if(categoryLower.includes('mobile') || categoryLower.includes('phone')) {
            return 'mobile';
        }
    }

    // Fall back to OS detection - desktop OSes likely mean desktop device
    if(operatingSystem) {
        const osLower = operatingSystem.toLowerCase();

        // macOS, Windows, Linux are typically desktop
        if(osLower.includes('mac') && !osLower.includes('ios')) {
            return 'desktop';
        }
        if(osLower.includes('windows') || osLower.includes('linux')) {
            return 'desktop';
        }

        // iOS is mobile/tablet
        if(osLower.includes('ios')) {
            return 'mobile';
        }

        // Android could be mobile or tablet, default to mobile
        if(osLower.includes('android')) {
            return 'mobile';
        }
    }

    return null;
}

// Truncates a path to fit in the card
export function truncatePath(path?: string, maximumLength: number = 35): string {
    if(!path) {
        return '/';
    }

    // Remove query parameters for display
    const cleanPath = path.split('?')[0] || '/';

    if(cleanPath.length <= maximumLength) {
        return cleanPath;
    }

    // Truncate in the middle to keep start and end visible
    const start = cleanPath.substring(0, maximumLength / 2 - 2);
    const end = cleanPath.substring(cleanPath.length - (maximumLength / 2 - 2));

    return `${start}...${end}`;
}
