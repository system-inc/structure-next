// Add commas to a number
export function addCommas(number?: number | string): string {
    if(!number) return '0';
    const value = typeof number === 'string' ? Number(number) : number;

    return value.toLocaleString(); // Handles international separators (e.g., 5,000.00 vs 5.000,00) depending on locale
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Leaving this here in case we don't want to use localized numbers for some reason.
}

export function parseIntlNumber(intlString: string) {
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

    const [integerPart, decimalPart] = intlString.split(decimalSeparator) as [string, string];

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
