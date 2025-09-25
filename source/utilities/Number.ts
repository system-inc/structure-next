/**
 * Adds thousand separators to a number based on the current locale.
 * Handles both number and string inputs, converting strings to numbers.
 *
 * @param {number | string} [number] - The number to format with commas
 * @returns {string} The formatted number string with locale-appropriate separators, or '0' if input is falsy
 *
 * @example
 * addCommas(1000) // Returns "1,000" in US locale
 * addCommas("5000.50") // Returns "5,000.5" in US locale
 * addCommas(undefined) // Returns "0"
 */
export function addCommas(number?: number | string): string {
    if(!number) return '0';
    const value = typeof number === 'string' ? Number(number) : number;

    return value.toLocaleString(); // Handles international separators (e.g., 5,000.00 vs 5.000,00) depending on locale
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Leaving this here in case we don't want to use localized numbers for some reason.
}

/**
 * Parses a number string formatted with international separators back to a numeric value.
 * Automatically detects the locale's thousand separator and decimal separator.
 *
 * @param {string} internationalString - The formatted number string to parse
 * @returns {number} The parsed numeric value
 * @throws {Error} If no separators can be detected in the locale
 *
 * @example
 * // In US locale:
 * parseInternationalNumber("1,234.56") // Returns 1234.56
 * // In German locale:
 * parseInternationalNumber("1.234,56") // Returns 1234.56
 */
export function parseInternationalNumber(internationalString: string): number {
    const TEST_NUMBER = 1111.11;

    // Format the test number to check the grouping separators
    const numberGroupingSeparators = Intl.NumberFormat().format(TEST_NUMBER).replace(/\d/g, '');

    // Split the separators into an array
    const separators = numberGroupingSeparators.split('');

    // Remove the first index from the number, swap the second separator for a decimal
    const [firstSeparator, secondSeparator] = separators;
    const decimalSeparator = secondSeparator;

    if(!decimalSeparator || !firstSeparator) {
        throw new Error('Cannot parse number string: No separators found');
    }

    const [integerPart, decimalPart] = internationalString.split(decimalSeparator) as [string, string];

    // Replace all instances of the first separator with an empty string
    const parsedInteger = parseInt(integerPart.replace(new RegExp(firstSeparator, 'g'), ''), 10);
    const parsedDecimal = decimalPart ? parseFloat(decimalPart) : 0;

    return parsedInteger + parsedDecimal;
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} minimum - The lower bound of the clamping range.
 * @param {number} maximum - The upper bound of the clamping range.
 * @returns {number} - The clamped value, constrained within the minimum and maximum bounds.
 */
export function clamp(value: number, minimum: number, maximum: number): number {
    return Math.max(minimum, Math.min(maximum, value));
}

/**
 * Format a number as currency.
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
    amount: number,
    options?: {
        currency?: string;
        locale?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
    },
): string {
    return new Intl.NumberFormat(options?.locale || 'en-US', {
        style: 'currency',
        currency: options?.currency || 'USD',
        minimumFractionDigits: options?.minimumFractionDigits ?? 0,
        maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    }).format(amount);
}

/**
 * Format large currency values with K/M/B abbreviations.
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string with abbreviation
 */
export function formatLargeCurrency(
    amount: number,
    options?: {
        decimals?: number;
        currency?: string;
    },
): string {
    const decimals = options?.decimals ?? 1;
    const currencySymbol = options?.currency === 'USD' || !options?.currency ? '$' : '';

    if(amount >= 1000000000) {
        return `${currencySymbol}${(amount / 1000000000).toFixed(decimals)}B`;
    }
    if(amount >= 1000000) {
        return `${currencySymbol}${(amount / 1000000).toFixed(decimals)}M`;
    }
    if(amount >= 1000) {
        return `${currencySymbol}${(amount / 1000).toFixed(decimals)}K`;
    }
    return formatCurrency(amount);
}
