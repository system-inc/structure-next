// Dependencies - React and Next.js
import React from 'react';
import { Options as NextUseQueryStateOptions } from 'nuqs';

// Dependencies - Main Components
import { DataSourceType, DataSourceWithMetricsType } from './Metrics';
import { InputText } from '@structure/source/components/forms/InputText';
import { FormInputSelect } from '@structure/source/components/forms/FormInputSelect';
import { DatabaseAndTableFormInputSelects } from '@structure/source/ops/developers/databases/DatabaseAndTableFormInputSelects';
import { Button } from '@structure/source/components/buttons/Button';
import { Popover } from '@structure/source/components/popovers/Popover';
import { Tip } from '@structure/source/components/popovers/Tip';
import { TimeSeriesStatisticsDisplay } from '@structure/source/components/charts/time-series/components/TimeSeriesStatisticsDisplay';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Hooks
import { useDataInteractionDatabaseTableRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRequest';
import { useDataInteractionDatabaseTableMetricsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableMetricsRequest';

// Dependencies - Assets
import DragIcon from '@structure/assets/icons/interface/DragIcon.svg';
import MinusCircledIcon from '@structure/assets/icons/interface/MinusCircledIcon.svg';

// Dependencies - Utilities
import { RgbColor, RgbColorPicker } from 'react-colorful';
import { convertColorString, rgbaStringToRgbaArray } from '@structure/source/utilities/style/Color';
import { addCommas } from '@structure/source/utilities/type/Number';
import { calculateStatistics } from '@structure/source/components/charts/time-series/utilities/TimeSeriesStatistics';
import { Reorder, useDragControls } from 'motion/react';

// Component - DataSource
export interface DataSourceProperties {
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
    error?: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    dataSource: DataSourceType;
    containerReference: React.RefObject<HTMLDivElement | null>;
    onDragEnd: () => void;
}
export const DataSource = React.forwardRef<HTMLLIElement, DataSourceProperties>(
    function DataSource(properties, reference) {
        // State
        const [isDraggingColor, setIsDraggingColor] = React.useState(false);
        const [localColor, setLocalColor] = React.useState<RgbColor | null>(null);
        const latestColorReference = React.useRef<RgbColor | null>(null);

        // Drag controller
        const dragControls = useDragControls();

        // Parse the current color from props (handles both hex and rgba formats)
        const rgbaString = convertColorString(properties.settings.color, 'rgba');
        const [r, g, b] = rgbaStringToRgbaArray(rgbaString);
        const currentColor = { r, g, b };

        // Query the API for the available columns for the current table
        const dataInteractionDatabaseTableRequest = useDataInteractionDatabaseTableRequest(
            properties.settings.databaseName,
            properties.settings.tableName,
        );

        // Get the available columns for the table
        let availableColumns: string[] | undefined = undefined;
        if(dataInteractionDatabaseTableRequest.data?.dataInteractionDatabaseTable.columns) {
            availableColumns = dataInteractionDatabaseTableRequest.data?.dataInteractionDatabaseTable.columns
                // Filter out columns that are not datetime
                .filter(function (column) {
                    return column.type === 'datetime';
                })
                // Map to column names
                .map(function (column) {
                    return column.name;
                });
        }

        // Set the default column to measure to the searchParams column or "createdAt" if that exists in the availableColumns. Otherwise, default to the first available column
        const columnToMeasure =
            availableColumns?.find(function (value) {
                const columnToFind = properties.settings.columnName ?? 'createdAt';
                return value === columnToFind;
            }) ??
            availableColumns?.at(0) ??
            '';

        // Function to set the column to measure
        function setColumnToMeasureOnDataSources(newColumnName: string) {
            properties.setDataSources(function (oldConfigurationArray) {
                // Find the index of the current config
                const configurationIndex = oldConfigurationArray?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldConfigurationArray?.map(function (configuration, id) {
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
        const dataInteractionDatabaseTableMetricsRequest = useDataInteractionDatabaseTableMetricsRequest(
            {
                databaseName: properties.settings.databaseName as string,
                tableName: properties.settings.tableName as string,
                columnName: columnToMeasure,
                timeInterval: properties.settings.timeInterval ?? TimeInterval.Day,
                startTime: properties.settings.startTime?.toISOString(),
                endTime: properties.settings.endTime?.toISOString(),
            },
            {
                enabled: !properties.error && !!columnToMeasure, // Skip if there is an error or if there is no column to measure
            },
        );

        // Extract properties for the first useEffect dependency
        const propertiesSettingsId = properties.settings.id;
        const propertiesSettingsDatabaseName = properties.settings.databaseName;
        const propertiesSettingsTableName = properties.settings.tableName;
        const propertiesSettingsColor = properties.settings.color;
        const propertiesSettingsYAxisAlignment = properties.settings.yAxisAlignment;
        const propertiesSettingsLineStyle = properties.settings.lineStyle;
        const propertiesSetLoading = properties.setLoading;
        const propertiesSetDataSourcesWithMetrics = properties.setDataSourcesWithMetrics;

        // Handle success state
        React.useEffect(
            function () {
                if(dataInteractionDatabaseTableMetricsRequest.data) {
                    const data = dataInteractionDatabaseTableMetricsRequest.data;

                    // Set the loading state to false
                    propertiesSetLoading(false);

                    // If there is no data, return
                    if(!data) return;

                    propertiesSetDataSourcesWithMetrics(function (oldData) {
                        if(!data.dataInteractionDatabaseTableMetrics)
                            return oldData.filter(function (old) {
                                return old.id !== propertiesSettingsId;
                            });

                        // Find if the data already exists in the array
                        const index = oldData.findIndex(function (old) {
                            return old.id === propertiesSettingsId;
                        });

                        // If the data doesn't exist, add it to the array
                        if(index === -1) {
                            return [
                                ...oldData,
                                {
                                    id: propertiesSettingsId,
                                    databaseName: propertiesSettingsDatabaseName,
                                    tableName: propertiesSettingsTableName,
                                    columnName: columnToMeasure,
                                    color: propertiesSettingsColor,
                                    yAxisAlignment: propertiesSettingsYAxisAlignment,
                                    lineStyle: propertiesSettingsLineStyle,
                                    metrics: data.dataInteractionDatabaseTableMetrics,
                                },
                            ];
                        }
                        else {
                            // If the data does exist, update it
                            return [
                                ...oldData.slice(0, index),
                                {
                                    id: propertiesSettingsId,
                                    databaseName: propertiesSettingsDatabaseName,
                                    tableName: propertiesSettingsTableName,
                                    columnName: columnToMeasure,
                                    color: propertiesSettingsColor,
                                    yAxisAlignment: propertiesSettingsYAxisAlignment,
                                    lineStyle: propertiesSettingsLineStyle,
                                    metrics: data.dataInteractionDatabaseTableMetrics,
                                },
                                ...oldData.slice(index + 1),
                            ];
                        }
                    });
                }
            },
            [
                dataInteractionDatabaseTableMetricsRequest.data,
                columnToMeasure,
                propertiesSettingsId,
                propertiesSettingsDatabaseName,
                propertiesSettingsTableName,
                propertiesSettingsColor,
                propertiesSettingsYAxisAlignment,
                propertiesSettingsLineStyle,
                propertiesSetLoading,
                propertiesSetDataSourcesWithMetrics,
            ],
        );

        // Effect to handle error state
        React.useEffect(
            function () {
                if(dataInteractionDatabaseTableMetricsRequest.isError) {
                    propertiesSetDataSourcesWithMetrics(function (old) {
                        return old.filter(function (old) {
                            return old.id !== propertiesSettingsId;
                        });
                    });
                }
            },
            [
                dataInteractionDatabaseTableMetricsRequest.isError,
                propertiesSettingsId,
                propertiesSetDataSourcesWithMetrics,
            ],
        );

        // Function to handle changing the database and table
        function handleDatabaseAndTableChange(databaseName?: string, tableName?: string) {
            // If a table name is provided, update the table name
            if(databaseName && tableName) {
                properties.setDataSources(function (previousDataSources) {
                    // Find the index of the current data source
                    const previousDataSourceIndex = previousDataSources?.findIndex(function (currentDataSource) {
                        return currentDataSource.id === properties.settings.id;
                    });

                    return previousDataSources?.map(function (currentDataSource, currentDataSourceIndex) {
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

        // Function to handle changing the color (visual update only)
        function handleColorChangeVisual(color: RgbColor) {
            const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;

            // Store latest color in ref and state
            latestColorReference.current = color;
            setLocalColor(color);

            // Update the color of the chart data (for immediate visual feedback)
            properties.setDataSourcesWithMetrics(function (oldData) {
                // Find the index of the current config
                const configurationIndex = oldData?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldData?.map(function (configuration, id) {
                    if(id === configurationIndex) {
                        return {
                            ...configuration,
                            color: colorString,
                        };
                    }
                    else {
                        return configuration;
                    }
                });
            });
        }

        // Function to commit color change to URL state
        function handleColorChangeCommit() {
            if(!latestColorReference.current) return;

            const color = latestColorReference.current;
            const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;

            // Update the color of the query config (URL state)
            properties.setDataSources(function (oldConfigurationArray) {
                // Find the index of the current config
                const configurationIndex = oldConfigurationArray?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldConfigurationArray?.map(function (configuration, id) {
                    if(id === configurationIndex) {
                        return {
                            ...configuration,
                            color: colorString,
                        };
                    }
                    else {
                        return configuration;
                    }
                });
            });

            // Clear latest color ref and state
            latestColorReference.current = null;
            setLocalColor(null);
        }

        // Function to handle changing the hex color
        function handleHexColorChange(color: string) {
            // This will accept a hex color and convert it to an rgba color

            // If the color is not a valid hex color, return
            if(!/^#([A-Fa-f0-9]{6}){1,2}$/.test(color)) return;

            // Convert the hex color to an rgba color
            const rgbaString = convertColorString(color, 'rgba');
            const [r, g, b] = rgbaStringToRgbaArray(rgbaString);
            const colorObj = { r, g, b };

            // Update both visual and URL state (hex input is not draggable)
            handleColorChangeVisual(colorObj);
            handleColorChangeCommit();
        }

        // Function to handle changing the yAxis alignment
        function handleYAxisChange(yAxisAlignment: 'left' | 'right') {
            // Update the yAxis of the chart data
            properties.setDataSourcesWithMetrics(function (oldData) {
                // Find the index of the current config
                const configurationIndex = oldData?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldData?.map(function (configuration, id) {
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
            properties.setDataSources(function (oldConfigurationArray) {
                // Find the index of the current config
                const configurationIndex = oldConfigurationArray?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldConfigurationArray?.map(function (configuration, id) {
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
        }

        // Function to handle changing the lineStyle
        function handleLineStyleChange(lineStyle: 'solid' | 'dashed') {
            // Update the lineStyle of the chart data
            properties.setDataSourcesWithMetrics(function (oldData) {
                // Find the index of the current config
                const configurationIndex = oldData?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldData?.map(function (configuration, id) {
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
            properties.setDataSources(function (oldConfigurationArray) {
                // Find the index of the current configuration
                const configurationIndex = oldConfigurationArray?.findIndex(function (configuration) {
                    return configuration.id === properties.settings.id;
                });

                return oldConfigurationArray?.map(function (configuration, id) {
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

        // Calculate the statistics using the new utility
        const dataPoints =
            dataInteractionDatabaseTableMetricsRequest.data?.dataInteractionDatabaseTableMetrics?.data.map(
                function (d) {
                    return d[1];
                },
            ) ?? [];

        const statistics = calculateStatistics(dataPoints);

        // Render the component
        return (
            <Reorder.Item
                ref={reference}
                key={properties.dataSource.id}
                id={properties.dataSource.id}
                value={properties.dataSource}
                dragListener={false}
                dragControls={dragControls}
                dragConstraints={properties.containerReference}
                dragElastic={0.05}
                initial={{
                    height: 0,
                    opacity: 0,
                }}
                animate={{
                    height: 'auto',
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                }}
                exit={{
                    height: 0,
                    opacity: 0,
                }}
                whileDrag={{
                    scale: 1.1,
                    zIndex: 50,
                    cursor: 'grabbing',
                }}
                onDragEnd={properties.onDragEnd}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
                layout="position"
                style={{ originX: 0, originY: 0 }}
                className="relative overflow-y-clip"
            >
                <div className="relative flex w-full items-center justify-start space-x-2 py-1">
                    {/* Drag Icon */}
                    <div
                        onPointerDown={function (event) {
                            event.preventDefault();
                            dragControls.start(event);
                        }}
                        className="relative flex aspect-square h-6 w-6 touch-none items-center justify-center rounded p-1 opacity-50 hover:cursor-grab active:cursor-grabbing"
                    >
                        <DragIcon className="h-full w-full rotate-90" />
                    </div>

                    {/* Bar color, database name, and table selector */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            {/* The corresponding color of the bar */}
                            <Popover
                                side="Bottom"
                                align="Start"
                                sideOffset={8}
                                collisionPadding={20}
                                content={
                                    <div
                                        className="w-min overflow-visible p-1"
                                        onMouseDown={function () {
                                            setIsDraggingColor(true);
                                        }}
                                        onMouseUp={function () {
                                            if(isDraggingColor) {
                                                handleColorChangeCommit();
                                            }
                                            setIsDraggingColor(false);
                                        }}
                                        onMouseLeave={function () {
                                            if(isDraggingColor) {
                                                handleColorChangeCommit();
                                                setIsDraggingColor(false);
                                            }
                                        }}
                                        onTouchStart={function () {
                                            setIsDraggingColor(true);
                                        }}
                                        onTouchEnd={function () {
                                            if(isDraggingColor) {
                                                handleColorChangeCommit();
                                            }
                                            setIsDraggingColor(false);
                                        }}
                                    >
                                        <RgbColorPicker
                                            color={localColor || currentColor}
                                            onChange={function (color) {
                                                // Update the input value
                                                const input = document.getElementById(
                                                    'color-' + properties.settings.id,
                                                ) as HTMLInputElement;
                                                if(input) {
                                                    input.value = convertColorString(
                                                        `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
                                                        'hex',
                                                    ).slice(1);
                                                }

                                                // Update the color visually
                                                handleColorChangeVisual(color);
                                            }}
                                        />
                                        {/* Input for a HEX color */}
                                        <div className="relative mt-1 flex items-center">
                                            <span className="absolute left-3">#</span>
                                            <InputText
                                                id={'color-' + properties.settings.id}
                                                defaultValue={convertColorString(
                                                    properties.settings.color,
                                                    'hex',
                                                ).slice(1)}
                                                onChange={function (value) {
                                                    handleHexColorChange('#' + value);
                                                }}
                                                className="pl-7 font-mono"
                                                placeholder="000000"
                                            />
                                        </div>
                                    </div>
                                }
                                trigger={
                                    <div
                                        className="h-6 w-6 shrink-0 cursor-pointer rounded-md"
                                        style={{
                                            backgroundColor: properties.settings.color,
                                        }}
                                    ></div>
                                }
                            />
                        </div>
                    </div>

                    <DatabaseAndTableFormInputSelects
                        databaseNameFormInputSelectProperties={{
                            className: 'w-40',
                            label: undefined,
                            defaultValue: !properties.settings.databaseName
                                ? undefined
                                : properties.settings.databaseName,
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
                        placeholder="Column"
                        items={
                            availableColumns?.map(function (column) {
                                return {
                                    value: column,
                                    children: column,
                                };
                            }) ?? []
                        }
                        defaultValue={
                            // Check if the properties.settings.columnName exists in the available columns
                            availableColumns?.includes(properties.settings.columnName)
                                ? properties.settings.columnName
                                : // If not, default to the first available column
                                  availableColumns?.at(0)
                        }
                        disabled={dataInteractionDatabaseTableRequest.isLoading || !availableColumns}
                        onChange={function (value) {
                            setColumnToMeasureOnDataSources(value as string);
                        }}
                    />

                    {/* Y Axis Selector */}
                    <FormInputSelect
                        id="y-axis-alignment"
                        className="w-28"
                        componentClassName="w-28"
                        defaultValue={properties.settings.yAxisAlignment}
                        items={[
                            {
                                value: 'left',
                                children: 'Left',
                            },
                            {
                                value: 'right',
                                children: 'Right',
                            },
                        ]}
                        onChange={function (value) {
                            handleYAxisChange(value as 'left' | 'right');
                        }}
                    />

                    {/* Line Style Selector */}
                    {(properties.settings.chartType === 'line' || properties.settings.chartType === 'area') && (
                        <FormInputSelect
                            id="line-style"
                            className="w-28"
                            componentClassName="w-28"
                            items={[
                                {
                                    value: 'solid',
                                    children: 'Solid',
                                },
                                {
                                    value: 'dashed',
                                    children: 'Dashed',
                                },
                            ]}
                            defaultValue={properties.settings.lineStyle}
                            onChange={function (value) {
                                handleLineStyleChange(value as 'solid' | 'dashed');
                            }}
                        />
                    )}

                    <div className="flex items-center space-x-2 overflow-visible pr-2">
                        <Button
                            variant="DestructiveGhost"
                            className="relative left-0.5 aspect-square p-1"
                            icon={MinusCircledIcon}
                            onClick={handleDelete}
                        />

                        {/* Tooltip Content with Statistics */}
                        <Tip
                            content={
                                <TimeSeriesStatisticsDisplay
                                    statistics={statistics}
                                    isLoading={dataInteractionDatabaseTableMetricsRequest.isLoading}
                                    className="p-2"
                                />
                            }
                            trigger={
                                <p className="relative cursor-default text-end italic">
                                    {dataInteractionDatabaseTableMetricsRequest.isLoading
                                        ? '...'
                                        : addCommas(statistics.sum)}
                                </p>
                            }
                        />
                    </div>
                </div>
            </Reorder.Item>
        );
    },
);
