/**
 * Returns a complementary hex color string based on the provided index and a starting hex color.
 *
 * @param {number} index - The index to calculate the complementary color. If the index is 0, the function will return the starting color.
 * @param {string} startingHexColor - The starting hex color string (e.g., "#FFFFFF").
 *
 * The function uses the golden ratio conjugate to calculate a distinct hue for the complementary color.
 * For subsequent indices, it continues to rotate around the color wheel.
 * The saturation and lightness are kept the same as the base color for now, but can be adjusted if desired.
 *
 * @returns {string} The complementary hex color string.
 */
export function getComplementaryHexColor(index: number, startingHexColor: string): string {
    if(index === 0) {
        return startingHexColor;
    }

    const goldenRatioConjugate = 0.618033988749895;

    const [baseHue, baseSaturation, baseLightness] = hexStringToHsl(startingHexColor);

    // Use golden ratio conjugate for the first jump in hue to get a distinct color
    let newHue = (baseHue + goldenRatioConjugate) % 1.0;

    // For subsequent indices, continue to rotate around the color wheel
    newHue = (newHue + index * goldenRatioConjugate) % 1.0;

    // Saturation and lightness can be adjusted similarly if desired
    const newSaturation = baseSaturation; // Keeping it the same as base for now
    const newLightness = baseLightness; // Keeping it the same as base for now

    return hslToHexString(newHue, newSaturation, newLightness);
}

/**
 * Lightens a color by a specified percentage.
 *
 * @param {string} colorString - The color to lighten, in any valid CSS color format (hex, rgb, rgba, hsl, hsla).
 * @param {number} percentage - The percentage to lighten the color by, as a decimal between 0 and 1.
 * @param {('hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla')} [outputFormat] - The format to return the lightened color in. If not provided, the color will be returned in the same format as the input.
 *
 * The function first converts the input color to HSL format, which allows for easy adjustment of the lightness.
 * It then increases the lightness by the specified percentage, ensuring that it does not exceed 1 or fall below 0.
 * Finally, it converts the lightened color back to its original format, or to the specified output format.
 *
 * @returns {string} The lightened color, in the specified or original format.
 * @throws {Error} Will throw an error if the input color format is not recognized.
 */
export function lightenColor(
    colorString: string,
    percentage: number, // Now expecting a value between 0 and 1
    outputFormat?: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla',
): string {
    const inputFormat = getColorStringType(colorString);
    let [hue, saturation, lightness] = [0, 0, 0];

    // Convert to HSL
    switch(inputFormat) {
        case 'hex':
            [hue, saturation, lightness] = hexStringToHsl(colorString);
            break;
        case 'rgb':
        case 'rgba':
            [hue, saturation, lightness] = hexStringToHsl(rgbStringToHexString(colorString));
            break;
        case 'hsl':
        case 'hsla':
            [hue, saturation, lightness] = hslStringToHsl(colorString);
            break;
        default:
            throw new Error('Invalid color string format');
    }

    // Adjust lightness by the specified amount (scaled to percentage)
    lightness += percentage; // Amount is now directly added to lightness
    lightness = Math.min(1, lightness); // Ensure lightness does not exceed 1
    lightness = Math.max(0, lightness); // Ensure lightness is not less than 0

    // Convert back to original format or to specified output format
    if(!outputFormat) outputFormat = inputFormat;
    switch(outputFormat) {
        case 'hex':
            return hslToHexString(hue, saturation, lightness);
        case 'rgb':
            return `rgb(${hslToRgb(hue, saturation, lightness).join(', ')})`;
        case 'rgba':
            return `rgba(${hslToRgb(hue, saturation, lightness).join(', ')}, 1)`;
        case 'hsl':
            return `hsl(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%)`;
        case 'hsla':
            return `hsla(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%, 1)`;
        default:
            return colorString; // In case of unknown format
    }
}

/**
 * Darkens a color by a specified percentage.
 *
 * @param {string} colorString - The color to darken, in any valid CSS color format (hex, rgb, rgba, hsl, hsla).
 * @param {number} percentage - The percentage to darken the color by, as a decimal between 0 and 1.
 * @param {('hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla')} [outputFormat] - The format to return the darkened color in. If not provided, the color will be returned in the same format as the input.
 *
 * The function first converts the input color to HSL format, which allows for easy adjustment of the lightness.
 * It then decreases the lightness by the specified percentage, ensuring that it does not exceed 1 or fall below 0.
 * Finally, it converts the darkened color back to its original format, or to the specified output format.
 *
 * @returns {string} The darkened color, in the specified or original format.
 * @throws {Error} Will throw an error if the input color format is not recognized.
 */
