'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsArrayOf, parseAsJson, parseAsStringEnum } from 'nuqs';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Chart } from './Chart';
import { DataSources } from './DataSources';

// Dependencies - Supporting Components
import { Button } from '@structure/source/common/buttons/Button';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
import { FormInputTimeRange } from '@structure/source/common/forms/FormInputTimeRange';
import { FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { RefreshButton } from '@structure/source/common/buttons/RefreshButton';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { ContextMenu } from '@structure/source/common/menus/ContextMenu';
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';

// Dependencies - API
import { useApolloClient } from '@apollo/client';
import { ColumnFilterConditionOperator, TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import MinusIcon from '@structure/assets/icons/interface/MinusIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import ExportIcon from '@structure/assets/icons/interface/ExportIcon.svg';
import StarsIcon from '@structure/assets/icons/nature/StarsIcon.svg';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';
import { getComplementaryHexColor, hexStringToRgbaString } from '@structure/source/utilities/Color';
import {
    fillMissingIntervalValuesWithZeroes,
    convertIntervalValueToDate,
    calculateTimeIntervalValueStartAndEndDate,
} from '@structure/source/utilities/ChartData';
import {
    // Adding and subtracting time
    addHours,
    subHours,
    addDays,
    subDays,
    addMonths,
    subMonths,
    addYears,
    subYears,

    // Marking the start of a period
    startOfHour,
    startOfDay,
    startOfToday,
    startOfMonth,
    startOfYear,

    // Marking the end of a period
    endOfHour,
    endOfDay,
    endOfToday,
    endOfMonth,
    endOfYear,

    // Calculating the difference between two dates
    differenceInHours,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from 'date-fns';

// Types - Chart Type - The type of chart to display
type ChartType = 'bar' | 'line' | 'area';
const possibleChartTypes = ['bar', 'line', 'area'] as ChartType[];

// Types - Sort Order - The sort order of the data points
type SortOrderType = 'ASC' | 'DESC';
const possibleSortOrders = ['ASC', 'DESC'] as SortOrderType[];

// Types - Data Source - The settings for each data source
export type DataSourceType = {
    id: string;
    databaseName: string;
    tableName: string;
    columnName: string;
    color: string;
    yAxisAlignment: 'left' | 'right';
    lineStyle: 'solid' | 'dashed' | 'dotted';
};

// Types - Data Source - The settings for each data source with the metrics data
export type DataSourceWithMetricsType = DataSourceType & {
    metrics: Record<string, unknown>;
};

// Component - Metrics
// The higher level component used to render both the chart and the controls
export function Metrics() {
    // Use the Apollo Client for refetching queries with the refresh button
    const apolloClient = useApolloClient();

    // Use the URL search parameters to store the state of the component
    const urlSearchParameters = useUrlSearchParameters();

    // Chart type is stored using URL search parameters
    const [chartType, setChartType] = useUrlQueryState<ChartType>(
        'chartType',
        parseAsStringEnum(possibleChartTypes).withDefault('bar'),
    );

    // Sort order is stored using URL search parameters
    const [sortOrder, setSortOrder] = useUrlQueryState<SortOrderType>(
        'sort',
        parseAsStringEnum(possibleSortOrders).withDefault('ASC'),
    );

    // Interval is stored using URL search parameters
    const [timeInterval, setTimeInterval] = useUrlQueryState<TimeInterval>(
        'timeInterval',
        parseAsStringEnum(Object.keys(TimeInterval) as TimeInterval[]).withDefault(TimeInterval.Day),
    );

    // Date range is stored using URL search parameters
    const [timeRange, setTimeRange] = useUrlQueryState<TimeRangeType>(
        'timeRange',
        parseAsJson<TimeRangeType>(function (value) {
            return value as TimeRangeType;
        }).withDefault({
            startTime: addDays(endOfToday(), -27),
            endTime: endOfToday(),
        }),
    );
    // console.log('timeRange', timeRange);

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
    // This is an array of objects that contain the data for each metric
    // Each object has a "metrics" key is an object that has an "timeInterval" and "data" property
    // "data" is an array of arrays that contain the data points for each metric [timeIntervalValue, total]
    const [dataSourcesWithMetrics, setDataSourcesWithMetrics] = React.useState<DataSourceWithMetricsType[]>([]);
    // console.log('Metrics.tsx dataSourcesWithMetrics', dataSourcesWithMetrics);

    // Memoize the start and end dates from the date range
    const startTime = React.useMemo(
        function () {
            return timeRange.startTime ? new Date(timeRange.startTime) : startOfToday();
        },
        [timeRange.startTime],
    );
    const endTime = React.useMemo(
        function () {
            return timeRange.endTime ? new Date(timeRange.endTime) : undefined;
        },
        [timeRange.endTime],
    );
    // console.log("startTime", startTime);
    // console.log("endTime", endTime);

    // Cache the length of the chart data array
    const dataSourcesWithMetricsLength = dataSourcesWithMetrics.length;

    // Initialize chart loading state with true
    const [chartLoading, setChartLoading] = React.useState(true);

    // Keep track of the chart active label
    const [chartActiveLabel, setChartActiveLabel] = React.useState<string | null>(null);

    // Memoize the chart error message
    const chartError = React.useMemo<{
        message: string;
        type: 'error' | 'warning';
    } | null>(
        function () {
            // Use the interval and start and end dates to determine how many data points will be generated
            let numberOfDataPoints = 0;
            if(startTime && endTime) {
                if(timeInterval === TimeInterval.Year) {
                    numberOfDataPoints = endTime.getFullYear() - startTime.getFullYear() + 1;
                }
                else if(timeInterval === TimeInterval.Quarter) {
                    numberOfDataPoints = 4 * (endTime.getFullYear() - startTime.getFullYear()) + 4;
                }
                else if(timeInterval === TimeInterval.Month) {
                    numberOfDataPoints = 12 * (endTime.getFullYear() - startTime.getFullYear()) + 12;
                }
                else if(timeInterval === TimeInterval.Day) {
                    numberOfDataPoints = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 3600 * 24));
                }
                else if(timeInterval === TimeInterval.Hour) {
                    numberOfDataPoints = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 3600));
                }
            }

            // If there are more than 1,000 data points, display an error message
            if(numberOfDataPoints >= 1000) {
                setDataSourcesWithMetrics([]);

                return {
                    message: 'Too many data points to display. Select a smaller date range or change your interval.',
                    type: 'error',
                };
            }
            // If there are no data sources, display a warning message
            else if(dataSources.length <= 0) {
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
            else if(dataSourcesWithMetricsLength <= 0) {
                return {
                    message: 'No data to display. Select a different date range, table, or column.',
                    type: 'warning',
                };
            }

            return null;
        },
        [endTime, timeInterval, startTime, dataSourcesWithMetricsLength, chartLoading, dataSources.length],
    );

    // Sort dataSourcesWithMetrics by the order of the dataSources array
    const sortedDataSourcesWithMetrics = dataSources
        .map(function (dataSources) {
            const dataSourceWithMetrics = dataSourcesWithMetrics.find((dataSourceWithMetrics) => {
                return dataSourceWithMetrics.id === dataSources.id;
            });

            return dataSourceWithMetrics;
        })
        // Filter out undefined values
        .filter(function (dataSourceWithMetrics) {
            return dataSourceWithMetrics !== undefined;
        }) as DataSourceWithMetricsType[];
    // console.log('Metrics.tsx sortedDataSourcesWithMetrics', sortedDataSourcesWithMetrics);

    // Fill in missing zeroes for each metric
    const dataSourcesWithMetricsFilledWithZeroes = sortedDataSourcesWithMetrics.map((data) => {
        const filledInMetricData = fillMissingIntervalValuesWithZeroes(
            data.metrics.timeInterval as TimeInterval,
            data.metrics.data as [string, number][],
            startTime,
            endTime,
        );

        // Return the data with the filled in zeroes
        return {
            ...data,
            metrics: {
                ...data.metrics,
                data: filledInMetricData,
            },
        };
    });
    // console.log('Metrics.tsx dataSourcesWithMetricsFilledWithZeroes', dataSourcesWithMetricsFilledWithZeroes);

    // Set dataSources when the URL search parameters change
    React.useEffect(
        function () {
            // Get the dataSources value from the URL search parameters
            const dataSourcesFromUrlSearchParameters = urlSearchParameters?.get('dataSources') as string | null;

            // If the dataSources parameter exists
            if(dataSourcesFromUrlSearchParameters) {
                // Check if the format of dataSourcesFromUrlSearchParameters is { databaseName: string, tableName: string }[] type.
                // If it is, then add the data sources to the chart.
                // If it is not, then do nothing.
                let decodedDataSourcesFromUrlSearchParameters = decodeURIComponent(dataSourcesFromUrlSearchParameters);

                // TODO: Not sure why we need to add the [] around the dataSourcesFromUrlSearchParameters
                if(!decodedDataSourcesFromUrlSearchParameters.startsWith('[')) {
                    decodedDataSourcesFromUrlSearchParameters = '[' + decodedDataSourcesFromUrlSearchParameters + ']';
                }

                const keysOfDataSourcesFromUrlSearchParameters = Object.keys(
                    JSON.parse(decodedDataSourcesFromUrlSearchParameters)[0],
                );
                if(
                    keysOfDataSourcesFromUrlSearchParameters.includes('databaseName') &&
                    keysOfDataSourcesFromUrlSearchParameters.includes('tableName')
                ) {
                    // Remove those keys from the array
                    keysOfDataSourcesFromUrlSearchParameters.splice(
                        keysOfDataSourcesFromUrlSearchParameters.indexOf('databaseName'),
                        1,
                    );
                    keysOfDataSourcesFromUrlSearchParameters.splice(
                        keysOfDataSourcesFromUrlSearchParameters.indexOf('tableName'),
                        1,
                    );

                    // If there are still keys, then do nothing
                    if(keysOfDataSourcesFromUrlSearchParameters.length > 0) {
                        // console.log("Doing nothing.");
                        return;
                    }
                }

                // If there are no more keys, then add the data sources to the chart
                // Add the data sources to the chart
                const addDataSource = async () => {
                    // Parse the dataSources parameters
                    // const decodedDataSourcesFromUrlSearchParameters = decodeURIComponent(dataSourcesFromUrlSearchParameters);
                    let decodedDataSourcesFromUrlSearchParameters = decodeURIComponent(
                        dataSourcesFromUrlSearchParameters,
                    );

                    // TODO: Not sure why we need to add the [] around the dataSourcesFromUrlSearchParameters
                    if(!decodedDataSourcesFromUrlSearchParameters.startsWith('[')) {
                        decodedDataSourcesFromUrlSearchParameters =
                            '[' + decodedDataSourcesFromUrlSearchParameters + ']';
                    }
                    // console.log("decodedDataSourcesFromUrlSearchParameters", decodedDataSourcesFromUrlSearchParameters);

                    const dataSourceArray = JSON.parse(decodedDataSourcesFromUrlSearchParameters) as {
                        databaseName: string;
                        tableName: string;
                    }[];
                    console.log('dataSourceArray', dataSourceArray);

                    // Set the data sources
                    await setDataSources(() => {
                        // Create a new array to store the new data source settings
                        const newDataSourceSettings: DataSourceType[] = [];

                        // For each data source settings, create a new data source settings object
                        dataSourceArray.map((metric, index) => {
                            // Unique ID for each chart query config
                            const uniqueId = Math.random().toString(36).substring(7);

                            const newChartQuerySettings: DataSourceType = {
                                id: uniqueId,
                                databaseName: metric.databaseName,
                                tableName: metric.tableName,
                                columnName: 'createdAt',
                                color: hexStringToRgbaString(getComplementaryHexColor(index, '#00AAFF'), 1),
                                yAxisAlignment: 'left',
                                lineStyle: 'solid',
                            };

                            // Add the new data source settings to the array
                            newDataSourceSettings.push(newChartQuerySettings);
                        });

                        return newDataSourceSettings;
                    });
                };

                // Add the data sources
                addDataSource();
            }
            // If the dataSources value does not exist, do nothing
            else {
                return;
            }
        },
        [urlSearchParameters, setDataSources],
    );

    /**
     * handleZoomPress - Adjusts the current chart view to a narrower or wider date range.
     *
     * The zoom strategy is based on the natural boundaries of time intervals (hour, day, month, year).
     * Zooming in narrows the view to a more detailed interval, while zooming out expands the view to
     * the full extent of the current interval's natural boundary. The function dynamically adjusts the
     * viewable range based on the zoom direction and the current interval.
     *
     * @param {boolean} zoomIn - Determines whether the zoom action is zooming in (true) or zooming out (false).
     */
    const handleZoomPress = async (zoomIn: boolean) => {
        // console.log("==========================");
        // console.log(zoomIn ? "Zooming In" : "Zooming Out");

        const nowDate = new Date();

        // Get the current date range and interval
        const fromDate = new Date(timeRange.startTime ? timeRange.startTime : nowDate.getTime());
        const toDate = new Date(timeRange.endTime ? timeRange.endTime : nowDate.getTime());

        // Determine the new interval and date range based on the zoom direction
        const { newTimeInterval, newStartTime, newEndTime } = determineNewTimeRangeAndInterval(
            timeInterval,
            fromDate,
            toDate,
            zoomIn,
        );
        // console.log("newTimeInterval", newTimeInterval);
        // console.log("newStartDate", newStartDate);
        // console.log("newEndDate", newEndDate);

        // Update the state with the new date range and interval
        setTimeInterval(newTimeInterval as TimeInterval);
        setTimeRange({ startTime: newStartTime, endTime: newEndTime });
    };

    /**
     * Determines the new interval and date range based on the current interval, date range, and zoom direction.
     *
     * @param {string} currentInterval - The current interval ('hour', 'day', 'month', 'year').
     * @param {Date} startTime - The start date of the current range.
     * @param {Date} endTime - The end date of the current range.
     * @param {boolean} zoomIn - Flag indicating whether the zoom is inwards (true) or outwards (false).
     * @returns {Object} An object containing the new interval and the new start and end dates.
     */
    function determineNewTimeRangeAndInterval(
        currentInterval: string,
        startTime: Date,
        endTime: Date,
        zoomIn: boolean,
    ) {
        let newTimeInterval = currentInterval;
        let newStartTime, newEndTime;

        if(zoomIn) {
            switch(currentInterval) {
                case TimeInterval.Year:
                    // If 3+ years are currently being shown
                    if(differenceInMonths(endTime, startTime) > 24) {
                        // Contract a year to the left and right
                        newStartTime = startOfYear(addYears(startTime, 1));
                        newEndTime = endOfYear(subYears(endTime, 1));

                        // If we are left with 1 or 2 years
                        if(differenceInYears(newEndTime, newStartTime) <= 2) {
                            // Zoom in to the month boundary
                            newTimeInterval = TimeInterval.Month;
                        }
                    }
                    // If less than 2 years are currently being shown
                    else {
                        // Zoom in to the month boundary
                        newTimeInterval = TimeInterval.Month;
                        newStartTime = startOfYear(startTime);
                        newEndTime = endOfYear(endTime);
                    }

                    break;
                case TimeInterval.Quarter:
                    // If 2+ quarters are currently being shown
                    if(differenceInMonths(endTime, startTime) >= 6) {
                        // Contract a quarter to the left and right
                        newStartTime = startOfMonth(addMonths(startTime, 3));
                        newEndTime = endOfMonth(subMonths(endTime, 3));

                        // If we are left with 1 or 2 quarters
                        if(differenceInMonths(newEndTime, newStartTime) <= 2) {
                            // Zoom in to the month boundary
                            newTimeInterval = TimeInterval.Month;
                        }
                    }
                    // If less than 2 quarters are currently being shown
                    else {
                        // Zoom in to the month boundary
                        newTimeInterval = TimeInterval.Month;
                        newStartTime = startOfMonth(startTime);
                        newEndTime = endOfMonth(endTime);
                    }

                    break;
                case TimeInterval.Month:
                    // If 2+ months are currently being shown
                    if(differenceInMonths(endTime, startTime) >= 2) {
                        // Contract a month to the left and right
                        newStartTime = startOfMonth(addMonths(startTime, 1));
                        newEndTime = endOfMonth(subMonths(endTime, 1));

                        // If we are left with 1 or 2 months
                        if(differenceInMonths(newEndTime, newStartTime) <= 2) {
                            // Zoom in to the day boundary
                            newTimeInterval = TimeInterval.Day;
                        }
                    }
                    // If less than 2 months are currently being shown
                    else {
                        // Zoom in to the day boundary
                        newTimeInterval = TimeInterval.Day;
                        newStartTime = startOfMonth(startTime);
                        newEndTime = endOfMonth(endTime);
                    }

                    break;
                case TimeInterval.Day:
                    // If 2+ days are currently being shown
                    if(differenceInDays(endTime, startTime) >= 2) {
                        // Contract a day to the left and right
                        newStartTime = startOfDay(addDays(startTime, 1));
                        newEndTime = endOfDay(subDays(endTime, 1));

                        // If we are left with 1 or 2 days
                        if(differenceInDays(newEndTime, newStartTime) <= 2) {
                            // Zoom in to the hour boundary
                            newTimeInterval = TimeInterval.Hour;
                        }
                    }
                    // If less than 2 days are currently being shown
                    else {
                        // Zoom in to the hour boundary
                        newTimeInterval = TimeInterval.Hour;
                        newStartTime = startOfDay(startTime);
                        newEndTime = endOfDay(endTime);
                    }

                    break;
                case TimeInterval.Hour:
                    // If 2+ hours are currently being shown
                    if(differenceInHours(endTime, startTime) >= 2) {
                        // Contract an hour to the left and right
                        newStartTime = startOfHour(addHours(startTime, 1));
                        newEndTime = endOfHour(subHours(endTime, 1));
                    }
                    // If less than 2 hours are currently being shown
                    else {
                        // Zoom in to the hour boundary
                        newStartTime = startOfHour(startTime);
                        newEndTime = endOfHour(endTime);
                    }

                    break;
                default:
                    throw new Error('Invalid interval for determining new date range.');
            }
        }
        else {
            // Zooming out logic
            switch(currentInterval) {
                case TimeInterval.Hour:
                    // If less than 24 hours are currently being shown
                    if(differenceInHours(endTime, startTime) <= 24) {
                        // If exactly one day is already being shown
                        if(
                            startOfDay(startTime).getTime() === startTime.getTime() &&
                            endOfDay(endTime).getTime() === endTime.getTime()
                        ) {
                            // Zoom out to the day boundary and show the surrounding two days
                            newTimeInterval = TimeInterval.Day;
                            newStartTime = subDays(startTime, 1);
                            newEndTime = addDays(endTime, 1);
                        }
                        // Zoom out to the day boundary
                        else {
                            newStartTime = startOfDay(startTime);
                            newEndTime = endOfDay(endTime);
                        }
                    }
                    // If more than two days are being shown
                    else {
                        // Switch to day interval
                        newTimeInterval = TimeInterval.Day;
                    }

                    break;
                case TimeInterval.Day:
                    // If less than two months are currently being shown
                    if(differenceInMonths(endTime, startTime) <= 2) {
                        // If exactly one month is already being shown
                        if(
                            startOfMonth(startTime).getTime() === startTime.getTime() &&
                            endOfMonth(endTime).getTime() === endTime.getTime()
                        ) {
                            // Zoom out to the month boundary and show the surrounding two months
                            newTimeInterval = TimeInterval.Month;
                            newStartTime = subMonths(startTime, 1);
                            newEndTime = addMonths(endTime, 1);
                        }
                        // Zoom out to the month boundary
                        else {
                            newStartTime = startOfMonth(startTime);
                            newEndTime = endOfMonth(endTime);
                        }
                    }
                    // If more than two months are being shown
                    else {
                        // Switch to month interval
                        newTimeInterval = TimeInterval.Month;
                    }

                    break;
                case TimeInterval.Month:
                    // If less than two years are currently being shown
                    if(differenceInMonths(endTime, startTime) < 24) {
                        // If exactly one year is already being shown
                        if(
                            startOfYear(startTime).getTime() === startTime.getTime() &&
                            endOfYear(endTime).getTime() === endTime.getTime()
                        ) {
                            // Zoom out to the year boundary and show the surrounding two years
                            newTimeInterval = TimeInterval.Year;
                            newStartTime = subYears(startTime, 1);
                            newEndTime = addYears(endTime, 1);
                        }
                        // Zoom out to the year boundary
                        else {
                            newStartTime = startOfYear(startTime);
                            newEndTime = endOfYear(endTime);
                        }
                    }
                    // If more than 24 months are being shown
                    else {
                        // Switch to year interval
                        newTimeInterval = TimeInterval.Year;
                    }

                    break;
                case TimeInterval.Quarter:
                    // If less than four years are currently being shown
                    if(differenceInMonths(endTime, startTime) < 48) {
                        // If exactly one year is already being shown
                        if(
                            startOfYear(startTime).getTime() === startTime.getTime() &&
                            endOfYear(endTime).getTime() === endTime.getTime()
                        ) {
                            // Zoom out to the year boundary and show the surrounding two years
                            newTimeInterval = TimeInterval.Year;
                            newStartTime = subYears(startTime, 1);
                            newEndTime = addYears(endTime, 1);
                        }
                        // Zoom out to the year boundary
                        else {
                            newStartTime = startOfYear(startTime);
                            newEndTime = endOfYear(endTime);
                        }
                    }
                    // If more than 48 months are being shown
                    else {
                        // Switch to year interval
                        newTimeInterval = TimeInterval.Year;
                        newStartTime = startTime;
                        newEndTime = endTime;
                    }

                    break;
                case TimeInterval.Year:
                    // Expand a year to the left and right
                    newStartTime = subYears(startTime, 1);
                    newEndTime = addYears(endTime, 1);

                    break;
                default:
                    throw new Error('Invalid interval for determining new date range.');
            }
        }

        return {
            newTimeInterval,
            newStartTime,
            newEndTime,
        };
    }

    // Handle the selection of a reference area
    const handleReferenceAreaSelection = (leftIntervalValue: string, rightIntervalValue: string) => {
        // console.log("leftIntervalValue", leftIntervalValue);
        // console.log("rightIntervalValue", rightIntervalValue);

        const leftIntervalTime = convertIntervalValueToDate(leftIntervalValue, timeInterval as TimeInterval);
        const rightIntervalTime = convertIntervalValueToDate(rightIntervalValue, timeInterval as TimeInterval);
        let startIntervalTime: Date, endIntervalTime: Date;

        // Determine the start and end interval dates
        if(leftIntervalTime.getTime() > rightIntervalTime.getTime()) {
            startIntervalTime = rightIntervalTime;
            endIntervalTime = leftIntervalTime;
        }
        else {
            startIntervalTime = leftIntervalTime;
            endIntervalTime = rightIntervalTime;
        }

        // Update the end interval date to be the end of the year, month, day, or hour
        if(timeInterval === TimeInterval.Year) {
            endIntervalTime = endOfYear(endIntervalTime);
        }
        else if(timeInterval === TimeInterval.Month) {
            endIntervalTime = endOfMonth(endIntervalTime);
        }
        else if(timeInterval === TimeInterval.Day) {
            endIntervalTime = endOfDay(endIntervalTime);
        }
        else if(timeInterval === TimeInterval.Hour) {
            endIntervalTime = endOfHour(endIntervalTime);
        }

        // Check if the intervals are adjacent
        let intervalsAreAdjacent = false;
        if(timeInterval === TimeInterval.Year) {
            intervalsAreAdjacent = addYears(startIntervalTime, 1).getFullYear() === endIntervalTime.getFullYear();
        }
        else if(timeInterval === TimeInterval.Month) {
            intervalsAreAdjacent = addMonths(startIntervalTime, 1).getMonth() === endIntervalTime.getMonth();
        }
        else if(timeInterval === TimeInterval.Day) {
            intervalsAreAdjacent = addDays(startIntervalTime, 1).toDateString() === endIntervalTime.toDateString();
        }
        else if(timeInterval === TimeInterval.Hour) {
            intervalsAreAdjacent = addHours(startIntervalTime, 1).toISOString() === endIntervalTime.toISOString();
        }

        // If the user has selected one or two interval values, then zoom in to the next interval
        let newTimeInterval = timeInterval;
        if(leftIntervalValue === rightIntervalValue || intervalsAreAdjacent) {
            // Zoom in on the interval
            if(timeInterval === TimeInterval.Year) {
                newTimeInterval = TimeInterval.Month;
                startIntervalTime = startOfYear(startIntervalTime);
                endIntervalTime = endOfYear(endIntervalTime);
            }
            else if(timeInterval === TimeInterval.Month) {
                newTimeInterval = TimeInterval.Day;
                startIntervalTime = startOfMonth(startIntervalTime);
                endIntervalTime = endOfMonth(endIntervalTime);
            }
            else if(timeInterval === TimeInterval.Day) {
                newTimeInterval = TimeInterval.Hour;
                startIntervalTime = startOfDay(startIntervalTime);
                endIntervalTime = endOfDay(endIntervalTime);
            }
        }

        // console.log("newTimeInterval", newTimeInterval);
        // console.log("startIntervalDate", startIntervalDate);
        // console.log("endIntervalDate", endIntervalDate);

        // Update the interval
        setTimeInterval(newTimeInterval as TimeInterval);

        // Don't allow clicking on hours to zoom
        if(timeInterval == TimeInterval.Hour && leftIntervalValue === rightIntervalValue) {
            // console.log("Zoom limit");
        }
        else {
            // Update the date range
            setTimeRange({
                startTime: startIntervalTime,
                endTime: endIntervalTime,
            });
        }
    };

    // Sort the time intervals
    const preferredTimeIntervalOrder = [
        'Hour',
        'Day',
        'Month',
        'Quarter',
        'Year',
        'HourOfDay',
        'DayOfWeek',
        'DayOfMonth',
        'MonthOfYear',
    ];
    const sortedTimeIntervals = Object.keys(TimeInterval).sort(function (a, b) {
        return preferredTimeIntervalOrder.indexOf(a) - preferredTimeIntervalOrder.indexOf(b);
    });

    // Create the context menu items
    const contextMenuItems: MenuItemProperties[] = [];
    // Create a list of items for the context menu that will allow the user to click and view the records for each data source
    if(chartActiveLabel) {
        const timeIntervalValueStartAndEndDate = calculateTimeIntervalValueStartAndEndDate(
            chartActiveLabel,
            timeInterval,
        );
        // console.log('timeIntervalValueStartAndEndDate', timeIntervalValueStartAndEndDate);

        if(chartActiveLabel) {
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
                                        value: timeIntervalValueStartAndEndDate.startDate,
                                    },
                                    {
                                        column: 'createdAt',
                                        operator: ColumnFilterConditionOperator.LessThanOrEqual,
                                        value: timeIntervalValueStartAndEndDate.endDate,
                                    },
                                ],
                            }),
                        ),
                    target: '_blank',
                };
            });

            if(dataSourceMenuItems.length) {
                contextMenuItems.push(...dataSourceMenuItems);
            }
        }
    }

    // Render the component
    return (
        <>
            {/* Display Options */}
            <div className="mb-12 w-full overflow-x-auto">
                <div className="mb-4 ml-auto flex w-min space-x-2">
                    {/* Interval */}
                    <FormInputSelect
                        key={timeInterval}
                        className="w-40"
                        label="Interval"
                        id="interval"
                        items={sortedTimeIntervals.map(function (intervalTypeKey) {
                            return {
                                value: intervalTypeKey,
                                content: titleCase(intervalTypeKey),
                            };
                        })}
                        defaultValue={timeInterval}
                        onChange={(value) => setTimeInterval(value as TimeInterval)}
                    />

                    {/* Chart Type */}
                    <FormInputSelect
                        className="w-28"
                        label="Chart Type"
                        id="chartType"
                        items={possibleChartTypes.map((chartType) => {
                            return {
                                value: chartType,
                                content: titleCase(chartType),
                            };
                        })}
                        defaultValue={chartType}
                        onChange={(value) => setChartType(value as ChartType)}
                    />

                    {/* Sort Order */}
                    <FormInputSelect
                        className="w-40"
                        label="Sort Order"
                        id="sortOrder"
                        items={possibleSortOrders.map((sortOrder) => {
                            return {
                                value: sortOrder,
                                content: sortOrder === 'ASC' ? 'Ascending' : 'Descending',
                            };
                        })}
                        defaultValue={sortOrder}
                        onChange={(value) => setSortOrder(value as SortOrderType)}
                    />

                    {/* Time Range */}
                    <FormInputTimeRange
                        buttonProperties={{
                            className: 'w-[280px]',
                        }}
                        label="Time Range"
                        id="timeRange"
                        defaultValue={{
                            startTime: new Date(timeRange?.startTime ?? ''),
                            endTime: timeRange.endTime
                                ? new Date(timeRange?.endTime)
                                : new Date(timeRange?.startTime ?? ''),
                        }}
                        showTimeRangePresets={true}
                        onChange={(timeRange) => setTimeRange(timeRange ?? null)}
                    />

                    {/* Zoom Out Button */}
                    <div className="mt-[22px]">
                        <Button
                            // disabled={loading}
                            size={'formInputIcon'}
                            className="group relative aspect-square px-2"
                            onClick={() => handleZoomPress(false)}
                            tip="Zoom Out"
                        >
                            <MinusIcon className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Zoom In Button */}
                    <div className="mt-[22px]">
                        <Button
                            // disabled={loading}
                            size={'formInputIcon'}
                            className="group relative aspect-square px-2"
                            onClick={() => handleZoomPress(true)}
                            tip="Zoom In"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Export Icon */}
                    <div className="mt-[22px]">
                        <Dialog header="Export" content="Feature coming soon!" footerCloseButton={true}>
                            <Button
                                // disabled={loading}
                                size={'formInputIcon'}
                                className="group relative aspect-square px-2"
                                // onClick={() => handleZoomPress(true)}
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
                                // disabled={loading}
                                size={'formInputIcon'}
                                className="group relative aspect-square px-2"
                                // onClick={() => handleZoomPress(true)}
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
                                await apolloClient.refetchQueries({
                                    include: 'active',
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ContextMenu items={contextMenuItems} closeOnItemSelected={true}>
                <Chart
                    dataSourcesWithMetrics={dataSourcesWithMetricsFilledWithZeroes}
                    timeInterval={timeInterval}
                    chartType={chartType}
                    sortOrder={sortOrder}
                    handleReferenceAreaSelection={handleReferenceAreaSelection}
                    errorMessage={chartError?.message}
                    onMouseDown={function (chartEvent, mouseEvent) {
                        console.log('chartEvent', chartEvent);
                        console.log('mouseEvent', mouseEvent);
                        setChartActiveLabel((chartEvent as unknown as { activeLabel: string }).activeLabel);
                    }}
                />
            </ContextMenu>

            {/* A line to separate the options from the graph */}
            <div className="mb-4 mt-1 border-t border-light-4 md:mb-6 md:mt-6 dark:border-dark-4"></div>

            {/* DataSources */}
            <DataSources
                key={dataSources[0]?.id}
                settings={{
                    timeInterval: timeInterval,
                    dataSources: dataSources,
                    endTime: timeRange.endTime ? new Date(timeRange.endTime) : new Date(),
                    startTime: timeRange.startTime ? new Date(timeRange.startTime) : addDays(new Date(), -30),
                    chartType: chartType,
                }}
                setDataSources={setDataSources}
                setDataSourcesWithMetrics={setDataSourcesWithMetrics}
                error={chartError?.type === 'error'}
                setLoading={setChartLoading}
            />
        </>
    );
}
