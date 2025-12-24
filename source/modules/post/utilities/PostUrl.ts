// Post URL Utilities
// Centralized utilities for generating and parsing flat article URLs

// The identifier pattern: 7 lowercase alphanumeric characters
export const postIdentifierLength = 7;
export const postIdentifierPattern = /^[a-z0-9]{7}$/;

// Check if a URL segment ends with a valid post identifier
// Example: "what-is-dhcp-abc1234" -> true, "networking" -> false
export function isPostIdentifier(segment: string): boolean {
    const lastDashIndex = segment.lastIndexOf('-');
    if(lastDashIndex === -1 || lastDashIndex === segment.length - 1) {
        return false;
    }
    const potentialIdentifier = segment.substring(lastDashIndex + 1);
    return postIdentifierPattern.test(potentialIdentifier);
}

// Generate a flat post URL
// Example: generatePostUrl('/library', 'what-is-dhcp', 'abc1234') -> '/library/what-is-dhcp-abc1234'
export function generatePostUrl(basePath: string, slug: string, identifier: string): string {
    return `${basePath}/${slug}-${identifier}`;
}

// Parse a URL segment to extract slug and identifier
// Example: "what-is-dhcp-abc1234" -> { slug: "what-is-dhcp", identifier: "abc1234" }
// Returns null if the segment is not a valid post URL
export function parsePostUrl(segment: string): { slug: string; identifier: string } | null {
    if(!isPostIdentifier(segment)) {
        return null;
    }
    const lastDashIndex = segment.lastIndexOf('-');
    return {
        slug: segment.substring(0, lastDashIndex),
        identifier: segment.substring(lastDashIndex + 1),
    };
}
