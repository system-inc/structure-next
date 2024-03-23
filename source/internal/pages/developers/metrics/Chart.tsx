'use client'; // This component uses client-only features

// Dependencies - Core React Libraries
import React from 'react';

// Dependencies - Configuration
import tailwindConfiguration from '@project/tailwind.config';

// Dependencies - Main Components
import { DataSourceWithMetricsType } from './Metrics';

// Dependencies - Supporting Components
import {
    ComposedChart,
    CartesianGrid,
    Bar,
    Line,
    Area,
    XAxis,
    YAxis,
    ReferenceArea,
    Tooltip as RechartsTooltip,
} from 'recharts';

// Dependencies - Styles
import { useTheme } from '@structure/source/styles/ThemeProvider';

// Dependencies - Utilities
import useMeasure from 'react-use-measure';
import { TimeInterval } from '@project/source/graphql/generated/graphql';
import { addCommas } from '@structure/source/utilities/Number';
import { lightenColor, darkenColor, setTransparency } from '@structure/source/utilities/Color';

// Helper Function - Tick Formatter
const tickFormatter = (
    type: string,
    timeInterval: string,
    value: string,
    index: number,
    previousTickValue: string,
    totalTicks: number,
) => {
    // console.log("type", type, "timeInterval", timeInterval, "value", value, "index", index, "previousTickValue", previousTickValue, "totalTicks", totalTicks);

    let tickValue = '';

    // Handle years
    if(timeInterval === TimeInterval.Year) {
        // Primary, just show the year
        if(type === 'primary') {
            // If there are less than 25 years, show the full year, e.g., "2021"
            if(totalTicks <= 25) {
                tickValue = value;
            }
            // If there are less than 50 years
            else if(totalTicks <= 50) {
                // Only show the year if it is a multiple of 5
                if(index === 0 || index == totalTicks - 1 || parseInt(value) % 5 === 0) {
                    tickValue = value;
                }
            }
            // If there are more than 50 years
            else {
                // Only show the year if it is a multiple of 10
                if(index === 0 || index == totalTicks - 1 || parseInt(value) % 10 === 0) {
                    tickValue = value.toString().slice(-2);
                }
            }
        }
    }
    // Handle quarters
    else if(timeInterval === TimeInterval.Quarter) {
        // Tick value is in the format "2021-Q1", the quarter is the last two character

        const quarter = value.slice(-2);
        const currentYear = value.slice(0, 4);
        const previousTickValueYear = previousTickValue.slice(0, 4);

        // Primary, just show the quarter, e.g., "Q2"
        if(type === 'primary') {
            // Always show the hour on the first tick
            if(index === 0) {
                tickValue = quarter;
            }
            // Always show the hour on the last tick
            else if(index === totalTicks - 1) {
                tickValue = quarter;
            }
            // If there are less than 30 quarters, show the quarter, e.g., "Q1"
            else if(totalTicks <= 30) {
                tickValue = quarter;
            }
            // If there are more quarters, only show the 1st quarter
            else {
                if(quarter === 'Q1') {
                    tickValue = quarter;
                }
                else {
                    tickValue = '';
                }
            }
        }
        // Secondary, just show the year
        else {
            // If the previous year is different from the current year, show the year
            // Always show the hour on the first tick
            if(index === 0) {
                tickValue = currentYear;
            }
            // Show the year if the previous year is different from the current year
            else if(currentYear !== previousTickValueYear) {
                tickValue = currentYear;
            }
            else {
                tickValue = '';
            }
        }
    }
    // Handle months
    else if(timeInterval === TimeInterval.Month) {
        const currentYear = value.slice(0, 4);
        const previousTickValueYear = previousTickValue.slice(0, 4);

        // Tick value is in the format "2021-01", the month is the last two character

        // Primary, just show the month, e.g., "Jan"
        if(type === 'primary') {
            tickValue = value.slice(-2);
            tickValue = new Date(2021, parseInt(tickValue) - 1, 1).toLocaleString('default', { month: 'short' });
        }
        // Secondary, just show the year
        else {
            // If the previous year is different from the current year, show the year
            if(currentYear !== previousTickValueYear) {
                tickValue = currentYear;
            }
            else {
                tickValue = '';
            }
        }
    }
    // Handle days
    else if(timeInterval === TimeInterval.Day) {
        // Tick value is in the format "2021-01-01"
        const year = value.slice(0, 4);
        const day = parseInt(value.slice(-2), 10).toString();

        // Primary
        if(type === 'primary') {
            // Always show the hour on the first tick
            if(index === 0) {
                tickValue = day;
            }
            // Always show the hour on the last tick
            else if(index === totalTicks - 1) {
                tickValue = day;
            }
            else if(totalTicks <= 7) {
                tickValue = day;
            }
            // If there are less than 31 days, show the day, e.g., "1"
            else if(totalTicks <= 14) {
                tickValue = day;
            }
            // If there are less than 62 days, only show the 1st, 8th, 15th, and 22nd days
            else if(totalTicks <= 62) {
                if(
                    index === 0 ||
                    index === totalTicks - 1 ||
                    day === '1' ||
                    day === '8' ||
                    day === '15' ||
                    day === '22'
                ) {
                    tickValue = day;
                }
            }
            // If there are less than 124 days, only show the 1st and 15th days
            else if(totalTicks <= 124) {
                if(index === 0 || index === totalTicks - 1 || day === '1' || day === '15') {
                    tickValue = day;
                }
            }
            // If there are more than 124 days, only show the 1st days
            else {
                if(day === '1') {
                    tickValue = day;
                }
                else {
                    tickValue = '';
                }
            }
        }
        // Secondary
        else {
            const shortMonth = new Date(2021, parseInt(value.slice(5, 7)) - 1, 1).toLocaleString('default', {
                month: 'short',
            });

            // First tick, show the full date
            if(index === 0) {
                tickValue = shortMonth + ' ' + year;
            }
            else if(day == '1' || totalTicks >= 14) {
                // Show the month, e.g., "Jan", only if the day is the first day of the month
                if(day == '1') {
                    tickValue = shortMonth + ' ' + year;
                }
                else {
                    tickValue = '';
                }
            }
            else {
                tickValue = '';
            }
        }
    }
    // Handle hours
    else if(timeInterval === TimeInterval.Hour) {
        // Tick value is in the format "2021-01-01 00:00:00", it is in UTC time

        // Create a new date object
        const date = new Date(value + 'Z'); // The "Z" is to indicate UTC time

        // Get the hour in the local time zone, we multiply by 60000 to convert minutes to milliseconds
        const timeZoneOffset = date.getTimezoneOffset() * 60000;

        // Adjust the date to the local time zone
        const localDate = new Date(date.getTime() - timeZoneOffset);
        const localDateIsoString = localDate.toISOString();
        // console.log("localDate", localDateIsoString);

        const hourInLocalTimeZoneMatch = localDateIsoString.match(/T(\d{2}):/);
        let hourInLocalTimeZone =
            hourInLocalTimeZoneMatch && hourInLocalTimeZoneMatch[1] !== undefined
                ? parseInt(hourInLocalTimeZoneMatch[1], 10).toString()
                : '';
        // console.log("hourInLocalTimeZone", hourInLocalTimeZone);
        const dayInLocalTimeZoneMatch = localDateIsoString.match(/-(\d{2})T/);
        let dayInLocalTimeZone =
            dayInLocalTimeZoneMatch && dayInLocalTimeZoneMatch[1] !== undefined
                ? parseInt(dayInLocalTimeZoneMatch[1], 10).toString()
                : '';

        const formattedHour = hourInLocalTimeZone + ':00';
        // console.log('value', value, 'hour', hour, 'day', day);

        // Primary
        if(type === 'primary') {
            // Always show the hour on the first tick
            if(index === 0) {
                tickValue = formattedHour;
            }
            // Always show the hour on the last tick
            else if(index === totalTicks - 1) {
                tickValue = formattedHour;
            }
            // If there are less than 7 hours, show the hour, e.g., "0"
            else if(totalTicks <= 7) {
                tickValue = formattedHour;
            }
            // If there are less than 12 hours, show just the hour, e.g., "0" on
            else if(totalTicks <= 12) {
                tickValue = formattedHour;
            }
            // If there are less than 48 hours, only show the 0:00, 6:00, 12:00, and 18:00 hours
            else if(totalTicks <= 48) {
                if(
                    hourInLocalTimeZone === '0' ||
                    hourInLocalTimeZone === '6' ||
                    hourInLocalTimeZone === '12' ||
                    hourInLocalTimeZone === '18'
                ) {
                    tickValue = formattedHour;
                }
            }
            // If there are more than 48 hours, only show the 00:00 hours
            else {
                // console.log('More than 48 hours, hour', hour, 'day', day, 'value', value);

                if(hourInLocalTimeZone === '0') {
                    // tickValue = formattedHour;  // We can't do this because we when we spill over the width it causes it to not display
                    tickValue = hourInLocalTimeZone;
                }
                else {
                    tickValue = '';
                }
            }
        }
        // Secondary
        else {
            // Our secondary tick value will be "Jan 1"
            const monthAndDay = localDate.toLocaleString('default', {
                month: 'short',
                day: 'numeric',
            });

            // Always show the month and day on the first and last tick
            if(index === 0) {
                tickValue = monthAndDay;
            }
            // If there are more than 7 hours, show the month and day on last hour
            else if(index === totalTicks - 1) {
                tickValue = monthAndDay;
            }
            // If there are less than 48 hours, show the month and day on the 00:00 hour
            else if(totalTicks <= 48) {
                // Only show if the hour is 00
                if(hourInLocalTimeZone === '0') {
                    tickValue = monthAndDay;
                }
                else {
                    tickValue = '';
                }
            }
            // If there are more than 48 hours, show day on the 00:00 hour
            else {
                // console.log('monthAndDay', monthAndDay);

                // Only show if the hour is 00
                if(hourInLocalTimeZone === '0') {
                    // tickValue = monthAndDay; // We can't do this because we when we spill over the width it causes it to not display
                    tickValue = dayInLocalTimeZone;
                }
                else {
                    tickValue = '';
                }
            }
        }
    }
    // Month of year
    else if(timeInterval === TimeInterval.MonthOfYear) {
        // Tick value is in the format "01"

        // Primary
        if(type === 'primary') {
            // Just show the month, e.g., "Jan"
            tickValue = new Date(2021, parseInt(value) - 1, 1).toLocaleString('default', { month: 'short' });
        }
        else {
            tickValue = '';
        }
    }
    // Day of month
    else if(timeInterval === TimeInterval.DayOfMonth) {
        // Tick value is in the format 01-31

        // Primary
        if(type === 'primary') {
            // Just show the day of the month, e.g., "1"
            tickValue = parseInt(value).toString();
        }
        else {
            tickValue = '';
        }
    }
    // Day of week
    else if(timeInterval === TimeInterval.DayOfWeek) {
        // Tick value is in the format 0-6

        // Primary
        if(type === 'primary') {
            // Just show the day of the week, e.g., "Mon"
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            tickValue = dayNames[parseInt(value)] ?? value;
        }
        else {
            tickValue = '';
        }
    }
    // Hour of day
    else if(timeInterval === TimeInterval.HourOfDay) {
        // Tick value is in the format 00-23

        // Primary
        if(type === 'primary') {
            // Show the time of day, e.g., "12 AM"
            const hour = parseInt(value);
            const hourOfDay = hour % 12;
            const amPm = hour < 12 ? 'AM' : 'PM';
            tickValue = `${hourOfDay === 0 ? 12 : hourOfDay} ${amPm}`;
        }
        else {
            tickValue = '';
        }
    }
    // Handle all other intervals
    else {
        tickValue = value;
    }

    return tickValue;
};