export function darkenColor(
    colorString: string,
    percentage: number,
    outputFormat?: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla',
): string {
    const inputFormat = getColorStringType(colorString);
    let [hue, saturation, lightness] = [0, 0, 0];

    // Convert to HSL
    switch(inputFormat) {
        case 'hex':
            [hue, saturation, lightness] = hexStringToHsl(colorString);
            break;
        case 'rgb':
        case 'rgba':
            [hue, saturation, lightness] = hexStringToHsl(rgbStringToHexString(colorString));
            break;
        case 'hsl':
        case 'hsla':
            [hue, saturation, lightness] = hslStringToHsl(colorString);
            break;
        default:
            throw new Error('Invalid color string format');
    }

    // Adjust lightness by the specified amount (scaled to percentage)
    lightness -= percentage; // Amount is now directly subtracted from lightness
    lightness = Math.min(1, lightness); // Ensure lightness does not exceed 1
    lightness = Math.max(0, lightness); // Ensure lightness is not less than 0

    // Convert back to original format or to specified output format
    if(!outputFormat) outputFormat = inputFormat;
    switch(outputFormat) {
        case 'hex':
            return hslToHexString(hue, saturation, lightness);
        case 'rgb':
            return `rgb(${hslToRgb(hue, saturation, lightness).join(', ')})`;
        case 'rgba':
            return `rgba(${hslToRgb(hue, saturation, lightness).join(', ')}, 1)`;
        case 'hsl':
            return `hsl(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%)`;
        case 'hsla':
            return `hsla(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%, 1)`;
        default:
            return colorString; // In case of unknown format
    }
}

/**
 * Converts a color string from any valid CSS color format (hex, rgb, rgba, hsl, hsla) to any other valid CSS color format.
 *
 * @param {string} anyColorString - The color string to convert, in any valid CSS color format (hex, rgb, rgba, hsl, hsla).
 * @param {('hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla')} outputFormat - The format to return the converted color string in.
 *
 * The function first determines the format of the input color string.
 * It then parses the color string and extracts the red, green, blue, and alpha values.
 * Finally, it converts the color to the specified output format.
 *
 * @returns {string} The converted color string, in the specified format.
 * @throws {Error} Will throw an error if the input color format is not recognized.
 */
export function convertColorString(
    anyColorString: string,
    outputFormat: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla',
): string {
    let red = 0,
        green = 0,
        blue = 0,
        alpha = 1; // Default RGBA values

    if(anyColorString.startsWith('#')) {
        [red, green, blue] = hexStringToRgb(anyColorString);
    }
    else if(anyColorString.startsWith('rgba')) {
        const rgbaMatches = anyColorString.match(/\d+\.?\d*/g);
        if(rgbaMatches && rgbaMatches.length === 4) {
            [red, green, blue, alpha] = rgbaMatches.map(Number) as [number, number, number, number];
        }
        else {
            throw new Error('Invalid RGBA color string');
        }
    }
    else if(anyColorString.startsWith('rgb')) {
        const rgbMatches = anyColorString.match(/\d+/g);
        if(rgbMatches && rgbMatches.length === 3) {
            [red, green, blue] = rgbMatches.map(Number) as [number, number, number];
        }
        else {
            throw new Error('Invalid RGB color string');
        }
    }
    else if(anyColorString.startsWith('hsl') || anyColorString.startsWith('hsla')) {
        const hslMatches = anyColorString.match(/\d+\.?\d*/g);
        if(hslMatches && (hslMatches.length === 3 || hslMatches.length === 4)) {
            const rgba = hslaToRgbaString(...(hslMatches.map(Number) as [number, number, number, number?]));
            const rgbaMatches = rgba.match(/\d+\.?\d*/g);
            if(rgbaMatches && rgbaMatches.length === 4) {
                [red, green, blue, alpha] = rgbaMatches.map(Number) as [number, number, number, number];
            }
            else {
                throw new Error('Invalid HSLA color string');
            }
        }
        else {
            throw new Error('Invalid HSL color string');
        }
    }

    switch(outputFormat) {
        case 'hex':
            return hslToHexString(red / 255, green / 255, blue / 255);
        case 'rgb':
            return `rgb(${red}, ${green}, ${blue})`;
        case 'rgba':
            return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        case 'hsl':
            const [h, s, l] = hexStringToHsl(
                `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue
                    .toString(16)
                    .padStart(2, '0')}`,
            );
            return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
        case 'hsla':
            const [h2, s2, l2] = hexStringToHsl(
                `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue
                    .toString(16)
                    .padStart(2, '0')}`,
            );
            return `hsla(${h2 * 360}, ${s2 * 100}%, ${l2 * 100}%, ${alpha})`;
        default:
            return anyColorString;
    }
}

