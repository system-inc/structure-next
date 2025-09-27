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
    Line,
    Area,
} from 'recharts';
import { TimeSeriesTip } from './TimeSeriesTip';
import { TimeSeriesAxes } from './components/TimeSeriesAxes';
import { TimeSeriesReferenceArea } from './components/TimeSeriesReferenceArea';

// Dependencies - Hooks
import { useReferenceAreaSelection } from './hooks/useReferenceAreaSelection';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Utilities
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { lightenColor, darkenColor, setTransparency } from '@structure/source/utilities/Color';

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
}

// Component - TimeSeriesChart
export function TimeSeriesChart(properties: TimeSeriesChartProperties) {
    // Hooks
    const themeSettings = useThemeSettings();
    const isDarkMode = themeSettings.themeClassName === 'dark';

    // Hooks for reference area selection
    const referenceAreaSelection = useReferenceAreaSelection(properties.onReferenceAreaSelect);

    // Memoized values
    const chartHeight = properties.height || 300;
    const showGrid = properties.showGrid !== false;
    const showXAxis = properties.showXAxis !== false;
    const showYAxis = properties.showYAxis !== false;
    const showTooltip = properties.showTooltip !== false;

    // State to track container width for bar cursor calculation
    const [containerWidth, setContainerWidth] = React.useState<number>(600);
    const containerReference = React.useRef<HTMLDivElement>(null);

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

    // Render the component
    return (
        <div className={properties.className} ref={containerReference}>
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

                    <TimeSeriesAxes
                        showXAxis={showXAxis}
                        showYAxis={showYAxis}
                        data={properties.data}
                        dataSources={properties.dataSources}
                        timeInterval={properties.timeInterval || TimeInterval.Day}
                    />

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
                            // Use rounded corners only for non-stacked bars
                            const barRadius: [number, number, number, number] = isStackedBar
                                ? [0, 0, 0, 0]
                                : [4, 4, 0, 0];

                            return (
                                <Bar
                                    key={dataSource.id}
                                    dataKey={dataSource.dataKey}
                                    name={dataSource.name}
                                    fill={dataSource.color}
                                    radius={barRadius}
                                    yAxisId={yAxisId}
                                    animationDuration={0}
                                    stackId={isStackedBar ? 'stack' : undefined}
                                    activeBar={{
                                        fill:
                                            themeSettings.themeClassName === 'light'
                                                ? lightenColor(dataSource.color, 0.05)
                                                : lightenColor(dataSource.color, 0.05),
                                    }}
                                />
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

                    <TimeSeriesReferenceArea
                        referenceAreaStart={referenceAreaSelection.referenceAreaStart}
                        referenceAreaEnd={referenceAreaSelection.referenceAreaEnd}
                        onReferenceAreaSelect={properties.onReferenceAreaSelect}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