// Component - TooltipHeaderColumn
const tooltipHeaderColumn = (timeInterval: string, label: string) => {
    let secondaryLabel = null;

    if(!label) return null;

    // Month
    if(timeInterval === TimeInterval.Month) {
        // Label is coming in as "yyyy-mm" format

        // Create new date object configured to the label for 'yyyy-mm' format
        // Not sure why we need to replace the dashes with slashes, but the month is off by one if we don't
        const date = new Date(label.split('-').join('/'));

        // Secondary label is full date, e.g., "January 2020"
        secondaryLabel = date.toLocaleDateString('default', { year: 'numeric', month: 'long' });
    }
    // Day
    else if(timeInterval === TimeInterval.Day) {
        // Label is coming in as "2020-01-01"

        // Subtract one day from the label to fix the secondary label
        const date = new Date(label);
        date.setDate(date.getDate() + 1);

        // Secondary label is full date, e.g., "Saturday, January 1, 2020"
        secondaryLabel = date.toLocaleDateString('default', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    // Hour
    else if(timeInterval === TimeInterval.Hour) {
        const date = new Date(label + 'Z'); // The "Z" is to indicate UTC time

        // Label is coming in as "2020-01-01 00:00:00"
        label = label + ' UTC';

        // Get the hour in the local time zone, we multiply by 60000 to convert minutes to milliseconds
        const timeZoneOffset = date.getTimezoneOffset() * 60000;

        // Adjust the date to the local time zone
        const localDate = new Date(date.getTime() - timeZoneOffset);

        // Extract the time zone abbreviation
        const timeZoneAbbreviation = localDate.toLocaleTimeString('default', { timeZoneName: 'short' }).split(' ')[2];

        // Format localDate to a string with the desired format
        const localDateTimeString = localDate.toISOString().replace('T', ' ').substring(0, 19);

        // Extract the hour using regex
        let localHour = localDateTimeString.match(/(\d{2}):/)?.[1] ?? '';

        // Convert the local hour to AM / PM
        const hour = parseInt(localHour);
        let hourOfDay = hour % 12;
        if(hour === 0 || hour === 12) {
            hourOfDay = 12;
        }

        // Secondary label is in local time zone, e.g., "2020-01-01 00:00:00 MST"
        secondaryLabel = `${localDateTimeString} ${timeZoneAbbreviation} (${hourOfDay}:00 ${hour < 12 ? 'AM' : 'PM'})`;
    }
    // Month of year
    else if(timeInterval === TimeInterval.MonthOfYear) {
        // Label is coming in as "01"
        label = new Date(2021, parseInt(label) - 1, 1).toLocaleDateString('default', { month: 'long' });
    }
    // Day of month
    else if(timeInterval == TimeInterval.DayOfMonth) {
        label = parseInt(label).toString();
    }
    // Day of week
    else if(timeInterval === TimeInterval.DayOfWeek) {
        // Label is coming in as "0"
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        label = dayNames[parseInt(label)] ?? label;
    }
    // Hour of day
    else if(timeInterval === TimeInterval.HourOfDay) {
        // Label is coming in as "00"
        label += ':00';

        const hour = parseInt(label);
        let hourOfDay = hour % 12;
        if(hour === 0 || hour === 12) {
            hourOfDay = 12;
        }
        const hourString = hourOfDay + ':00';
        const amPm = hour < 12 ? 'AM' : 'PM';
        secondaryLabel = `${hourString} ${amPm}`;
    }

    return (
        <>
            <div>{label}</div>
            {secondaryLabel && <div>{secondaryLabel}</div>}
        </>
    );
};

// Component - TooltipColumn
const tooltipColumn = (timeInterval: string, payload: any) => {
    const columnTitle = payload.dataKey?.toString().split('-').slice(1).join(' ').replace('total', '');

    return (
        <td
            // style={{ color: payload.color }}
            className="pr-4"
        >
            {columnTitle}
        </td>
    );
};

// Component - Chart
// This is a lower level component that renders the chart based on the data provided
// Data is provided by the higher level component which is processed and memoized by this component to prevent unnecessary re-renders
export interface ChartInterface {
    dataSourcesWithMetrics: DataSourceWithMetricsType[];
    timeInterval: string;
    chartType: 'bar' | 'line' | 'area';
    sortOrder: string;
    handleReferenceAreaSelection: Function;
    errorMessage?: string;
    onMouseDown?: (chartEvent: any, mouseEvent: any) => void;
}
export const Chart = ({
    dataSourcesWithMetrics,
    timeInterval: timeInterval,
    chartType,
    sortOrder,
    handleReferenceAreaSelection,
    errorMessage,
    onMouseDown,
}: ChartInterface) => {
    // Use the theme hook
    const { theme } = useTheme();

    // Store a reference to the chart
    const chartReference = React.useRef<any>(null);

    // Store a reference to the chart wrapper
    const [chartWrapperDomElementReference, wrapperDimensions] = useMeasure();

    // Memoized data to be used by the chart
    const formattedDataSourceWithMetrics = React.useMemo(() => {
        return (
            dataSourcesWithMetrics
                // First, we need to flatten the data
                .flatMap((element) =>
                    element.metrics.data.map((data: any) => {
                        let formattedData = {} as {
                            [k: string]: number | string | undefined;
                            metricIndex: string | undefined;
                            intervalValue: string | undefined;
                            intervalValueCategory: string | undefined;
                        };
                        // Set the key that will be used to identify the data point is set to the data total
                        formattedData[`${element.id}-${element.tableName}-${element.columnName}-total`] = data[1];
                        formattedData.metricIndex = data[0];

                        return formattedData;
                    }),
                )
                // Combine all data points with the same metricIndex
                .reduce(
                    (accumulator, currentValue) => {
                        const index = accumulator.findIndex(
                            (data: any) => data.metricIndex === currentValue.metricIndex,
                        );
                        if(index === -1) {
                            return [...accumulator, currentValue];
                        }
                        else {
                            const newData = [...accumulator];
                            newData[index] = { ...newData[index], ...currentValue };
                            return newData;
                        }
                    },
                    [] as { [k: string]: number | string | undefined; metricIndex: string | undefined }[],
                )
                // Sort the data by the metricIndex
                .sort((a: any, b: any) => {
                    if(a.metricIndex === undefined || b.metricIndex === undefined) return 1;

                    // sort based on sortOrder
                    if(sortOrder === 'ASC') {
                        return a.metricIndex.localeCompare(b.metricIndex);
                    }
                    else {
                        return b.metricIndex.localeCompare(a.metricIndex);
                    }
                })
        );
    }, [dataSourcesWithMetrics, sortOrder]);
    // console.log("dataSourcesWithMetrics", dataSourcesWithMetrics);
    // console.log("formattedDataSourceWithMetrics", formattedDataSourceWithMetrics);

    // State to manage the reference area
    const [referenceAreaLeft, setReferenceAreaLeft] = React.useState<string | undefined>(undefined);
    const [referenceAreaRight, setReferenceAreaRight] = React.useState<string | undefined>(undefined);

    // Render the component
    return (
        <div
            ref={chartWrapperDomElementReference}
            className={'relative h-60 w-full min-w-[300px] max-w-full select-none resize overflow-auto md:h-96'}
        >
            <ComposedChart
                ref={chartReference}
                data={formattedDataSourceWithMetrics}
                width={wrapperDimensions.width}
                height={wrapperDimensions.height - 20}
                onMouseDown={function (chartEvent, mouseEvent) {
                    // If the button is the first button
                    if(mouseEvent.button == 0) {
                        // Set the reference area left
                        if(chartEvent && chartEvent.activeLabel) {
                            setReferenceAreaLeft(chartEvent.activeLabel);
                        }
                    }

                    if(onMouseDown) {
                        onMouseDown(chartEvent, mouseEvent);
                    }
                }}
                onMouseMove={function (chartEvent, mouseEvent) {
                    // console.log("onMouseMove", event);

                    // If the reference area left is set, set the reference area right
                    if(chartEvent && chartEvent.activeLabel && referenceAreaLeft) {
                        setReferenceAreaRight(chartEvent.activeLabel);
                    }
                }}
                onMouseUp={function (chartEvent, mouseEvent) {
                    // If the button is the first button
                    if(mouseEvent.button == 0) {
                        // console.log("onMouseUp", event);
                        let currentReferenceAreaLeft = referenceAreaLeft;
                        let currentReferenceAreaRight = referenceAreaRight;

                        // If there is no right reference area, set it to the left reference area
                        if(referenceAreaRight === undefined) {
                            currentReferenceAreaRight = referenceAreaLeft;
                        }

                        // If reference areas are set, invoke the handler
                        if(currentReferenceAreaLeft && currentReferenceAreaRight) {
                            handleReferenceAreaSelection(currentReferenceAreaLeft, currentReferenceAreaRight);
                        }

                        // Clear the references
                        setReferenceAreaLeft(undefined);
                        setReferenceAreaRight(undefined);
                    }
                }}
            >
                <CartesianGrid
                    // strokeDasharray="3 3"
                    stroke={theme === 'light' ? undefined : tailwindConfiguration.theme.extend.colors['dark-4']}
                    vertical={errorMessage ? true : false}
                />

                {/* If there are data sources */}
                {dataSourcesWithMetrics.length > 0 && (
                    <>
                        <RechartsTooltip
                            animationDuration={0}
                            wrapperClassName="rounded-md"
                            // contentStyle={{
                            //     borderRadius: "8px",
                            // }}
                            cursor={{
                                fill: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                                stroke:
                                    // If the theme is light
                                    theme === 'light'
                                        ? // And the chart type is bar
                                          chartType === 'bar'
                                            ? // Bar chart stroke color
                                              'rgba(0, 0, 0, 0.05)'
                                            : // Other chart types stroke color
                                              '#CCCCCC'
                                        : // If the theme is dark
                                          chartType === 'bar'
                                          ? // Bar chart stroke color
                                            'rgba(255, 255, 255, 0.05)'
                                          : // Other chart types stroke color
                                            tailwindConfiguration.theme.extend.colors['dark-4'],
                                // If the chart is a bar chart, the stroke width is the number of data points divided by the width of the chart minus the margins
                                strokeWidth:
                                    chartType === 'bar'
                                        ? (wrapperDimensions.width - 90) /
                                          (dataSourcesWithMetrics[0]?.metrics.data.length ?? 1)
                                        : 1,
                            }}
                            content={(values) => {
                                return (
                                    <div className="rounded-sm border border-light-4 bg-light dark:border-dark-4 dark:bg-dark">
                                        <div className="border-b p-2 text-xs text-dark/60 dark:text-light-4/60">
                                            {tooltipHeaderColumn(timeInterval, values.label)}
                                        </div>
                                        <table className="">
                                            <tbody className="">
                                                {values.payload?.map((payload, index) => (
                                                    <tr
                                                        key={index}
                                                        className={
                                                            values.payload && index === values.payload.length - 1
                                                                ? 'text-xs' // If this is the last row, don't show the border
                                                                : 'border-b text-xs'
                                                        }
                                                    >
                                                        <td className="p-2 text-center text-xs">
                                                            <b>{addCommas(payload.value as number)}</b>
                                                        </td>
                                                        <td className="border-l p-2">
                                                            <div
                                                                style={{
                                                                    borderColor: payload.color,
                                                                    borderStyle:
                                                                        payload.strokeDasharray == '5 5'
                                                                            ? 'dashed'
                                                                            : 'solid',
                                                                    backgroundColor:
                                                                        theme === 'light'
                                                                            ? lightenColor(payload.color || '', 0.2)
                                                                            : darkenColor(payload.color || '', 0.2),
                                                                }}
                                                                className="h-4 w-4 rounded-sm border"
                                                            />
                                                        </td>
                                                        {tooltipColumn(timeInterval, payload)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            }}
                        />
                        {/* Render the bars or lines */}
                        {dataSourcesWithMetrics.map((dataSourceWithMetrics, index) => {
                            // console.log("index", index, "rendering", dataSourceWithMetrics);

                            switch(chartType) {
                                case 'bar':
                                    return (
                                        <Bar
                                            animationDuration={0}
                                            key={dataSourceWithMetrics.id + '-bar'}
                                            dataKey={`${dataSourceWithMetrics.id}-${dataSourceWithMetrics.tableName}-${dataSourceWithMetrics.columnName}-total`}
                                            fill={dataSourceWithMetrics.color}
                                            radius={[4, 4, 0, 0]}
                                            yAxisId={dataSourceWithMetrics.yAxisAlignment}
                                        />
                                    );
                                case 'line':
                                    return (
                                        <Line
                                            animationDuration={0}
                                            key={dataSourceWithMetrics.id + '-line'}
                                            dataKey={`${dataSourceWithMetrics.id}-${dataSourceWithMetrics.tableName}-${dataSourceWithMetrics.columnName}-total`}
                                            stroke={dataSourceWithMetrics.color}
                                            strokeWidth={2}
                                            strokeDasharray={dataSourceWithMetrics.lineStyle === 'dashed' ? '5 5' : ''}
                                            type="monotone"
                                            dot={{
                                                stroke: 'transparent',
                                                fill: dataSourceWithMetrics.color,
                                                r: 2.5,
                                            }}
                                            activeDot={{
                                                r: 4,
                                            }}
                                            yAxisId={dataSourceWithMetrics.yAxisAlignment}
                                        />
                                    );
                                case 'area':
                                    return (
                                        <Area
                                            animationDuration={0}
                                            key={dataSourceWithMetrics.id + '-area'}
                                            dataKey={`${dataSourceWithMetrics.id}-${dataSourceWithMetrics.tableName}-${dataSourceWithMetrics.columnName}-total`}
                                            stroke={dataSourceWithMetrics.color}
                                            strokeWidth={2}
                                            strokeDasharray={dataSourceWithMetrics.lineStyle === 'dashed' ? '5 5' : ''}
                                            fill={setTransparency(
                                                theme == 'light'
                                                    ? lightenColor(dataSourceWithMetrics.color, 0.2)
                                                    : darkenColor(dataSourceWithMetrics.color, 0.2),
                                                0.75,
                                            )}
                                            fillOpacity={1.0}
                                            type="monotone"
                                            dot={{
                                                stroke: 'transparent',
                                                fill: dataSourceWithMetrics.color,
                                                r: 2.5,
                                            }}
                                            activeDot={{
                                                r: 4,
                                            }}
                                            yAxisId={dataSourceWithMetrics.yAxisAlignment}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </>
                )}

                {/* The first x-axis the most granular part of the interval, e.g., "Q1" */}
                <XAxis
                    xAxisId="0"
                    dataKey="metricIndex"
                    className="text-sm"
                    interval={timeInterval === TimeInterval.Day ? 0 : 'preserveStartEnd'}
                    tickFormatter={(value: any, index: number) => {
                        return tickFormatter(
                            'primary',
                            timeInterval,
                            value,
                            index,
                            formattedDataSourceWithMetrics[index - 1]?.metricIndex ?? '',
                            formattedDataSourceWithMetrics.length,
                        );
                    }}
                />

                {/* The second x-axis is the category of the time interval, e.g., "2021" */}
                {/* Only render this axis if the time interval is quarter, month, day, or hour */}
                {[TimeInterval.Quarter, TimeInterval.Month, TimeInterval.Day, TimeInterval.Hour].includes(
                    timeInterval as TimeInterval,
                ) && (
                    <XAxis
                        xAxisId="1"
                        dataKey="metricIndex"
                        className="text-sm"
                        interval={timeInterval === TimeInterval.Day ? 0 : 'preserveStartEnd'}
                        tickFormatter={(value: any, index: number) => {
                            return tickFormatter(
                                'secondary',
                                timeInterval,
                                value,
                                index,
                                formattedDataSourceWithMetrics[index - 1]?.metricIndex ?? '',
                                formattedDataSourceWithMetrics.length,
                            );
                        }}
                        allowDuplicatedCategory={false}
                        axisLine={false}
                        tickLine={false}
                    />
                )}

                {/* The y-axis shows the total values of the data points */}
                <YAxis yAxisId="left" orientation="left" className="text-sm" width={44} />
                <YAxis yAxisId="right" orientation="right" className="text-sm" width={44} />

                {/* An optional second y-axis */}
                {/* <YAxis yAxisId={"2"} orientation="right" /> */}

                {/* Reference Area */}
                {referenceAreaLeft && referenceAreaRight && (
                    <ReferenceArea
                        yAxisId="left"
                        x1={referenceAreaLeft}
                        x2={referenceAreaRight}
                        strokeOpacity={0.5}
                        fillOpacity={document.documentElement.classList.contains('dark') ? 0.1 : 0.2}
                    />
                )}
            </ComposedChart>

            {/* If there is an error message, show it */}
            {errorMessage && (
                <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                    <p className="relative bottom-10 max-w-[75%] text-center text-dark-4/50 dark:text-light-4/50">
                        {errorMessage}
                    </p>
                </div>
            )}

            {/* Let's not show these as they are not necessary */}
            {/* <div className="absolute inset-y-0 left-2 flex items-center justify-center">
                <p className="origin-center -rotate-90 text-sm font-semibold">Total</p>
            </div>
            <p className="absolute inset-x-0 bottom-0 text-center text-sm font-semibold capitalize">
                <span className="relative left-7">{measurementInterval.toLowerCase()}</span>
            </p> */}
        </div>
    );
};

// Export - Default
export default Chart;
