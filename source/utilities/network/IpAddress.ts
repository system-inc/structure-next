/**
 * Utilities for validating and working with IP addresses
 */

/**
 * Validates if a string is a valid IPv4 address
 */
export function isIpV4Address(value: string): boolean {
    // Check if the string matches IPv4 pattern
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(ipv4Regex);

    if(!match) {
        return false;
    }

    // Validate that each octet is between 0-255
    return match.slice(1).every(function (octet) {
        const num = parseInt(octet, 10);
        return num >= 0 && num <= 255;
    });
}

/**
 * Validates if a string is a valid IPv6 address
 */
export function isIpV6Address(value: string): boolean {
    // Standard IPv6 regex - checks for valid IPv6 formats
    const ipv6Regex =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;

    return ipv6Regex.test(value);
}

/**
 * Validates if a string is any valid IP address (IPv4 or IPv6)
 */
export function isIpAddress(value: string): boolean {
    return isIpV4Address(value) || isIpV6Address(value);
}

/**
 * Checks if an IP address is in a private/internal network range
 * This includes:
 * - 10.0.0.0/8 - Private network
 * - 172.16.0.0/12 - Private network
 * - 192.168.0.0/16 - Private network
 * - 127.0.0.0/8 - Localhost
 * - 169.254.0.0/16 - Link-local
 *
 * @param ipAddress The IP address to check
 * @returns true if the IP is private or reserved, false if it's publicly routable
 */
export function isPrivateIpAddress(ipAddress: string): boolean {
    // Only check valid IPv4 addresses
    if(!isIpV4Address(ipAddress)) {
        return false;
    }

    // For TypeScript safety, use a regex approach with simple patterns
    // This is also more efficient than splitting and parsing

    // 10.0.0.0/8 - Class A private network
    if(/^10\./.test(ipAddress)) {
        return true;
    }

    // 172.16.0.0/12 - Class B private networks
    if(/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ipAddress)) {
        return true;
    }

    // 192.168.0.0/16 - Class C private networks
    if(/^192\.168\./.test(ipAddress)) {
        return true;
    }

    // 127.0.0.0/8 - Localhost
    if(/^127\./.test(ipAddress)) {
        return true;
    }

    // 169.254.0.0/16 - Link-local
    if(/^169\.254\./.test(ipAddress)) {
        return true;
    }

    // Not in any private range
    return false;
}
