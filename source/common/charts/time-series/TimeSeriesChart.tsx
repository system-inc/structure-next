'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { ChartType } from './controls/ChartTypeFormInputSelect';

// Dependencies - Main Components
import {
    ComposedChart,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Bar,
    Cell,
    Line,
    Area,
    XAxis,
    YAxis,
    ReferenceArea,
} from 'recharts';
import { TimeSeriesTip } from './TimeSeriesTip';

// Dependencies - Hooks
import { useReferenceAreaSelection } from './hooks/useReferenceAreaSelection';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Utilities
import { TimeInterval, isSpecializedInterval } from './TimeInterval';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
import { lightenColor, darkenColor, setTransparency } from '@structure/source/utilities/Color';
import { addCommas } from '@structure/source/utilities/Number';
import { formatAxisTick, calculateTickInterval } from './utilities/TimeSeriesFormatters';
import {
    getTopBarDataKey,
    exceedsMaximumDataPoints,
    differenceInTimeIntervals,
} from './utilities/TimeSeriesProcessors';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Type - TimeSeriesDataPoint
export interface TimeSeriesDataPoint {
    label: string;
    [key: string]: number | string;
}

// Type - TimeSeriesDataSource
export interface TimeSeriesDataSource {
    id: string;
    dataKey: string;
    name: string;
    color: string;
    yAxisAlignment?: 'left' | 'right';
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    formatValue?: (value: number, context?: 'Axis' | 'Tip') => string;
    stackId?: string;
}

export interface TimeSeriesChartProperties {
    data: TimeSeriesDataPoint[];
    dataSources: TimeSeriesDataSource[];
    className?: string;
    chartType?: ChartType;
    timeInterval?: TimeInterval;
    timeRange?: TimeRangeType;
    height?: number;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    activeLabel?: string | null;
    onLabelClick?: (label: string) => void;
    onReferenceAreaSelect?: (startLabel: string, endLabel: string) => void;
    isStacked?: boolean;
    tipSortOrder?: 'Descending' | 'Ascending' | false;
    maximumDataPoints?: number; // Override default 370 limit
}

