// Dependencies - React and Next.js
import React from 'react';
import { Options as NextUseQueryStateOptions } from 'nuqs';

// Dependencies - Main Components
import { DataSourceType, DataSourceWithMetricsType } from './Metrics';
import { InputText } from '@structure/source/common/forms/InputText';
import { FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { DatabaseAndTableFormInputSelects } from '@structure/source/internal/pages/developers/databases/DatabaseAndTableFormInputSelects';
import Button from '@structure/source/common/buttons/Button';
import Popover from '@structure/source/common/popovers/Popover';
import Tip from '@structure/source/common/popovers/Tip';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    DataInteractionDatabaseTableDocument,
    DataInteractionDatabaseTablesDocument,
    DataInteractionDatabaseTableMetricsDocument,
} from '@project/source/api/GraphQlGeneratedCode';
import { TimeInterval } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import DragIcon from '@structure/assets/icons/interface/DragIcon.svg';
import MinusCircledIcon from '@structure/assets/icons/interface/MinusCircledIcon.svg';

// Dependencies - Utilities
import { useDrag } from '@use-gesture/react';
import { RgbColor, RgbColorPicker } from 'react-colorful';
import { rgbStringToHexString, hexStringToRgb } from '@structure/source/utilities/Color';
import { addCommas } from '@structure/source/utilities/Number';

