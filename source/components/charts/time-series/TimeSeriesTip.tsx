// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeSeriesDataPoint, TimeSeriesDataSource } from './TimeSeriesChart';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';
import { Theme, ThemeClassName } from '@structure/source/theme/ThemeTypes';

// Dependencies - Utilities
import { lightenColor, darkenColor } from '@structure/source/utilities/style/Color';
import { addCommas } from '@structure/source/utilities/type/Number';
import { formatTipLabelByTimeInterval } from './utilities/TimeSeriesFormatters';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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

    // Use props directly (recharts passes active and payload to custom tooltip components)
    const isActive = properties.active;
    const payload = properties.payload;

    // Only render tip if active and has payload
    if(isActive && payload && payload.length > 0 && payload[0]) {
        const dataPoint = payload[0].payload;

        // Sort payload if requested
        const sortedPayload = [...payload];
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
            <div className="rounded-extra-small bg-opsis-background-primary border border--a">
                <div className="border-b border--a p-2 text-xs foreground--b">
                    {properties.timeInterval
                        ? formatTipLabelByTimeInterval(dataPoint.label, properties.timeInterval)
                        : dataPoint.label}
                </div>
                <table className="w-full">
                    <tbody className="">
                        {sortedPayload.map((entry, index) => (
                            <tr
                                key={index}
                                className={mergeClassNames(
                                    'text-xs',
                                    index !== sortedPayload.length - 1 && 'border-b border--a',
                                )}
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
                                <td className="border-l border--a p-2 pr-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            style={{
                                                borderColor: entry.color,
                                                borderStyle: 'solid',
                                                backgroundColor:
                                                    themeSettings.themeClassName === ThemeClassName[Theme.Light]
                                                        ? lightenColor(entry.color || '', 0.2)
                                                        : darkenColor(entry.color || '', 0.2),
                                            }}
                                            className="rounded-extra-small h-4 w-4 border border--a"
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
