'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsArrayOf, parseAsJson } from 'nuqs';

// Dependencies - Main Components
import { TimeSeriesChart, TimeSeriesDataPoint } from '@structure/source/common/charts/time-series/TimeSeriesChart';
import { TimeSeriesContainer } from '@structure/source/common/charts/time-series/TimeSeriesContainer';
import { TimeSeriesControls } from '@structure/source/common/charts/time-series/controls/TimeSeriesControls';
import { DataSources } from './DataSources';

// Dependencies - Supporting Components
import { Button } from '@structure/source/common/buttons/Button';
import { RefreshButton } from '@structure/source/common/buttons/RefreshButton';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { ContextMenu } from '@structure/source/common/menus/ContextMenu';
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';

// Dependencies - Hooks
import { useTimeSeriesState } from '@structure/source/common/charts/time-series/hooks/useTimeSeriesState';
import { useZoomBehavior } from '@structure/source/common/charts/time-series/hooks/useZoomBehavior';
import { useZoomControls } from '@structure/source/common/charts/time-series/hooks/useZoomControls';

// Dependencies - API
import { networkService } from '@structure/source/services/network/NetworkService';
import { ColumnFilterConditionOperator } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { PlusIcon, MinusIcon, ExportIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { addDays, endOfToday } from 'date-fns';
import {
    mergeTimeSeriesData,
    fillMissingTimeIntervalValuesWithZeroes,
} from '@structure/source/common/charts/time-series/utilities/TimeSeriesProcessors';
import { calculateTimeIntervalValueStartAndEndDate } from '@structure/source/utilities/ChartData';
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Types - Data Source
export type DataSourceType = {
    id: string;
    databaseName: string;
    tableName: string;
    columnName: string;
    color: string;
    yAxisAlignment: 'left' | 'right';
    lineStyle: 'solid' | 'dashed' | 'dotted';
};

// Types - Data Source with Metrics
export type DataSourceWithMetricsType = DataSourceType & {
    metrics: {
        timeInterval: TimeInterval;
        data: Array<[string, number]>;
    };
};

// Component - Metrics
export function Metrics() {
    // Use the TimeSeries state hook for state management
    const timeSeriesState = useTimeSeriesState({
        defaultTimeRange: {
            startTime: addDays(endOfToday(), -27),
            endTime: endOfToday(),
        },
        defaultTimeInterval: TimeInterval.Day,
        defaultChartType: 'Bar',
        defaultSortOrder: 'Ascending',
        synchronizeWithUrl: true,
    });

    // Data sources are stored using URL search parameters
    const [dataSources, setDataSources] = useUrlQueryState(
        'dataSources',
        parseAsArrayOf(
            parseAsJson<DataSourceType>(function (value) {
                return value as DataSourceType;
            }),
        ).withDefault([]),
    );

    // Data sources with metrics is stored using React state
    const [dataSourcesWithMetrics, setDataSourcesWithMetrics] = React.useState<DataSourceWithMetricsType[]>([]);

    // Chart loading state
    const [chartLoading, setChartLoading] = React.useState(true);

    // Automatically add one data source on initial page load
    React.useEffect(
        function () {
            if(dataSources.length === 0) {
                setDataSources([
                    {
                        id: uniqueIdentifier(8),
                        databaseName: '',
                        tableName: '',
                        columnName: '',
                        color: '#3b82f6', // blue-500 (first color in palette)
                        yAxisAlignment: 'left',
                        lineStyle: 'solid',
                    },
                ]);
            }
        },
        // Only run once on mount
        [],
    );

    // Chart active label for context menu
    const [chartActiveLabel, setChartActiveLabel] = React.useState<string | null>(null);

    // Use the zoom behavior hook for intelligent range selection
    const zoomBehavior = useZoomBehavior({
        currentTimeRange: timeSeriesState.timeRange,
        currentTimeInterval: timeSeriesState.timeInterval,
        onTimeRangeChange: timeSeriesState.setTimeRange,
        onTimeIntervalChange: timeSeriesState.setTimeInterval,
    });

    // Use the zoom controls hook for button-driven zoom in/out
    const zoomControls = useZoomControls({
        currentTimeRange: timeSeriesState.timeRange,
        currentTimeInterval: timeSeriesState.timeInterval,
        onTimeRangeChange: timeSeriesState.setTimeRange,
        onTimeIntervalChange: timeSeriesState.setTimeInterval,
    });

    // Memoize the chart error message
    const chartError = React.useMemo<{
        message: string;
        type: 'error' | 'warning';
    } | null>(
        function () {
            // If there are no data sources, display a warning message
            if(dataSources.length <= 0) {
                return {
                    message: 'No data to display. Add a data source.',
                    type: 'warning',
                };
            }
            // By default show a loading state
            else if(chartLoading) {
                return {
                    message: 'Loading...',
                    type: 'warning',
                };
            }
            // If there are no data points, display a warning message
            else if(dataSourcesWithMetrics.length <= 0) {
                return {
                    message: 'No data to display. Select a different date range, table, or column.',
                    type: 'warning',
                };
            }

            return null;
        },
        [dataSourcesWithMetrics.length, chartLoading, dataSources.length],
    );

    // Transform database metrics to TimeSeries format
    const chartData: TimeSeriesDataPoint[] = React.useMemo(
        function () {
            if(dataSourcesWithMetrics.length === 0) {
                return [];
            }

            // Reorder dataSourcesWithMetrics to match the order in dataSources
            const orderedDataSourcesWithMetrics = dataSources
                .map(function (dataSource) {
                    return dataSourcesWithMetrics.find(function (ds) {
                        return ds.id === dataSource.id;
                    });
                })
                .filter(function (ds): ds is DataSourceWithMetricsType {
                    return ds !== undefined;
                });

            // Convert each data source to the format needed by mergeTimeSeriesData
            const dataSeries = orderedDataSourcesWithMetrics.map(function (dataSource) {
                const rawData = dataSource.metrics.data.map(function ([timeIntervalValue, total]) {
                    // Normalize hour and minute format: server returns "2025-10-01 20:00:00" but we need "2025-10-01T20:00:00"
                    let normalizedTimeIntervalValue = timeIntervalValue;
                    if(
                        (timeSeriesState.timeInterval === TimeInterval.Hour ||
                            timeSeriesState.timeInterval === TimeInterval.Minute) &&
                        typeof timeIntervalValue === 'string'
                    ) {
                        normalizedTimeIntervalValue = timeIntervalValue.replace(' ', 'T');
                    }

                    return {
                        timeIntervalValue: normalizedTimeIntervalValue,
                        total,
                    };
                });

                // Fill missing intervals with zeroes to ensure full range is shown
                const startTime = timeSeriesState.timeRange.startTime || addDays(endOfToday(), -27);
                const endTime = timeSeriesState.timeRange.endTime || endOfToday();
                const filledData = fillMissingTimeIntervalValuesWithZeroes(
                    rawData,
                    startTime,
                    endTime,
                    timeSeriesState.timeInterval,
                );

                return {
                    key: dataSource.id,
                    data: filledData,
                };
            });

            // Merge all data series into a single dataset
            return mergeTimeSeriesData(dataSeries);
        },
        [
            dataSourcesWithMetrics,
            dataSources,
            timeSeriesState.timeRange.startTime,
            timeSeriesState.timeRange.endTime,
            timeSeriesState.timeInterval,
        ],
    );

    // Transform data sources to TimeSeries format
    const timeSeriesDataSources = React.useMemo(
        function () {
            // Reorder dataSourcesWithMetrics to match the order in dataSources
            const orderedDataSourcesWithMetrics = dataSources
                .map(function (dataSource) {
                    return dataSourcesWithMetrics.find(function (ds) {
                        return ds.id === dataSource.id;
                    });
                })
                .filter(function (ds): ds is DataSourceWithMetricsType {
                    return ds !== undefined;
                });

            return orderedDataSourcesWithMetrics.map(function (dataSource) {
                return {
                    id: dataSource.id,
                    dataKey: dataSource.id,
                    name: `${dataSource.tableName} (${dataSource.databaseName})`,
                    color: dataSource.color,
                    yAxisAlignment: dataSource.yAxisAlignment,
                    lineStyle: dataSource.lineStyle,
                };
            });
        },
        [dataSourcesWithMetrics, dataSources],
    );

    // Create the context menu items
    const contextMenuItems: MenuItemProperties[] = React.useMemo(
        function () {
            const items: MenuItemProperties[] = [];

            if(chartActiveLabel) {
                const timeIntervalValueStartAndEndDate = calculateTimeIntervalValueStartAndEndDate(
                    chartActiveLabel,
                    timeSeriesState.timeInterval,
                );

                const dataSourceMenuItems = dataSources.map(function (dataSource) {
                    return {
                        id: dataSource.id,
                        content: 'View Records for ' + dataSource.tableName + ' (' + dataSource.databaseName + ')',
                        href:
                            '/ops/developers/data?page=1&databaseName=' +
                            dataSource.databaseName +
                            '&tableName=' +
                            dataSource.tableName +
                            '&filters=' +
                            encodeURIComponent(
                                JSON.stringify({
                                    operator: 'And',
                                    conditions: [
                                        {
                                            column: 'createdAt',
                                            operator: ColumnFilterConditionOperator.GreaterThanOrEqual,
                                            value: timeIntervalValueStartAndEndDate.startDate.toISOString(),
                                        },
                                        {
                                            column: 'createdAt',
                                            operator: ColumnFilterConditionOperator.LessThanOrEqual,
                                            value: timeIntervalValueStartAndEndDate.endDate.toISOString(),
                                        },
                                    ],
                                }),
                            ),
                        target: '_blank',
                    };
                });

                if(dataSourceMenuItems.length) {
                    items.push(...dataSourceMenuItems);
                }
            }

            return items;
        },
        [chartActiveLabel, dataSources, timeSeriesState.timeInterval],
    );

    // Render the component
    return (
        <>
            {/* Display Options */}
            <div className="mb-12 w-full overflow-x-auto">
                {/* Time Series Controls */}
                <TimeSeriesControls
                    timeRange={timeSeriesState.timeRange}
                    onTimeRangeChange={timeSeriesState.setTimeRange}
                    timeInterval={timeSeriesState.timeInterval}
                    onTimeIntervalChange={timeSeriesState.setTimeInterval}
                    chartType={timeSeriesState.chartType}
                    onChartTypeChange={timeSeriesState.setChartType}
                    sortOrder={timeSeriesState.sortOrder}
                    onSortOrderChange={timeSeriesState.setSortOrder}
                >
                    {/* Zoom In Button */}
                    <Button
                        size={'formInputIcon'}
                        className="group relative aspect-square px-2"
                        onClick={zoomControls.zoomIn}
                        tip="Zoom In"
                    >
                        <PlusIcon size={20} />
                    </Button>

                    {/* Zoom Out Button */}
                    <Button
                        size={'formInputIcon'}
                        className="group relative aspect-square px-2"
                        onClick={zoomControls.zoomOut}
                        tip="Zoom Out"
                    >
                        <MinusIcon size={20} />
                    </Button>

                    {/* Export Icon */}
                    <Dialog header="Export" content="Feature coming soon!" footerCloseButton={true}>
                        <Button size={'formInputIcon'} className="group relative aspect-square px-2" tip="Export">
                            <ExportIcon size={20} />
                        </Button>
                    </Dialog>

                    {/* Refresh Button */}
                    <RefreshButton
                        size={'formInputIcon'}
                        onClick={async () => {
                            await networkService.refreshActiveRequests();
                        }}
                    />

                    {/* Reset Zoom Button (if zoomed) */}
                    {zoomBehavior.isZoomed && (
                        <Button
                            size={'formInputIcon'}
                            className="group relative aspect-square px-2"
                            onClick={zoomBehavior.resetZoom}
                            tip="Reset Zoom"
                        >
                            Reset
                        </Button>
                    )}
                </TimeSeriesControls>
            </div>

            {/* Chart */}
            <TimeSeriesContainer
                isLoading={chartLoading && dataSources.length > 0}
                error={chartError?.type === 'error' ? new Error(chartError.message) : null}
            >
                <ContextMenu items={contextMenuItems} closeOnItemSelected={true}>
                    <TimeSeriesChart
                        data={chartData}
                        dataSources={timeSeriesDataSources}
                        chartType={timeSeriesState.chartType}
                        timeInterval={timeSeriesState.timeInterval}
                        height={384}
                        showGrid={true}
                        showXAxis={true}
                        showYAxis={true}
                        showTooltip={true}
                        activeLabel={chartActiveLabel}
                        onLabelClick={setChartActiveLabel}
                        onReferenceAreaSelect={zoomBehavior.handleSelection}
                        tipSortOrder={timeSeriesState.sortOrder === 'Ascending' ? 'Ascending' : 'Descending'}
                    />
                </ContextMenu>
            </TimeSeriesContainer>

            {/* A line to separate the options from the graph */}
            <div className="mt-1 mb-4 border-t border-light-4 md:mt-6 md:mb-6 dark:border-dark-4"></div>

            {/* DataSources */}
            <DataSources
                key={dataSources[0]?.id}
                settings={{
                    timeInterval: timeSeriesState.timeInterval,
                    dataSources: dataSources,
                    endTime: timeSeriesState.timeRange.endTime
                        ? new Date(timeSeriesState.timeRange.endTime)
                        : new Date(),
                    startTime: timeSeriesState.timeRange.startTime
                        ? new Date(timeSeriesState.timeRange.startTime)
                        : addDays(new Date(), -30),
                    chartType:
                        timeSeriesState.chartType === 'Bar'
                            ? 'bar'
                            : timeSeriesState.chartType === 'Line'
                              ? 'line'
                              : 'area',
                }}
                setDataSources={setDataSources}
                setDataSourcesWithMetrics={setDataSourcesWithMetrics}
                error={chartError?.type === 'error'}
                setLoading={setChartLoading}
            />
        </>
    );
}