// Component - DataSource
export interface DataSourceInterface {
    settings: DataSourceType & {
        startTime?: Date;
        endTime?: Date;
        timeInterval?: TimeInterval;
        chartType?: 'bar' | 'line' | 'area';
    };
    setDataSources: (
        value: DataSourceType[] | ((old: DataSourceType[]) => DataSourceType[] | null) | null,
        options?: NextUseQueryStateOptions | undefined,
    ) => Promise<URLSearchParams>;
    deleteDataSource: (id: string) => void;
    setDataSourcesWithMetrics: React.Dispatch<React.SetStateAction<DataSourceWithMetricsType[]>>;
    isFirst?: boolean;
    dragEventListener: ReturnType<typeof useDrag>;
    error?: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export function DataSource(properties: DataSourceInterface) {
    // Query the API for the available columns for the current table table
    const dataInteractionDatabaseTableQueryState = useQuery(DataInteractionDatabaseTableDocument, {
        variables: {
            databaseName: properties.settings.databaseName,
            tableName: properties.settings.tableName,
        },
    });
    // console.log('dataInteractionDatabaseTableQueryState', dataInteractionDatabaseTableQueryState);

    // Get the available columns for the table
    let availableColumns: string[] | undefined = undefined;
    if(dataInteractionDatabaseTableQueryState.data?.dataInteractionDatabaseTable.columns) {
        availableColumns = dataInteractionDatabaseTableQueryState.data?.dataInteractionDatabaseTable.columns
            // Filter out columns that are not datetime
            .filter((column) => column.type === 'datetime')
            // Map to column names
            .map((column) => column.name);
    }
    // console.log('availableColumns', availableColumns);

    // Set the default column to measure to the searchParams column or "createdAt" if that exists in the availableColumns. Otherwise, default to the first available column
    const columnToMeasure =
        availableColumns?.find((value) => {
            const columnToFind = properties.settings.columnName ?? 'createdAt';
            return value === columnToFind;
        }) ??
        availableColumns?.at(0) ??
        '';
    // console.log('columnToMeasure', columnToMeasure);

    // Function to set the column to measure
    function setColumnToMeasureOnDataSources(newColumnName: string) {
        properties.setDataSources((oldConfigurationArray) => {
            // Find the index of the current config
            const configurationIndex = oldConfigurationArray?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldConfigurationArray?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        columnName: newColumnName,
                    };
                }
                else {
                    return configuration;
                }
            });
        });
    }

    // Get the table metrics and update the aggregate metrics data when the data is fetched
    const dataInteractionDatabaseTableMetricsQueryState = useQuery(DataInteractionDatabaseTableMetricsDocument, {
        variables: {
            input: {
                databaseName: properties.settings.databaseName as string,
                tableName: properties.settings.tableName as string,
                columnName: columnToMeasure,
                timeIntervals: [properties.settings.timeInterval ?? TimeInterval.Day],
                startTime: properties.settings.startTime?.toISOString(),
                endTime: properties.settings.endTime?.toISOString(),
            },
        },
        skip: properties.error || !columnToMeasure, // Skip if there is an error or if there is no column to measure
        onCompleted: (data) => {
            // Set the loading state to false
            properties.setLoading(false);

            // If there is no data, return
            if(!data) return;

            properties.setDataSourcesWithMetrics((oldData) => {
                if(!data.dataInteractionDatabaseTableMetrics[0])
                    return oldData.filter((old) => old.id !== properties.settings.id);

                // Find if the data already exists in the array
                // console.log(oldData, properties.queryConfig.id);
                const index = oldData.findIndex((old) => old.id === properties.settings.id);

                // If the data doesn't exist, add it to the array
                if(index === -1) {
                    return [
                        ...oldData,
                        {
                            id: properties.settings.id,
                            databaseName: properties.settings.databaseName,
                            tableName: properties.settings.tableName,
                            columnName: columnToMeasure,
                            color: properties.settings.color,
                            yAxisAlignment: properties.settings.yAxisAlignment,
                            lineStyle: properties.settings.lineStyle,
                            metrics: data.dataInteractionDatabaseTableMetrics[0],
                        },
                    ];
                }
                else {
                    // If the data does exist, update it
                    return [
                        ...oldData.slice(0, index),
                        {
                            id: properties.settings.id,
                            databaseName: properties.settings.databaseName,
                            tableName: properties.settings.tableName,
                            columnName: columnToMeasure,
                            color: properties.settings.color,
                            yAxisAlignment: properties.settings.yAxisAlignment,
                            lineStyle: properties.settings.lineStyle,
                            metrics: data.dataInteractionDatabaseTableMetrics[0],
                        },
                        ...oldData.slice(index + 1),
                    ];
                }
            });
        },
        onError: (error) => {
            properties.setDataSourcesWithMetrics((old) => {
                return old.filter((old) => old.id !== properties.settings.id);
            });
        },
    });

    // Function to handle changing the database and table
    function handleDatabaseAndTableChange(databaseName?: string, tableName?: string) {
        // If a table name is provided, update the table name
        if(databaseName && tableName) {
            properties.setDataSources(function (previousDataSources) {
                // Find the index of the current data source
                const previousDataSourceIndex = previousDataSources?.findIndex(
                    (currentDataSource) => currentDataSource.id === properties.settings.id,
                );

                return previousDataSources?.map((currentDataSource, currentDataSourceIndex) => {
                    if(currentDataSourceIndex === previousDataSourceIndex) {
                        return {
                            ...currentDataSource,
                            databaseName,
                            tableName,
                        };
                    }
                    else {
                        return currentDataSource;
                    }
                });
            });
        }
        // If no table name is provided, remove the data source
        else {
            properties.deleteDataSource(properties.settings.id);
        }
    }

    // Function to handle deleting the data source
    async function handleDelete() {
        properties.deleteDataSource(properties.settings.id);
    }

    // Function to handle changing the color
    // TODO: Andrew was using debouence here
    function handleColorChange(color: RgbColor) {
        // Update the color of the chart data
        properties.setDataSourcesWithMetrics((oldData) => {
            // Find the index of the current config
            const configurationIndex = oldData?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldData?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        color: `rgba(${color.r}, ${color.g}, ${color.b}, 100%)`,
                    };
                }
                else {
                    return configuration;
                }
            });
        });

        // Update the color of the query config
        properties.setDataSources((oldConfigurationArray) => {
            // Find the index of the current config
            const configurationIndex = oldConfigurationArray?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldConfigurationArray?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        color: `rgba(${color.r}, ${color.g}, ${color.b}, 100%)`,
                    };
                }
                else {
                    return configuration;
                }
            });
        });
    }

    // Function to handle changing the hex color
    function handleHexColorChange(color: string) {
        // This will accept a hex color and convert it to an rgba color

        // If the color is not a valid hex color, return
        if(!/^#([A-Fa-f0-9]{6}){1,2}$/.test(color)) return;

        // Convert the hex color to an rgba color
        const rgbColor = hexStringToRgb(color);

        // If the color is not a valid rgb color, return
        if(!rgbColor) return;

        // Update the color of the chart data
        handleColorChange({
            r: Number(rgbColor[0]),
            g: Number(rgbColor[1]),
            b: Number(rgbColor[2]),
        });
    }

    // Function to handle changing the yAxis alignment
    const handleYAxisChange = (yAxisAlignment: 'left' | 'right') => {
        // Update the yAxis of the chart data
        properties.setDataSourcesWithMetrics((oldData) => {
            // Find the index of the current config
            const configurationIndex = oldData?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldData?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        yAxisAlignment: yAxisAlignment,
                    };
                }
                else {
                    return configuration;
                }
            });
        });

        // Update the yAxis of the query config
        properties.setDataSources((oldConfigurationArray) => {
            // Find the index of the current config
            const configurationIndex = oldConfigurationArray?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldConfigurationArray?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        yAxisAlignment: yAxisAlignment,
                    };
                }
                else {
                    return configuration;
                }
            });
        });
    };

    // Function to handle changing the lineStyle
    function handleLineStyleChange(lineStyle: 'solid' | 'dashed') {
        // Update the lineStyle of the chart data
        properties.setDataSourcesWithMetrics((oldData) => {
            // Find the index of the current config
            const configurationIndex = oldData?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldData?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        lineStyle: lineStyle,
                    };
                }
                else {
                    return configuration;
                }
            });
        });

        // Update the lineStyle of the query configuration
        properties.setDataSources((oldConfigurationArray) => {
            // Find the index of the current configuration
            const configurationIndex = oldConfigurationArray?.findIndex(
                (configuration) => configuration.id === properties.settings.id,
            );

            return oldConfigurationArray?.map((configuration, id) => {
                if(id === configurationIndex) {
                    return {
                        ...configuration,
                        lineStyle: lineStyle,
                    };
                }
                else {
                    return configuration;
                }
            });
        });
    }

    interface Statistics {
        count: number;
        sum: number;
        minimum: number;
        maximum: number;
        range: number;
        average: number;
        median: number;
        mode: number;
        standardDeviation: number;
        standardDeviationMessage: string;
        percentiles: Map<number, number>; // A map of percentile to value
    }

    const calculateStatistics = (dataPoints: number[]): Statistics => {
        // Sort the data points from smallest to largest
        const sortedData = [...dataPoints].sort((a, b) => a - b);

        // The count is the length of the sorted array
        const count = sortedData.length;

        // The sum is the sum of all the elements in the sorted array
        const sum = sortedData.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        // The minimum is the first element in the sorted array
        const minimum = sortedData[0] ?? 0;

        // The maximum is the last element in the sorted array
        const maximum = sortedData[sortedData.length - 1] ?? 0;

        // The range is the difference between the maximum and minimum
        const range = maximum - minimum;

        // The average is the sum divided by the count, rounded to the first decimal place
        const average = Math.round((sum / count) * 100) / 100;

        // The median is the middle element of the sorted array
        let median: number | 0;
        // If the length of the sorted array is even, the median is the average of the two middle elements
        if(sortedData.length % 2 === 0) {
            const middleIndex1 = sortedData.length / 2 - 1;
            const middleIndex2 = sortedData.length / 2;
            const middle1 = sortedData[middleIndex1] ?? 0;
            const middle2 = sortedData[middleIndex2] ?? 0;
            median = middle1 !== null && middle2 !== null ? (middle1 + middle2) / 2 : 0;
        }
        // If the length of the sorted array is odd, the median is the middle element
        else {
            median = sortedData[Math.floor(sortedData.length / 2)] ?? 0;
        }

        // The mode is the most common element in the sorted array
        let mode: number = 0;

        // Initialize a Map to count occurrences
        const frequencyMap = new Map<number, number>();
        sortedData.forEach((number) => {
            const count = frequencyMap.get(number) || 0;
            frequencyMap.set(number, count + 1);
        });

        // Find the mode
        let maxFrequency = 0;
        frequencyMap.forEach((count, number) => {
            if(count > maxFrequency) {
                maxFrequency = count;
                mode = number;
            }
        });

        // Calculate the variance, which is the average of the squared differences from the mean
        const variance =
            dataPoints.reduce((previousValue, currentValue) => previousValue + Math.pow(currentValue - average, 2), 0) /
            count;

        // Calculate the standard deviation
        const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

        // Calculate the standard deviation message
        let standardDeviationMessage = '';
        const ratio = standardDeviation / average;
        if(ratio < 0.05) {
            standardDeviationMessage = 'High Precision, Minimal Spread';
        }
        else if(ratio < 0.2) {
            standardDeviationMessage = 'Consistent Data, Limited Spread';
        }
        else if(ratio < 0.3) {
            standardDeviationMessage = 'Balanced Spread, Moderate Variation';
        }
        else if(ratio < 0.5) {
            standardDeviationMessage = 'Diverse Values, Noticeable Spread';
        }
        else {
            standardDeviationMessage = 'Wide Range, High Variability';
        }

        // Function to calculate a specific percentile
        const getPercentile = (sortedData: number[], p: number): number => {
            if(sortedData.length === 0) return 0;

            const position = (sortedData.length - 1) * p;
            const base = Math.floor(position);
            const rest = position - base;

            let baseNumber = sortedData[base] as number;
            if(base < sortedData.length - 1) {
                const nextValue = sortedData[base + 1] as number; // Asserting that the value is a number
                return Math.round(baseNumber + rest * (nextValue - baseNumber));
            }
            else {
                return Math.round(baseNumber);
            }
        };

        // Calculate specific percentiles (e.g., 25th, 50th, 75th, 95th)
        let percentiles = new Map<number, number>();
        [0.05, 0.25, 0.5, 0.75, 0.95].forEach((percentage) => {
            percentiles.set(percentage * 100, getPercentile(sortedData, percentage));
        });

        return {
            count,
            sum,
            minimum,
            maximum,
            range,
            median,
            average,
            mode,
            standardDeviation,
            standardDeviationMessage,
            percentiles,
        };
    };

    // Calculate the statistics
    const statistics = calculateStatistics(
        dataInteractionDatabaseTableMetricsQueryState.data?.dataInteractionDatabaseTableMetrics[0]?.data.map(
            (d: any) => d[1],
        ) ?? [],
    );

    // console.log('availableColumns', availableColumns);

    // Render the component
    return (
        <div className="relative my-2 flex w-full items-center justify-start space-x-2">
            {/* Drag Icon */}
            <div
                {...properties.dragEventListener}
                className={`relative flex aspect-square h-6 w-6 touch-none items-center justify-center rounded p-1 opacity-50 hover:cursor-grab hover:bg-dark-4/10 active:cursor-grabbing hover:dark:bg-light-4/10 
                `}
            >
                <DragIcon className="h-full w-full rotate-90" />
            </div>

            {/* Bar color, database name, and table selector */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    {/* The corresponding color of the bar */}
                    <Popover
                        content={
                            <div className="w-min p-1">
                                <RgbColorPicker
                                    color={{
                                        r: Number(properties.settings.color.split('(')[1]?.split(',')[0]),
                                        g: Number(properties.settings.color.split('(')[1]?.split(',')[1]),
                                        b: Number(properties.settings.color.split('(')[1]?.split(',')[2]),
                                    }}
                                    onChange={(color) => {
                                        // Update the input value
                                        const input = document.getElementById(
                                            'color-input-' + properties.settings.id,
                                        ) as HTMLInputElement;
                                        input.value = rgbStringToHexString(
                                            `rgba(${color.r}, ${color.g}, ${color.b}, 100%)`,
                                        ).slice(1);

                                        // Update the color
                                        handleColorChange(color);
                                    }}
                                />
                                {/* Input for a HEX color */}
                                <div className="relative mt-1 flex items-center">
                                    <span className="text-gray/50 dark:text-gray-secondary/50 absolute left-3">#</span>
                                    <InputText
                                        id={'color-' + properties.settings.id}
                                        defaultValue={rgbStringToHexString(properties.settings.color).slice(1)}
                                        onChange={function (value, event) {
                                            handleHexColorChange('#' + value);
                                        }}
                                        className="pl-7 font-mono"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>
                        }
                    >
                        <div
                            className="h-6 w-6 flex-shrink-0 cursor-pointer rounded-md"
                            style={{
                                backgroundColor: properties.settings.color,
                            }}
                        ></div>
                    </Popover>
                </div>
            </div>

            <DatabaseAndTableFormInputSelects
                databaseNameFormInputSelectProperties={{
                    className: 'w-40',
                    label: undefined,
                    defaultValue: !properties.settings.databaseName ? undefined : properties.settings.databaseName,
                }}
                tableNameFormInputSelectProperties={{
                    className: 'w-48',
                    label: undefined,
                    defaultValue: !properties.settings.tableName ? undefined : properties.settings.tableName,
                }}
                onChange={function (databaseName?: string, tableName?: string) {
                    handleDatabaseAndTableChange(databaseName, tableName);
                }}
            />

            {/* Column selector */}
            <FormInputSelect
                key={properties.settings.tableName + columnToMeasure}
                id="column-name"
                className="w-40"
                componentClassName="w-40"
                // className="flex items-center space-x-2"
                placeholder="Column"
                items={
                    availableColumns?.map((column) => ({
                        value: column,
                        content: column,
                    })) ?? []
                }
                defaultValue={
                    // Check if the properties.settings.columnName exists in the available columns
                    availableColumns?.includes(properties.settings.columnName)
                        ? properties.settings.columnName
                        : // If not, default to the first available column
                          availableColumns?.at(0)
                }
                disabled={dataInteractionDatabaseTableQueryState.loading || !availableColumns}
                onChange={(value) => setColumnToMeasureOnDataSources(value as string)}
            />

            {/* Y Axis Selector */}
            <FormInputSelect
                id="y-axis-alignment"
                className="w-28"
                componentClassName="w-28"
                // className="flex items-center space-x-2 pr-20 md:pr-0"
                // label="Y Axis Alignment"
                defaultValue={properties.settings.yAxisAlignment}
                items={[
                    {
                        value: 'left',
                        content: 'Left',
                    },
                    {
                        value: 'right',
                        content: 'Right',
                    },
                ]}
                onChange={(value) => handleYAxisChange(value as 'left' | 'right')}
            />

            {/* Line Style Selector */}
            {(properties.settings.chartType === 'line' || properties.settings.chartType === 'area') && (
                <FormInputSelect
                    id="line-style"
                    className="w-28"
                    componentClassName="w-28"
                    // className="flex items-center space-x-2 pr-20 md:pr-0"
                    // label="Line Style"
                    items={[
                        {
                            value: 'solid',
                            content: 'Solid',
                        },
                        {
                            value: 'dashed',
                            content: 'Dashed',
                        },
                    ]}
                    defaultValue={properties.settings.lineStyle}
                    onChange={(value) => handleLineStyleChange(value as 'solid' | 'dashed')}
                />
            )}

            <div className="flex items-center space-x-2 overflow-visible pr-2">
                <Button
                    variant="ghostDestructive"
                    size="icon"
                    className="relative left-0.5 aspect-square p-1"
                    icon={MinusCircledIcon}
                    onClick={handleDelete}
                />

                {/* Tooltip Content */}
                <Tip
                    content={
                        <div className="p-2">
                            {!dataInteractionDatabaseTableMetricsQueryState.loading && (
                                <div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="">Count</td>
                                                <td className="pl-4">{statistics.count}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Sum</td>
                                                <td className="pl-4">{addCommas(statistics.sum)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Minimum</td>
                                                <td className="pl-4">{addCommas(statistics.minimum)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Maximum</td>
                                                <td className="pl-4">{addCommas(statistics.maximum)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Range</td>
                                                <td className="pl-4">{addCommas(statistics.range)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Average</td>
                                                <td className="pl-4">{addCommas(statistics.average)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Median</td>
                                                <td className="pl-4">{addCommas(statistics.median)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Mode</td>
                                                <td className="pl-4">{addCommas(statistics.mode)}</td>
                                            </tr>
                                            <tr>
                                                <td className="">Standard Deviation</td>
                                                <td className="pl-4">
                                                    {addCommas(statistics.standardDeviation)} (
                                                    {statistics.standardDeviationMessage})
                                                </td>
                                            </tr>
                                            {Array.from(statistics.percentiles.entries()).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="">{key}th Percentile</td>
                                                    <td className="pl-4">{addCommas(value ?? 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    }
                >
                    <p className="relative cursor-default text-end italic text-dark/30 dark:text-light-4/50">
                        {dataInteractionDatabaseTableMetricsQueryState.loading ? '...' : addCommas(statistics.sum)}
                    </p>
                </Tip>
            </div>
        </div>
    );
}

// Export - Default
export default DataSource;
