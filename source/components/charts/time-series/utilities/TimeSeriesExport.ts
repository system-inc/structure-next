// Dependencies - Types
import { TimeSeriesDataPoint } from '@structure/source/common/charts/time-series/TimeSeriesChart';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { downloadFile } from '@structure/source/utilities/file/File';
import { titleCase } from '@structure/source/utilities/type/String';

// Type for data source configuration
export interface TimeSeriesExportDataSource {
    id: string;
    name: string;
}

// Function to get time interval column name
export function getTimeIntervalColumnName(timeInterval: TimeInterval): string {
    // Convert the enum value to title case (e.g., "DayOfMonth" -> "Day of Month")
    return titleCase(timeInterval);
}

// Function to convert time series data to CSV format
export function convertTimeSeriesDataToCsv(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
): string {
    if(chartData.length === 0) {
        return '';
    }

    let csv = '';
    const timeColumnName = getTimeIntervalColumnName(timeInterval);

    // Create header row
    const headers = [timeColumnName];
    dataSources.forEach(function (dataSource) {
        headers.push(dataSource.name);
    });
    csv += headers.join(',') + '\n';

    // Create data rows
    chartData.forEach(function (dataPoint) {
        const row = [dataPoint.label];
        dataSources.forEach(function (dataSource) {
            const value = dataPoint[dataSource.id];
            row.push(String(value !== undefined ? value : 0));
        });
        csv += row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    return csv;
}

// Function to convert time series data to JSON format
export function convertTimeSeriesDataToJson(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
): string {
    const timeColumnName = getTimeIntervalColumnName(timeInterval);

    const jsonData = chartData.map(function (dataPoint) {
        const row: Record<string, string | number> = {
            [timeColumnName]: dataPoint.label,
        };

        dataSources.forEach(function (dataSource) {
            const value = dataPoint[dataSource.id];
            row[dataSource.name] = value !== undefined ? value : 0;
        });

        return row;
    });

    return JSON.stringify(jsonData, null, 4);
}

// Export time series data as CSV file
export async function exportTimeSeriesAsCsvFile(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
    fileName: string,
) {
    const csv = convertTimeSeriesDataToCsv(chartData, dataSources, timeInterval);
    downloadFile({
        fileName: fileName,
        content: csv,
        contentType: 'text/csv',
    });
}

// Export time series data as JSON file
export async function exportTimeSeriesAsJsonFile(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
    fileName: string,
) {
    const json = convertTimeSeriesDataToJson(chartData, dataSources, timeInterval);
    downloadFile({
        fileName: fileName,
        content: json,
        contentType: 'application/json',
    });
}

// Copy time series data as CSV to clipboard
export async function copyTimeSeriesAsCsvToClipboard(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
) {
    const csv = convertTimeSeriesDataToCsv(chartData, dataSources, timeInterval);
    await navigator.clipboard.writeText(csv);
}

// Copy time series data as JSON to clipboard
export async function copyTimeSeriesAsJsonToClipboard(
    chartData: TimeSeriesDataPoint[],
    dataSources: TimeSeriesExportDataSource[],
    timeInterval: TimeInterval,
) {
    const json = convertTimeSeriesDataToJson(chartData, dataSources, timeInterval);
    await navigator.clipboard.writeText(json);
}