// Component - TimeSeriesChart
export function TimeSeriesChart(properties: TimeSeriesChartProperties) {
    // Hooks
    const themeSettings = useThemeSettings();
    const isDarkMode = themeSettings.themeClassName === 'dark';

    // Check if current interval is specialized (disable zoom/selection for these)
    const isSpecialized = properties.timeInterval ? isSpecializedInterval(properties.timeInterval) : false;

    // Hooks for reference area selection (disabled for specialized intervals)
    const referenceAreaSelection = useReferenceAreaSelection(
        isSpecialized ? undefined : properties.onReferenceAreaSelect,
    );

    // Memoized values
    const chartHeight = properties.height || 300;
    const showGrid = properties.showGrid !== false;
    const showXAxis = properties.showXAxis !== false;
    const showYAxis = properties.showYAxis !== false;
    const showTooltip = properties.showTooltip !== false;

    // State to track container width for bar cursor calculation
    const [containerWidth, setContainerWidth] = React.useState<number>(600);
    const containerReference = React.useRef<HTMLDivElement>(null);

    // Previous tick value tracking for formatters
    const previousTickValueReference = React.useRef<string>('');
    const previousSecondaryTickValueReference = React.useRef<string>('');

    // Calculate tick interval
    const tickInterval = calculateTickInterval(properties.data.length, properties.timeInterval);

    // Check if data points exceed maximum
    // If data is empty but we have timeRange and timeInterval, calculate expected count
    let dataPointCount = properties.data.length;
    if(dataPointCount === 0 && properties.timeRange && properties.timeInterval) {
        const startTime = properties.timeRange.startTime;
        const endTime = properties.timeRange.endTime;
        if(startTime && endTime) {
            dataPointCount = differenceInTimeIntervals(startTime, endTime, properties.timeInterval) + 1;
        }
    }
    const exceedsLimit = exceedsMaximumDataPoints(dataPointCount, properties.maximumDataPoints);

    // Effect to observe container size changes
    React.useEffect(function () {
        if(!containerReference.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(containerReference.current);

        return function () {
            resizeObserver.disconnect();
        };
    }, []);

    // Show warning if too many data points
    if(exceedsLimit) {
        return (
            <div
                className={mergeClassNames('flex items-center justify-center', properties.className)}
                style={{ height: chartHeight }}
            >
                <div className="text-center">
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
                        Too many data points ({addCommas(dataPointCount)}).
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
                        Adjust your time range or interval.
                    </p>
                </div>
            </div>
        );
    }

    // Render the component
    return (
        <div className={mergeClassNames('select-none', properties.className)} ref={containerReference}>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart
                    data={properties.data}
                    onMouseDown={referenceAreaSelection.handleMouseDown}
                    onMouseMove={referenceAreaSelection.handleMouseMove}
                    onMouseUp={referenceAreaSelection.handleMouseUp}
                    onMouseLeave={referenceAreaSelection.handleMouseUp}
                >
                    {showGrid && (
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-tertiary)" vertical={false} />
                    )}

                    {/* X Axes */}
                    {showXAxis && (
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
                                        properties.timeInterval || TimeInterval.Day,
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
                                    const stringValue = String(value || '');
                                    const result = formatAxisTick(
                                        'secondary',
                                        properties.timeInterval || TimeInterval.Day,
                                        stringValue,
                                        index,
                                        previousSecondaryTickValueReference.current,
                                        properties.data.length,
                                    );
                                    previousSecondaryTickValueReference.current = stringValue;
                                    return result;
                                }}
                                allowDuplicatedCategory={false}
                                className="text-sm"
                            />
                        </>
                    )}

                    {/* Y Axes */}
                    {showYAxis && (
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
                                            !currentDataSource.yAxisAlignment ||
                                            currentDataSource.yAxisAlignment === 'left',
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

                    {showTooltip && (
                        <RechartsTooltip
                            cursor={{
                                stroke:
                                    properties.chartType === 'Bar'
                                        ? isDarkMode
                                            ? 'var(--light-30)'
                                            : 'var(--dark-50)'
                                        : 'var(--border-primary)',
                                strokeWidth:
                                    properties.chartType === 'Bar'
                                        ? (containerWidth - 90) / (properties.data.length || 1)
                                        : 1,
                            }}
                            content={
                                <TimeSeriesTip
                                    dataSources={properties.dataSources}
                                    sortByValue={properties.tipSortOrder}
                                    timeInterval={properties.timeInterval}
                                />
                            }
                        />
                    )}

                    {/* Data Series - must be direct children of ComposedChart for Recharts to work */}
                    {properties.dataSources.map((dataSource) => {
                        const yAxisId = dataSource.yAxisAlignment || 'left';
                        const strokeDasharray =
                            dataSource.lineStyle === 'dashed'
                                ? '5 5'
                                : dataSource.lineStyle === 'dotted'
                                  ? '2 2'
                                  : undefined;

                        if(properties.chartType === 'Bar') {
                            const isStackedBar = dataSource.stackId || properties.isStacked;
                            // Default radius for all bars
                            const defaultRadius: [number, number, number, number] = [4, 4, 0, 0];

                            return (
                                <Bar
                                    key={dataSource.id}
                                    dataKey={dataSource.dataKey}
                                    name={dataSource.name}
                                    fill={dataSource.color}
                                    radius={defaultRadius}
                                    yAxisId={yAxisId}
                                    animationDuration={0}
                                    stackId={isStackedBar ? 'stack' : undefined}
                                    activeBar={{
                                        fill:
                                            themeSettings.themeClassName === 'light'
                                                ? lightenColor(dataSource.color, 0.05)
                                                : lightenColor(dataSource.color, 0.05),
                                    }}
                                >
                                    {/* Apply dynamic radius per cell for stacked bars */}
                                    {isStackedBar &&
                                        properties.data.map(function (dataPoint, index) {
                                            const stackedDataKeys = properties.dataSources
                                                .filter(function (currentDataSource) {
                                                    return currentDataSource.stackId || properties.isStacked;
                                                })
                                                .map(function (currentDataSource) {
                                                    return currentDataSource.dataKey;
                                                });
                                            const topBarDataKey = getTopBarDataKey(dataPoint, stackedDataKeys);

                                            // Only apply radius if this bar is the top bar for this data point
                                            const shouldRound = topBarDataKey === dataSource.dataKey;

                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    radius={
                                                        shouldRound ? (defaultRadius as never) : ([0, 0, 0, 0] as never)
                                                    }
                                                />
                                            );
                                        })}
                                </Bar>
                            );
                        }
                        else if(properties.chartType === 'Area') {
                            return (
                                <Area
                                    key={dataSource.id}
                                    type="monotone"
                                    dataKey={dataSource.dataKey}
                                    name={dataSource.name}
                                    stroke={dataSource.color}
                                    strokeWidth={2}
                                    strokeDasharray={strokeDasharray}
                                    fill={setTransparency(
                                        themeSettings.themeClassName == 'light'
                                            ? lightenColor(dataSource.color, 0.2)
                                            : darkenColor(dataSource.color, 0.2),
                                        0.75,
                                    )}
                                    fillOpacity={1.0}
                                    dot={{
                                        stroke: 'transparent',
                                        fill: dataSource.color,
                                        r: 2.5,
                                    }}
                                    activeDot={{
                                        r: 4,
                                    }}
                                    yAxisId={yAxisId}
                                    animationDuration={0}
                                    stackId={dataSource.stackId || properties.isStacked ? 'stack' : undefined}
                                />
                            );
                        }
                        else {
                            return (
                                <Line
                                    key={dataSource.id}
                                    type="monotone"
                                    dataKey={dataSource.dataKey}
                                    name={dataSource.name}
                                    stroke={dataSource.color}
                                    strokeWidth={2}
                                    strokeDasharray={strokeDasharray}
                                    dot={{
                                        stroke: 'transparent',
                                        fill: dataSource.color,
                                        r: 2.5,
                                    }}
                                    activeDot={{
                                        r: 4,
                                    }}
                                    yAxisId={yAxisId}
                                    animationDuration={0}
                                />
                            );
                        }
                    })}

                    {/* Reference Area for drag selection */}
                    {referenceAreaSelection.referenceAreaStart && referenceAreaSelection.referenceAreaEnd && (
                        <ReferenceArea
                            yAxisId="left"
                            x1={referenceAreaSelection.referenceAreaStart}
                            x2={referenceAreaSelection.referenceAreaEnd}
                            strokeOpacity={0.5}
                            fillOpacity={isDarkMode ? 0.1 : 0.2}
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
