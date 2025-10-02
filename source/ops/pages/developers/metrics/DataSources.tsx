// Dependencies - React and Next.js
import React from 'react';
import { Options as NextUseQueryStateOptions } from 'nuqs';

// Dependencies - Main Components
import { DataSourceType, DataSourceWithMetricsType } from './Metrics';
import { DataSource } from './DataSource';

import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Supporting Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Animation

// Dependencies - Utilities
import { hexStringToRgbaString, getComplementaryHexColor } from '@structure/source/utilities/Color';
import { AnimatePresence, Reorder } from 'motion/react';

// Component - DataSources
// This component is responsible for fetching the data and passing it up to the higher level component
export interface DataSourcesProperties {
    settings: {
        dataSources: DataSourceType[];
        timeInterval: TimeInterval;
        startTime?: Date;
        endTime?: Date;
        chartType: 'bar' | 'line' | 'area';
    };
    setDataSources: (
        value: DataSourceType[] | ((old: DataSourceType[]) => DataSourceType[] | null) | null,
        options?: NextUseQueryStateOptions | undefined,
    ) => Promise<URLSearchParams>;
    setDataSourcesWithMetrics: React.Dispatch<React.SetStateAction<DataSourceWithMetricsType[]>>;
    error?: boolean; // If there is an error, don't fetch the data
    setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Set the loading state
}
export function DataSources(properties: DataSourcesProperties) {
    const datasourcesContainerReference = React.useRef<HTMLDivElement>(null);

    // Add a new data source
    const handleAddDataSource = async function () {
        const uniqueId = Math.random().toString(36).substring(7);
        const newIndex = properties.settings.dataSources.length;
        const color = hexStringToRgbaString(getComplementaryHexColor(newIndex, '#00AAFF'), 1);
        // console.log(uniqueId, newIndex, color);

        // Call the setDataSources function to add a new data source
        properties.setDataSources([
            ...properties.settings.dataSources,
            {
                id: uniqueId,
                databaseName: '',
                tableName: '',
                columnName: '',
                color: color,
                yAxisAlignment: 'left',
                lineStyle: 'solid',
            },
        ]);

        // Update the visual order
        // visualOrderReference.current = [...visualOrderReference.current, newIndex];
    };

    const handleRemoveDataSource = (id: string) => {
        properties.setDataSources((oldConfigurationArray) => {
            // Find the index of the current config
            const configurationIndex = oldConfigurationArray?.findIndex((configuration) => configuration.id === id);

            return oldConfigurationArray?.filter((configuration, id) => id !== configurationIndex);
        });

        // Remove the data from the chartData array
        properties.setDataSourcesWithMetrics((oldData) => {
            // Find the index of the current config
            const configIndex = oldData?.findIndex((configuration) => configuration.id === id);

            return oldData?.filter((configuration, id) => id !== configIndex);
        });

        // Update the visual order
        // visualOrderReference.current = Array.from(Array(visualOrderReference.current.length - 1).keys());
    };

    // Render the component
    return (
        <>
            {/* Controls */}
            <div className="relative">
                <div className="min-w-0">
                    {/* Header */}
                    {properties.settings.dataSources.length > 0 && (
                        <div className="mb-1 w-[520px] text-sm font-medium">
                            <div className="relative top-2 flex">
                                <div>
                                    <span className="ml-16">Database</span>
                                </div>
                                <div>
                                    <span className="ml-[104px]">Table</span>
                                </div>
                                <div>
                                    <span className="relative right-1 ml-[168px]">Column</span>
                                </div>
                                <div>
                                    <span className="ml-[114px] whitespace-nowrap">Y-Axis</span>
                                </div>
                                {(properties.settings.chartType === 'line' ||
                                    properties.settings.chartType === 'area') && (
                                    <div>
                                        <span className="relative right-1 ml-[82px] whitespace-nowrap">Line Style</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Data Sources (Rows) */}
                    <div id="data-sources-container" ref={datasourcesContainerReference}>
                        <Reorder.Group
                            values={properties.settings.dataSources}
                            onReorder={(values) => {
                                console.log({ values });

                                properties.setDataSources(values);
                            }}
                        >
                            <AnimatePresence mode="popLayout" initial={false} propagate>
                                {properties.settings.dataSources.map((datasource, index) => {
                                    return (
                                        <DataSource
                                            key={datasource.id}
                                            settings={{
                                                ...datasource,
                                                startTime: properties.settings.startTime,
                                                endTime: properties.settings.endTime,
                                                timeInterval: properties.settings.timeInterval,
                                                chartType: properties.settings.chartType,
                                            }}
                                            datasource={datasource}
                                            setDataSources={properties.setDataSources}
                                            setDataSourcesWithMetrics={properties.setDataSourcesWithMetrics}
                                            deleteDataSource={handleRemoveDataSource}
                                            isFirst={index === 0}
                                            error={properties.error}
                                            setLoading={properties.setLoading}
                                            containerReference={datasourcesContainerReference}
                                        />
                                    );
                                })}
                            </AnimatePresence>
                        </Reorder.Group>
                    </div>
                </div>

                {/* The add data source button */}
                <Button onClick={handleAddDataSource} className="mt-4 w-full whitespace-nowrap md:w-80">
                    <PlusIcon className="mr-0.5 aspect-square w-3" />
                    <span>{properties.settings.dataSources.length <= 0 ? 'Add Data Source' : 'Compare'}</span>
                </Button>
            </div>
        </>
    );
}
