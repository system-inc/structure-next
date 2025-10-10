// Dependencies - Types
import { TimeSeriesDataPoint } from '@structure/source/common/charts/time-series/TimeSeriesChart';
import { DataSourceWithMetricsType } from '../Metrics';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { format } from 'date-fns';
import {
    exportTimeSeriesAsCsvFile,
    exportTimeSeriesAsJsonFile,
    copyTimeSeriesAsCsvToClipboard,
    copyTimeSeriesAsJsonToClipboard,
    TimeSeriesExportDataSource,
} from '@structure/source/common/charts/time-series/utilities/TimeSeriesExport';

// Function to get formatted date range for filename
function getDateRangeForFilename(startTime: Date | null, endTime: Date | null): string {
    const start = startTime ? format(startTime, 'yyyy-MM-dd') : 'start';
    const end = endTime ? format(endTime, 'yyyy-MM-dd') : 'end';
    return `${start}-to-${end}`;
}

// Function to convert DataSourceWithMetricsType to TimeSeriesExportDataSource
function convertToExportDataSources(dataSourcesWithMetrics: DataSourceWithMetricsType[]): TimeSeriesExportDataSource[] {
    return dataSourcesWithMetrics.map(function (dataSource) {
        return {
            id: dataSource.id,
            name: `${dataSource.tableName} (${dataSource.databaseName})`,
        };
    });
}

// Export metrics as CSV file
export async function exportMetricsAsCsvFile(
    chartData: TimeSeriesDataPoint[],
    dataSourcesWithMetrics: DataSourceWithMetricsType[],
    timeInterval: TimeInterval,
    startTime: Date | null,
    endTime: Date | null,
) {
    const dateRange = getDateRangeForFilename(startTime, endTime);
    const fileName = `metrics-${dateRange}.csv`;
    const dataSources = convertToExportDataSources(dataSourcesWithMetrics);

    await exportTimeSeriesAsCsvFile(chartData, dataSources, timeInterval, fileName);
}

// Export metrics as JSON file
export async function exportMetricsAsJsonFile(
    chartData: TimeSeriesDataPoint[],
    dataSourcesWithMetrics: DataSourceWithMetricsType[],
    timeInterval: TimeInterval,
    startTime: Date | null,
    endTime: Date | null,
) {
    const dateRange = getDateRangeForFilename(startTime, endTime);
    const fileName = `metrics-${dateRange}.json`;
    const dataSources = convertToExportDataSources(dataSourcesWithMetrics);

    await exportTimeSeriesAsJsonFile(chartData, dataSources, timeInterval, fileName);
}

// Copy metrics as CSV to clipboard
export async function copyMetricsAsCsvToClipboard(
    chartData: TimeSeriesDataPoint[],
    dataSourcesWithMetrics: DataSourceWithMetricsType[],
    timeInterval: TimeInterval,
) {
    const dataSources = convertToExportDataSources(dataSourcesWithMetrics);
    await copyTimeSeriesAsCsvToClipboard(chartData, dataSources, timeInterval);
}

// Copy metrics as JSON to clipboard
export async function copyMetricsAsJsonToClipboard(
    chartData: TimeSeriesDataPoint[],
    dataSourcesWithMetrics: DataSourceWithMetricsType[],
    timeInterval: TimeInterval,
) {
    const dataSources = convertToExportDataSources(dataSourcesWithMetrics);
    await copyTimeSeriesAsJsonToClipboard(chartData, dataSources, timeInterval);
}