/**
 * Returns the type of a color string.
 *
 * @param {string} anyColorString - The color string to determine the type of.
 *
 * The function first checks if the color string starts with a hash (#), which indicates a hex color string.
 * It then checks if the color string starts with "rgb" or "rgba", which indicates an RGB or RGBA color string.
 * It then checks if the color string starts with "hsl" or "hsla", which indicates an HSL or HSLA color string.
 * If none of the above are true, the function returns "unknown".
 *
 * @returns {('hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'unknown')} The type of the color string.
 */
export function getColorStringType(anyColorString: string): 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'unknown' {
    if(anyColorString.startsWith('#')) {
        return 'hex';
    }
    else if(anyColorString.startsWith('rgb')) {
        return 'rgb';
    }
    else if(anyColorString.startsWith('rgba')) {
        return 'rgba';
    }
    else if(anyColorString.startsWith('hsl') || anyColorString.startsWith('hsla')) {
        return 'hsl';
    }
    else {
        return 'unknown';
    }
}

/**
 * Returns the color string with transparency set.
 *
 * @param {string} colorString - The color string to determine the transparency of.
 *
 * The function first checks if the color string starts with "rgba", which indicates an RGBA color string.
 * It then checks if the color string starts with "hsla", which indicates an HSLA color string.
 * If none of the above are true, the function returns 1 (opaque).
 *
 * @returns {number} The transparency of the color string, as a decimal between 0 and 1.
 */
