// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeSeriesDataSource } from '../TimeSeriesChart';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Main Components
import { XAxis, YAxis } from 'recharts';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/Number';
import { formatAxisTick, calculateTickInterval } from '../utilities/TimeSeriesFormatters';

// Component - TimeSeriesAxes
export interface TimeSeriesAxesProperties {
    showXAxis: boolean;
    showYAxis: boolean;
    data: Array<{ label: string }>;
    dataSources: TimeSeriesDataSource[];
    timeInterval: TimeInterval;
}
export function TimeSeriesAxes(properties: TimeSeriesAxesProperties) {
    // Previous tick value tracking for formatters
    const previousTickValueReference = React.useRef<string>('');

    // Calculate tick interval
    const tickInterval = calculateTickInterval(properties.data.length);

    // Render nothing if no axes should be shown
    if(!properties.showXAxis && !properties.showYAxis) {
        return null;
    }

    // Render the component
    return (
        <>
            {/* X Axis */}
            {properties.showXAxis && (
                <>
                    <XAxis
                        xAxisId="0"
                        dataKey="label"
                        stroke="var(--border-primary)"
                        tick={{ fill: 'var(--foreground-secondary)' }}
                        interval={tickInterval}
                        tickFormatter={function (value: string | number | undefined, index: number) {
                            const stringValue = String(value || '');
                            const result = formatAxisTick(
                                'primary',
                                properties.timeInterval,
                                stringValue,
                                index,
                                previousTickValueReference.current,
                                properties.data.length,
                            );
                            previousTickValueReference.current = stringValue;
                            return result;
                        }}
                        className="text-sm"
                    />
                    <XAxis
                        xAxisId="1"
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        stroke="var(--border-primary)"
                        tick={{ fill: 'var(--foreground-tertiary)' }}
                        interval={tickInterval}
                        tickFormatter={function (value: string | number | undefined, index: number) {
                            return formatAxisTick(
                                'secondary',
                                properties.timeInterval,
                                String(value || ''),
                                index,
                                (index > 0 && properties.data && properties.data[index - 1]?.label) || '',
                                properties.data.length,
                            );
                        }}
                        allowDuplicatedCategory={false}
                        className="text-sm"
                    />
                </>
            )}

            {/* Y Axis */}
            {properties.showYAxis && (
                <>
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="var(--border-primary)"
                        tick={{ fill: 'var(--foreground-secondary)' }}
                        tickFormatter={function (value) {
                            // Find the first data source using left axis
                            const leftDataSource = properties.dataSources.find(
                                (currentDataSource) =>
                                    !currentDataSource.yAxisAlignment || currentDataSource.yAxisAlignment === 'left',
                            );
                            if(leftDataSource?.formatValue) {
                                return leftDataSource.formatValue(value, 'Axis');
                            }
                            return addCommas(value);
                        }}
                        className="text-sm"
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="var(--border-primary)"
                        tick={{ fill: 'var(--foreground-secondary)' }}
                        tickFormatter={function (value) {
                            // Find the first data source using right axis
                            const rightDataSource = properties.dataSources.find(
                                (currentDataSource) => currentDataSource.yAxisAlignment === 'right',
                            );
                            if(rightDataSource?.formatValue) {
                                return rightDataSource.formatValue(value, 'Axis');
                            }
                            return addCommas(value);
                        }}
                        className="text-sm"
                    />
                </>
            )}
        </>
    );
}
