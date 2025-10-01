'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { TimeInterval } from '../TimeInterval';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';

// Type - CachedDataEntry
interface CachedDataEntry {
    startTime: Date;
    endTime: Date;
    interval: TimeInterval;
    data: unknown;
}

// Type - UseTimeSeriesDataWithCacheOptions
export interface UseTimeSeriesDataWithCacheOptions<TVariables> {
    // Current time series state
    currentTimeRange: TimeRangeType;
    currentInterval: TimeInterval;

    // Variables for the data fetching hook
    variables: TVariables;

    // Whether caching is enabled (default: true)
    enabled?: boolean;
}

// Type - UseTimeSeriesDataWithCacheResult
export interface UseTimeSeriesDataWithCacheResult<TVariables> {
    // The variables to pass to the actual data fetching hook
    fetchVariables: TVariables;
    // Whether we should use cached data instead of the hook result
    useCachedData: boolean;
    // Function to store data in cache
    cacheData: (data: unknown, actualStartTime: Date, actualEndTime: Date, actualInterval: TimeInterval) => void;
    // Function to get cached data
    getCachedData: () => unknown | null;
}

// Helper function to check if cached data covers the requested range
function cachedDataCoversRange(
    cache: CachedDataEntry | null,
    requestedStart: Date,
    requestedEnd: Date,
    requestedInterval: TimeInterval,
): boolean {
    if(!cache) {
        return false;
    }

    // Cache only valid if intervals match exactly
    if(cache.interval !== requestedInterval) {
        return false;
    }

    // Cache must cover the requested time range
    return cache.startTime <= requestedStart && cache.endTime >= requestedEnd;
}

// Hook - useTimeSeriesDataWithCache
export function useTimeSeriesDataWithCache<TVariables extends Record<string, unknown>>(
    options: UseTimeSeriesDataWithCacheOptions<TVariables>,
): UseTimeSeriesDataWithCacheResult<TVariables> {
    // Current time series state
    const currentTimeRange = options.currentTimeRange;
    const currentInterval = options.currentInterval;

    // Variables for data fetching
    const variables = options.variables;
    const enabled = options.enabled !== undefined ? options.enabled : true;

    // Cache storage
    const cacheReference = React.useRef<CachedDataEntry | null>(null);

    // Determine the time range
    const startTime = currentTimeRange.startTime || new Date();
    const endTime = currentTimeRange.endTime || new Date();

    // Check if we can use cached data
    const canUseCachedData = cachedDataCoversRange(cacheReference.current, startTime, endTime, currentInterval);

    // Function to cache data
    const cacheData = React.useCallback(
        function (data: unknown, actualStartTime: Date, actualEndTime: Date, actualInterval: TimeInterval) {
            if(enabled) {
                cacheReference.current = {
                    startTime: actualStartTime,
                    endTime: actualEndTime,
                    interval: actualInterval,
                    data: data,
                };
            }
        },
        [enabled],
    );

    // Function to get cached data
    const getCachedData = React.useCallback(function () {
        return cacheReference.current?.data || null;
    }, []);

    return {
        fetchVariables: variables,
        useCachedData: canUseCachedData,
        cacheData,
        getCachedData,
    };
}
