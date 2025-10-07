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
    TooltipProps as RechartsTooltipProperties,
    ResponsiveContainer,
    Bar,
    BarProps as RechartsBarProperties,
    Cell,
    Line,
    LineProps as RechartsLineProperties,
    Area,
    AreaProps as RechartsAreaProperties,
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
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { isSpecializedInterval } from './utilities/TimeIntervalUtilities';
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
    tipProperties?: Partial<RechartsTooltipProperties<number, string>>;
    tipSortOrder?: 'Descending' | 'Ascending' | false;
    barProperties?: Partial<Omit<RechartsBarProperties, 'ref'>>;
    lineProperties?: Partial<Omit<RechartsLineProperties, 'ref'>>;
    areaProperties?: Partial<Omit<RechartsAreaProperties, 'ref'>>;
    activeLabel?: string | null;
    onLabelClick?: (label: string) => void;
    onReferenceAreaSelect?: (startLabel: string, endLabel: string) => void;
    isStacked?: boolean;
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
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Too many data points ({addCommas(dataPointCount)}).
                    </p>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Adjust your time range or interval.
                    </p>
                </div>
            </div>
        );
    }

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'select-none [&_.recharts-wrapper_:focus:not(:focus-visible)]:outline-none',
                properties.className,
            )}
            ref={containerReference}
        >
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart
                    data={properties.data}
                    onMouseDown={function (chartEvent, mouseEvent: React.SyntheticEvent) {
                        const mouseEventTyped = mouseEvent as React.MouseEvent;

                        // Set active label for both left and right clicks (needed for context menu)
                        if(properties.onLabelClick && chartEvent && chartEvent.activeLabel) {
                            properties.onLabelClick(chartEvent.activeLabel);
                        }

                        // Only handle left clicks for drag-to-zoom (button 0)
                        if(mouseEventTyped.button === 0) {
                            // Call the reference area selection handler for drag-to-zoom
                            referenceAreaSelection.handleMouseDown(chartEvent);
                        }
                    }}
                    onMouseMove={referenceAreaSelection.handleMouseMove}
                    onMouseUp={referenceAreaSelection.handleMouseUp}
                    onMouseLeave={referenceAreaSelection.handleMouseUp}
                >
                    {showGrid && (
                        <CartesianGrid
                            xAxisId="0"
                            yAxisId="left"
                            strokeDasharray="3 3"
                            stroke="var(--border-tertiary)"
                            vertical={false}
                        />
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
                            isAnimationActive={false}
                            {...properties.tipProperties}
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
                            // Default radius for all bars (topLeft, topRight, bottomRight, bottomLeft)
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
                                                ? lightenColor(dataSource.color, 0.15)
                                                : lightenColor(dataSource.color, 0.15),
                                    }}
                                    {...properties.barProperties}
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

                                            // Find the bottom bar (first one with a value > 0)
                                            let bottomBarDataKey: string | null = null;
                                            for(let i = 0; i < stackedDataKeys.length; i++) {
                                                const dataKey = stackedDataKeys[i];
                                                if(!dataKey) continue;
                                                const value = dataPoint[dataKey];
                                                if(typeof value === 'number' && value > 0) {
                                                    bottomBarDataKey = dataKey;
                                                    break;
                                                }
                                            }

                                            // Determine which bar this is in the stack
                                            const isTopBar = topBarDataKey === dataSource.dataKey;
                                            const isBottomBar = bottomBarDataKey === dataSource.dataKey;

                                            // Get the radius from barProperties or use default
                                            const radiusFromProperties = properties.barProperties?.radius as
                                                | [number, number, number, number]
                                                | undefined;
                                            const topRadius = radiusFromProperties || defaultRadius;
                                            const bottomRadius = radiusFromProperties || [0, 0, 0, 0];

                                            // Apply top radius to top bar, bottom radius to bottom bar, no radius to middle bars
                                            let cellRadius: [number, number, number, number];
                                            if(isTopBar && isBottomBar) {
                                                // Single bar - use full radius if provided, otherwise top radius
                                                cellRadius = radiusFromProperties || topRadius;
                                            }
                                            else if(isTopBar) {
                                                // Top bar - use top corners only [topLeft, topRight, 0, 0]
                                                cellRadius = [topRadius[0], topRadius[1], 0, 0];
                                            }
                                            else if(isBottomBar) {
                                                // Bottom bar - use bottom corners only [0, 0, bottomRight, bottomLeft]
                                                cellRadius = [0, 0, bottomRadius[2], bottomRadius[3]];
                                            }
                                            else {
                                                // Middle bar - no radius
                                                cellRadius = [0, 0, 0, 0];
                                            }

                                            return <Cell key={`cell-${index}`} radius={cellRadius as never} />;
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
                                    {...properties.areaProperties}
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
                                    {...properties.lineProperties}
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
