// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeSeriesDataPoint, TimeSeriesDataSource } from './TimeSeriesChart';
import { TimeInterval } from './TimeInterval';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Utilities
import { lightenColor, darkenColor } from '@structure/source/utilities/Color';
import { addCommas } from '@structure/source/utilities/Number';
import { formatTipLabelByTimeInterval } from './utilities/TimeSeriesFormatters';

// Component - TimeSeriesTip
export interface TimeSeriesTipProperties {
    active?: boolean;
    payload?: Array<{
        payload: TimeSeriesDataPoint;
        color: string;
        name: string;
        value: number;
        dataKey?: string;
    }>;
    dataSources?: TimeSeriesDataSource[];
    sortByValue?: 'Descending' | 'Ascending' | false; // Add option to sort by value
    timeInterval?: TimeInterval; // Add time interval for proper date formatting
}
export function TimeSeriesTip(properties: TimeSeriesTipProperties) {
    // Hooks
    const themeSettings = useThemeSettings();

    // Only render tip if active and has payload
    if(properties.active && properties.payload && properties.payload.length > 0 && properties.payload[0]) {
        const dataPoint = properties.payload[0].payload;

        // Sort payload if requested
        const sortedPayload = [...properties.payload];
        if(properties.sortByValue) {
            sortedPayload.sort((a, b) => {
                if(properties.sortByValue === 'Descending') {
                    return b.value - a.value;
                }
                else {
                    return a.value - b.value;
                }
            });
        }

        // Render the component
        return (
            <div className="rounded-extra-small border border-light-4 bg-light dark:border-dark-4 dark:bg-dark">
                <div className="border-b p-2 text-xs text-dark/60 dark:text-light-4/60">
                    {properties.timeInterval
                        ? formatTipLabelByTimeInterval(dataPoint.label, properties.timeInterval)
                        : dataPoint.label}
                </div>
                <table className="w-full">
                    <tbody className="">
                        {sortedPayload.map((entry, index) => (
                            <tr
                                key={index}
                                className={
                                    index === sortedPayload.length - 1
                                        ? 'text-xs' // If this is the last row, don't show the border
                                        : 'border-b text-xs'
                                }
                            >
                                <td className="p-2 text-center text-xs">
                                    <b>
                                        {(() => {
                                            // Find matching data source for formatting
                                            const dataSource = properties.dataSources?.find(
                                                (currentDataSource) =>
                                                    currentDataSource.dataKey === entry.dataKey ||
                                                    currentDataSource.name === entry.name,
                                            );
                                            if(dataSource?.formatValue) {
                                                return dataSource.formatValue(entry.value, 'Tip');
                                            }
                                            return addCommas(entry.value);
                                        })()}
                                    </b>
                                </td>
                                <td className="border-l p-2 pr-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            style={{
                                                borderColor: entry.color,
                                                borderStyle: 'solid',
                                                backgroundColor:
                                                    themeSettings.themeClassName === 'light'
                                                        ? lightenColor(entry.color || '', 0.2)
                                                        : darkenColor(entry.color || '', 0.2),
                                            }}
                                            className="h-4 w-4 rounded-extra-small border"
                                        />
                                        <span>{entry.name}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // If not active or no payload, don't render anything
    return null;
}