export function setTransparency(colorString: string, transparency: number): string {
    const inputFormat = getColorStringType(colorString);
    let red = 0,
        green = 0,
        blue = 0,
        alpha = 1; // Default RGBA values

    // Ensure transparency is within the range [0, 1]
    transparency = Math.max(0, Math.min(1, transparency));

    // Parse the color string and extract RGB and alpha values
    switch(inputFormat) {
        case 'hex':
            [red, green, blue] = hexStringToRgb(colorString);
            break;
        case 'rgb':
            [red, green, blue] = rgbStringToRgbArray(colorString);
            break;
        case 'rgba':
            [red, green, blue, alpha] = rgbaStringToRgbaArray(colorString);
            break;
        case 'hsl':
            [red, green, blue] = hslToRgb(...hslStringToHsl(colorString));
            break;
        case 'hsla':
            [red, green, blue, alpha] = hslaToRgbaArray(hslStringToHsl(colorString));
            break;
        default:
            throw new Error('Invalid color string format');
    }

    // Set the new alpha value
    alpha = transparency;

    // Return the color in the same format with updated alpha value
    if(inputFormat === 'hex' || inputFormat === 'rgb' || inputFormat === 'hsl') {
        // For formats without alpha, return RGBA format
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
    else {
        // For formats with alpha, maintain the format
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
}

function rgbStringToRgbArray(rgbString: string): [number, number, number] {
    const rgbMatches = rgbString.match(/\d+/g);
    if(!rgbMatches || rgbMatches.length < 3) {
        throw new Error('Invalid RGB color string');
    }
    return rgbMatches.map(Number) as [number, number, number];
}

function rgbaStringToRgbaArray(rgbaString: string): [number, number, number, number] {
    const rgbaMatches = rgbaString.match(/\d+\.?\d*/g);
    if(!rgbaMatches || rgbaMatches.length < 4) {
        throw new Error('Invalid RGBA color string');
    }
    return rgbaMatches.map(Number) as [number, number, number, number];
}

function hslaToRgbaArray(hsl: [number, number, number], alpha: number = 1): [number, number, number, number] {
    const [red, green, blue] = hslToRgb(...hsl);
    return [red, green, blue, alpha];
}

export function rgbStringToHexString(rgbString: string): string {
    const rgbMatches = rgbString.match(/\d+/g);
    if(!rgbMatches || rgbMatches.length < 3) {
        throw new Error('Invalid RGB color string');
    }

    const [red, green, blue] = rgbMatches.map(Number) as [number, number, number];
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue
        .toString(16)
        .padStart(2, '0')}`;
}

export function hexStringToRgb(hexString: string): [number, number, number] {
    const red = parseInt(hexString.slice(1, 3), 16);
    const green = parseInt(hexString.slice(3, 5), 16);
    const blue = parseInt(hexString.slice(5, 7), 16);

    return [red, green, blue];
}

export function hexStringToRgbaString(hexString: string, alpha: number): string {
    const red = parseInt(hexString.slice(1, 3), 16);
    const green = parseInt(hexString.slice(3, 5), 16);
    const blue = parseInt(hexString.slice(5, 7), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function hexStringToHsl(hexString: string): [number, number, number] {
    const red = parseInt(hexString.slice(1, 3), 16) / 255.0;
    const green = parseInt(hexString.slice(3, 5), 16) / 255.0;
    const blue = parseInt(hexString.slice(5, 7), 16) / 255.0;

    const maxValue = Math.max(red, green, blue);
    const minValue = Math.min(red, green, blue);

    let hue = 0;
    let saturation = 0;
    const lightness = (maxValue + minValue) / 2;

    if(maxValue === minValue) {
        hue = saturation = 0; // achromatic
    }
    else {
        const delta = maxValue - minValue;
        saturation = lightness > 0.5 ? delta / (2.0 - maxValue - minValue) : delta / (maxValue + minValue);

        switch(maxValue) {
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }

        hue /= 6;
    }

    return [hue, saturation, lightness];
}

export function hslStringToHsl(hslString: string): [number, number, number] {
    const hslMatches = hslString.match(/\d+\.?\d*/g);
    if(!hslMatches || hslMatches.length < 3) {
        throw new Error('Invalid HSL color string');
    }

    const [h, s, l] = hslMatches.map(Number) as [number, number, number];
    return [h / 360, s / 100, l / 100];
}

export function hslToHexString(hue: number, saturation: number, lightness: number): string {
    let red, green, blue;

    if(saturation === 0) {
        red = green = blue = lightness; // achromatic
    }
    else {
        const hueToRgb = (p: number, q: number, t: number) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1 / 6) return p + (q - p) * 6 * t;
            if(t < 1 / 2) return q;
            if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const qValue = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const pValue = 2 * lightness - qValue;

        red = hueToRgb(pValue, qValue, hue + 1 / 3);
        green = hueToRgb(pValue, qValue, hue);
        blue = hueToRgb(pValue, qValue, hue - 1 / 3);
    }

    const toHex = (colorValue: number) => {
        const hexValue = Math.round(colorValue * 255).toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    };

    return '#' + toHex(red) + toHex(green) + toHex(blue);
}

export function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
    let red, green, blue;

    if(saturation === 0) {
        red = green = blue = lightness; // achromatic
    }
    else {
        const hueToRgb = (p: number, q: number, t: number) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1 / 6) return p + (q - p) * 6 * t;
            if(t < 1 / 2) return q;
            if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const qValue = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const pValue = 2 * lightness - qValue;

        red = hueToRgb(pValue, qValue, hue + 1 / 3);
        green = hueToRgb(pValue, qValue, hue);
        blue = hueToRgb(pValue, qValue, hue - 1 / 3);
    }

    return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
}

export function hslaToRgbaString(hue: number, saturation: number, lightness: number, alpha: number = 1): string {
    let red, green, blue;

    if(saturation === 0) {
        red = green = blue = lightness; // achromatic
    }
    else {
        const hueToRgb = (p: number, q: number, t: number) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1 / 6) return p + (q - p) * 6 * t;
            if(t < 1 / 2) return q;
            if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const qValue = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const pValue = 2 * lightness - qValue;

        red = hueToRgb(pValue, qValue, hue + 1 / 3);
        green = hueToRgb(pValue, qValue, hue);
        blue = hueToRgb(pValue, qValue, hue - 1 / 3);
    }

    return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${alpha})`;
}

// Function to get a rainbow hex color based on a percentage
export function getRainbowHexColor(percent: number, saturation: number = 0.5, lightness: number = 0.5): string {
    const hue = percent;
    return hslToHexString(hue, saturation, lightness);
}

// Function to get a rainbow hex color based on a percentage and theme
export function getRainbowHexColorForTheme(percent: number, theme?: 'dark' | 'light' | string | null): string {
    // Adjust saturation based on theme
    const saturation = theme === 'dark' ? 0.5 : 0.6;
    return hslToHexString(percent, saturation, 0.5);
}
