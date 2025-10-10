'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeSeriesDataPoint } from '@structure/source/common/charts/time-series/TimeSeriesChart';
import { DataSourceWithMetricsType } from '../Metrics';
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';

// Dependencies - Hooks
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';

// Dependencies - Utilities
import {
    exportMetricsAsCsvFile,
    exportMetricsAsJsonFile,
    copyMetricsAsCsvToClipboard,
    copyMetricsAsJsonToClipboard,
} from '../utilities/MetricsUtilities';

// Hook - useMetricsExportMenu
export function useMetricsExportMenu(
    chartData: TimeSeriesDataPoint[],
    dataSourcesWithMetrics: DataSourceWithMetricsType[],
    timeInterval: TimeInterval,
    startTime: Date | null | undefined,
    endTime: Date | null | undefined,
): MenuItemProperties[] {
    // Hooks
    const notice = useNotice();

    // Create the export menu items
    const exportMenuItems: MenuItemProperties[] = React.useMemo(
        function () {
            return [
                {
                    id: 'export-csv',
                    content: 'Export as CSV',
                    onSelected: async function () {
                        await exportMetricsAsCsvFile(
                            chartData,
                            dataSourcesWithMetrics,
                            timeInterval,
                            startTime || null,
                            endTime || null,
                        );
                        notice.addNotice({
                            title: 'Metrics Exported as CSV',
                            content: 'The metrics have been exported as a CSV file.',
                        });
                    },
                },
                {
                    id: 'export-json',
                    content: 'Export as JSON',
                    onSelected: async function () {
                        await exportMetricsAsJsonFile(
                            chartData,
                            dataSourcesWithMetrics,
                            timeInterval,
                            startTime || null,
                            endTime || null,
                        );
                        notice.addNotice({
                            title: 'Metrics Exported as JSON',
                            content: 'The metrics have been exported as a JSON file.',
                        });
                    },
                },
                {
                    id: 'copy-csv',
                    content: 'Copy as CSV',
                    onSelected: async function () {
                        await copyMetricsAsCsvToClipboard(chartData, dataSourcesWithMetrics, timeInterval);
                        notice.addNotice({
                            title: 'Metrics Copied as CSV',
                            content: 'The metrics have been copied to your clipboard as CSV.',
                        });
                    },
                },
                {
                    id: 'copy-json',
                    content: 'Copy as JSON',
                    onSelected: async function () {
                        await copyMetricsAsJsonToClipboard(chartData, dataSourcesWithMetrics, timeInterval);
                        notice.addNotice({
                            title: 'Metrics Copied as JSON',
                            content: 'The metrics have been copied to your clipboard as JSON.',
                        });
                    },
                },
            ];
        },
        [chartData, dataSourcesWithMetrics, timeInterval, startTime, endTime, notice],
    );

    return exportMenuItems;
}
