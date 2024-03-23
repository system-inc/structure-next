/**
 * Add commas to a number
 */
export function addCommas(number?: number | string): string {
    if(!number) return '0';
    let value = typeof number === 'string' ? Number(number) : number;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
