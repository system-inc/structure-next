// Dependencies - Utilities
import { hexStringToRgbaString, getComplementaryHexColor } from '@structure/source/utilities/style/Color';

// Default color palette for time series charts
export const timeSeriesColorPalette = [
    '#3b82f6', // blue-500
    '#10b981', // green (emerald-500)
    '#f97316', // orange-500
    '#8b5cf6', // purple (violet-500)
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f59e0b', // amber-500
    '#6366f1', // indigo-500
    '#84cc16', // lime-500
];

// Function to get a color from the palette
export function getTimeSeriesColor(index: number): string {
    // If we have a predefined color, use it
    if(index < timeSeriesColorPalette.length) {
        return timeSeriesColorPalette[index] || '#10b981';
    }

    // Otherwise, generate a complementary color based on the index
    return hexStringToRgbaString(getComplementaryHexColor(index, '#00AAFF'), 1);
}

// Function to get the default data source configuration
export function getDefaultDataSourceConfiguration(index: number) {
    return {
        color: getTimeSeriesColor(index),
        yAxisAlignment: 'left' as const,
        lineStyle: 'solid' as const,
    };
}
