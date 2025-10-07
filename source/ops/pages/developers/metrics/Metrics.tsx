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
import MinusIcon from '@structure/assets/icons/interface/MinusIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import ExportIcon from '@structure/assets/icons/interface/ExportIcon.svg';
import StarsIcon from '@structure/assets/icons/nature/StarsIcon.svg';

// Dependencies - Utilities
import { addDays, endOfToday } from 'date-fns';
import {
    mergeTimeSeriesData,
    fillMissingTimeIntervalValuesWithZeroes,
} from '@structure/source/common/charts/time-series/utilities/TimeSeriesProcessors';
import { calculateTimeIntervalValueStartAndEndDate } from '@structure/source/utilities/ChartData';

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

    // Chart active label for context menu
    const [chartActiveLabel, setChartActiveLabel] = React.useState<string | null>(null);

    // Use the zoom behavior hook for intelligent range selection
    const zoomBehavior = useZoomBehavior({
        currentTimeRange: timeSeriesState.timeRange,
        currentTimeInterval: timeSeriesState.interval,
        onTimeRangeChange: timeSeriesState.setTimeRange,
        onTimeIntervalChange: timeSeriesState.setInterval,
    });

    // Use the zoom controls hook for button-driven zoom in/out
    const zoomControls = useZoomControls({
        currentTimeRange: timeSeriesState.timeRange,
        currentTimeInterval: timeSeriesState.interval,
        onTimeRangeChange: timeSeriesState.setTimeRange,
        onTimeIntervalChange: timeSeriesState.setInterval,
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

            // Convert each data source to the format needed by mergeTimeSeriesData
            const dataSeries = dataSourcesWithMetrics.map(function (dataSource) {
                const rawData = dataSource.metrics.data.map(function ([timeIntervalValue, total]) {
                    // Normalize hour and minute format: server returns "2025-10-01 20:00:00" but we need "2025-10-01T20:00:00"
                    let normalizedTimeIntervalValue = timeIntervalValue;
                    if(
                        (timeSeriesState.interval === TimeInterval.Hour ||
                            timeSeriesState.interval === TimeInterval.Minute) &&
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
                    timeSeriesState.interval,
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
            timeSeriesState.timeRange.startTime,
            timeSeriesState.timeRange.endTime,
            timeSeriesState.interval,
        ],
    );

    // Transform data sources to TimeSeries format
    const timeSeriesDataSources = React.useMemo(
        function () {
            return dataSourcesWithMetrics.map(function (dataSource) {
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
        [dataSourcesWithMetrics],
    );

    // Create the context menu items
    const contextMenuItems: MenuItemProperties[] = React.useMemo(
        function () {
            const items: MenuItemProperties[] = [];

            if(chartActiveLabel) {
                const timeIntervalValueStartAndEndDate = calculateTimeIntervalValueStartAndEndDate(
                    chartActiveLabel,
                    timeSeriesState.interval,
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
        [chartActiveLabel, dataSources, timeSeriesState.interval],
    );

    // Render the component
    return (
        <>
            {/* Display Options */}
            <div className="mb-12 w-full overflow-x-auto">
                <div className="mb-4 ml-auto flex w-min space-x-2">
                    {/* Time Series Controls */}
                    <TimeSeriesControls
                        timeRange={timeSeriesState.timeRange}
                        onTimeRangeChange={timeSeriesState.setTimeRange}
                        timeInterval={timeSeriesState.interval}
                        onTimeIntervalChange={timeSeriesState.setInterval}
                        chartType={timeSeriesState.chartType}
                        onChartTypeChange={timeSeriesState.setChartType}
                        sortOrder={timeSeriesState.sortOrder}
                        onSortOrderChange={timeSeriesState.setSortOrder}
                    >
                        {/* Zoom Out Button */}
                        <div className="mt-[22px]">
                            <Button
                                size={'formInputIcon'}
                                className="group relative aspect-square px-2"
                                onClick={zoomControls.zoomOut}
                                tip="Zoom Out"
                            >
                                <MinusIcon className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Zoom In Button */}
                        <div className="mt-[22px]">
                            <Button
                                size={'formInputIcon'}
                                className="group relative aspect-square px-2"
                                onClick={zoomControls.zoomIn}
                                tip="Zoom In"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Export Icon */}
                        <div className="mt-[22px]">
                            <Dialog header="Export" content="Feature coming soon!" footerCloseButton={true}>
                                <Button
                                    size={'formInputIcon'}
                                    className="group relative aspect-square px-2"
                                    tip="Export"
                                >
                                    <ExportIcon className="h-full w-full scale-110" />
                                </Button>
                            </Dialog>
                        </div>

                        {/* Explain with AI Button */}
                        <div className="mt-[22px]">
                            <Dialog header="Explain" content="Feature coming soon!" footerCloseButton={true}>
                                <Button
                                    size={'formInputIcon'}
                                    className="group relative aspect-square px-2"
                                    tip="Explain"
                                >
                                    <StarsIcon className="h-full w-full scale-150" />
                                </Button>
                            </Dialog>
                        </div>

                        {/* Refresh Button */}
                        <div className="mt-[22px]">
                            <RefreshButton
                                size={'formInputIcon'}
                                onClick={async () => {
                                    await networkService.refreshActiveRequests();
                                }}
                            />
                        </div>

                        {/* Reset Zoom Button (if zoomed) */}
                        {zoomBehavior.isZoomed && (
                            <div className="mt-[22px]">
                                <Button
                                    size={'formInputIcon'}
                                    className="group relative aspect-square px-2"
                                    onClick={zoomBehavior.resetZoom}
                                    tip="Reset Zoom"
                                >
                                    Reset
                                </Button>
                            </div>
                        )}
                    </TimeSeriesControls>
                </div>
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
                        timeInterval={timeSeriesState.interval}
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
                    timeInterval: timeSeriesState.interval,
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
