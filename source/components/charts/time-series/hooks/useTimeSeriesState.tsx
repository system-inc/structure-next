'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsStringEnum, parseAsJson } from 'nuqs';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
import { ChartType } from '../controls/ChartTypeFormInputSelect';
import { SortOrderType } from '../controls/SortOrderToggle';

// Dependencies - Utilities
import { addDays, endOfToday } from 'date-fns';

// Types
export interface TimeSeriesStateOptions {
    defaultTimeRange?: TimeRangeType;
    defaultTimeInterval?: TimeInterval;
    defaultChartType?: ChartType;
    defaultSortOrder?: SortOrderType;
    urlPrefix?: string; // Prefix for URL params to avoid conflicts
    synchronizeWithUrl?: boolean; // Whether to sync state with URL parameters (default: true)
}

export interface TimeSeriesState {
    timeRange: TimeRangeType;
    setTimeRange: (value: TimeRangeType) => void;
    timeInterval: TimeInterval;
    setTimeInterval: (value: TimeInterval) => void;
    chartType: ChartType;
    setChartType: (value: ChartType) => void;
    sortOrder: SortOrderType;
    setSortOrder: (value: SortOrderType) => void;
}

// Constants
const possibleChartTypes = ['Bar', 'Line', 'Area'] as ChartType[];
const possibleSortOrders = ['Ascending', 'Descending'] as SortOrderType[];

// Hook - useTimeSeriesState
export function useTimeSeriesState(options?: TimeSeriesStateOptions): TimeSeriesState {
    // Extract options with defaults
    const defaultTimeRange = options?.defaultTimeRange || {
        // Default to the last 28 days
        startTime: addDays(endOfToday(), -27),
        endTime: endOfToday(),
    };
    const defaultInterval = options?.defaultTimeInterval || TimeInterval.Day;
    const defaultChartType = options?.defaultChartType || 'Bar';
    const defaultSortOrder = options?.defaultSortOrder || 'Ascending';
    const urlPrefix = options?.urlPrefix || '';
    const synchronizeWithUrl = options?.synchronizeWithUrl !== false; // Default to true

    // Local state hooks (used when not syncing with URL)
    const [localTimeRange, setLocalTimeRange] = React.useState<TimeRangeType>(defaultTimeRange);
    const [localInterval, setLocalInterval] = React.useState<TimeInterval>(defaultInterval);
    const [localChartType, setLocalChartType] = React.useState<ChartType>(defaultChartType);
    const [localSortOrder, setLocalSortOrder] = React.useState<SortOrderType>(defaultSortOrder);

    // URL state hooks (used when syncing with URL)
    // We use null as initial value when not syncing to avoid creating URL params
    const [urlChartType, setUrlChartType] = useUrlQueryState<ChartType>(
        synchronizeWithUrl ? `${urlPrefix}chartType` : 'disabled-chartType',
        synchronizeWithUrl
            ? parseAsStringEnum(possibleChartTypes).withDefault(defaultChartType)
            : parseAsStringEnum(possibleChartTypes)
                  .withDefault(defaultChartType)
                  .withOptions({ shallow: false, scroll: false, history: 'replace' }),
    );

    const [urlSortOrder, setUrlSortOrder] = useUrlQueryState<SortOrderType>(
        synchronizeWithUrl ? `${urlPrefix}sort` : 'disabled-sort',
        synchronizeWithUrl
            ? parseAsStringEnum(possibleSortOrders).withDefault(defaultSortOrder)
            : parseAsStringEnum(possibleSortOrders)
                  .withDefault(defaultSortOrder)
                  .withOptions({ shallow: false, scroll: false, history: 'replace' }),
    );

    const [urlTimeInterval, setUrlTimeInterval] = useUrlQueryState<TimeInterval>(
        synchronizeWithUrl ? `${urlPrefix}timeInterval` : 'disabled-timeInterval',
        synchronizeWithUrl
            ? parseAsStringEnum(Object.keys(TimeInterval) as TimeInterval[]).withDefault(defaultInterval)
            : parseAsStringEnum(Object.keys(TimeInterval) as TimeInterval[])
                  .withDefault(defaultInterval)
                  .withOptions({ shallow: false, scroll: false, history: 'replace' }),
    );

    const [urlTimeRange, setUrlTimeRange] = useUrlQueryState<TimeRangeType>(
        synchronizeWithUrl ? `${urlPrefix}timeRange` : 'disabled-timeRange',
        synchronizeWithUrl
            ? parseAsJson<TimeRangeType>(function (value) {
                  return value as TimeRangeType;
              }).withDefault(defaultTimeRange)
            : parseAsJson<TimeRangeType>(function (value) {
                  return value as TimeRangeType;
              })
                  .withDefault(defaultTimeRange)
                  .withOptions({ shallow: false, scroll: false, history: 'replace' }),
    );

    // Choose which state to use based on syncWithUrl option
    const chartType = synchronizeWithUrl ? urlChartType : localChartType;
    const setChartType = synchronizeWithUrl ? setUrlChartType : setLocalChartType;

    const sortOrder = synchronizeWithUrl ? urlSortOrder : localSortOrder;
    const setSortOrder = synchronizeWithUrl ? setUrlSortOrder : setLocalSortOrder;

    const timeInterval = synchronizeWithUrl ? urlTimeInterval : localInterval;
    const setTimeInterval = synchronizeWithUrl ? setUrlTimeInterval : setLocalInterval;

    const timeRange = synchronizeWithUrl ? urlTimeRange : localTimeRange;
    const setTimeRange = synchronizeWithUrl ? setUrlTimeRange : setLocalTimeRange;

    // Return the state and setters
    return {
        timeRange,
        setTimeRange: function (value: TimeRangeType) {
            setTimeRange(value);
        },
        timeInterval: timeInterval,
        setTimeInterval: setTimeInterval,
        chartType,
        setChartType,
        sortOrder,
        setSortOrder,
    };
}
