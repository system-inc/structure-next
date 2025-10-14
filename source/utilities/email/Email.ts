// Common email client quote patterns
const gmailQuotePatterns = [
    /<div class="gmail_quote">/i,
    /<blockquote class="gmail_quote"/i,
    /<blockquote type="cite">/i, // Apple Mail quoted content
];

const commonEmailMarkers = [
    /On.*wrote:$/m, // "On [date] [name] wrote:"
    /-{2,}Original Message-{2,}/, // "----Original Message----"
    /From:[\s\S]*Sent:[\s\S]*To:[\s\S]*Subject:/, // Email headers
    /<div class="gmail_attr">/, // Gmail quote attribution
];

// Extracts the latest email content from a thread
export function extractLatestEmailContent(threadHtml: string): string {
    // If thread HTML is empty or the literal string "null", return empty string
    if(!threadHtml || threadHtml === 'null') return '';

    // Convert to string if it's not already
    let latestEmailContent = threadHtml.toString();

    // Function to find the earliest occurrence of quote patterns
    function findFirstQuoteIndex(text: string): number {
        let firstIndex = text.length;

        // Check Gmail specific patterns
        for(const pattern of gmailQuotePatterns) {
            const match = text.match(pattern);
            if(match && match.index !== undefined && match.index < firstIndex) {
                firstIndex = match.index;
            }
        }

        // Check common email markers
        for(const pattern of commonEmailMarkers) {
            const match = text.match(pattern);
            if(match && match.index !== undefined && match.index < firstIndex) {
                firstIndex = match.index;
            }
        }

        return firstIndex;
    }

    // Find where the quote begins
    const quoteIndex = findFirstQuoteIndex(latestEmailContent);

    // Cut off everything after the quote starts
    latestEmailContent = latestEmailContent.substring(0, quoteIndex);

    // Clean up HTML
    latestEmailContent = latestEmailContent
        // Remove HTML tags but preserve line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]*>/g, '')
        // Fix spacing
        .replace(/&nbsp;/g, ' ')
        // Decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        // Remove multiple empty lines
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        // Trim whitespace
        .trim();

    return latestEmailContent;
}
