/**
 * XML Utilities
 *
 * Functions for extracting content from XML-structured text.
 */

// Extract content from an XML tag
// Uses case-insensitive matching for robustness
export function xmlTagContent(tag: string, document: string): string | null {
    // Try exact match first
    const exactRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
    const exactMatch = document.match(exactRegex);
    if(exactMatch && exactMatch[1] !== undefined) {
        return exactMatch[1].trim();
    }

    // Try case-insensitive match
    const caseInsensitiveRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
    const caseMatch = document.match(caseInsensitiveRegex);
    if(caseMatch && caseMatch[1] !== undefined) {
        return caseMatch[1].trim();
    }

    return null;
}

// Extract content from an XML tag as lines
// Returns null if the tag is not found, empty array if tag exists but is empty
export function xmlTagContentLines(tag: string, document: string): string[] | null {
    const content = xmlTagContent(tag, document);
    if(content === null) return null;
    if(content.trim() === '') return [];

    return content
        .split('\n')
        .map(function (line) {
            return line.trim();
        })
        .filter(function (line) {
            return line.length > 0;
        });
}
