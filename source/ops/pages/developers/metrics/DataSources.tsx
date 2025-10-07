// Dependencies - React and Next.js
import React from 'react';
import { Options as NextUseQueryStateOptions } from 'nuqs';

// Dependencies - Main Components
import { DataSourceType, DataSourceWithMetricsType } from './Metrics';
import { DataSource } from './DataSource';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Supporting Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Animation
import { AnimatePresence, Reorder } from 'motion/react';

// Dependencies - Utilities
import { getTimeSeriesColor } from '@structure/source/common/charts/time-series/utilities/TimeSeriesColors';
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Component - DataSources
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
    const dataSourcesContainerReference = React.useRef<HTMLDivElement>(null);

    // Local state for drag operations to prevent URL jank
    const [localDataSources, setLocalDataSources] = React.useState<DataSourceType[]>(properties.settings.dataSources);
    const pendingUrlSyncReference = React.useRef<DataSourceType[] | null>(null);

    // Sync local state with URL state (only when URL changes externally)
    React.useEffect(
        function () {
            setLocalDataSources(properties.settings.dataSources);
        },
        [properties.settings.dataSources],
    );

    // Handle drag end - sync to URL after drag completes and animation settles
    const handleDragEnd = React.useCallback(
        function () {
            if(pendingUrlSyncReference.current) {
                // Delay URL sync to allow drop animation to complete
                setTimeout(function () {
                    if(pendingUrlSyncReference.current) {
                        properties.setDataSources(pendingUrlSyncReference.current);
                        pendingUrlSyncReference.current = null;
                    }
                }, 500);
            }
        },
        [properties.setDataSources],
    );

    // Add a new data source
    const handleAddDataSource = async function () {
        const newIndex = properties.settings.dataSources.length;
        const color = getTimeSeriesColor(newIndex);

        // Call the setDataSources function to add a new data source
        properties.setDataSources([
            ...properties.settings.dataSources,
            {
                id: uniqueIdentifier(8),
                databaseName: '',
                tableName: '',
                columnName: '',
                color: color,
                yAxisAlignment: 'left',
                lineStyle: 'solid',
            },
        ]);
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
    };

    // Render the component
    return (
        <>
            {/* Controls */}
            <div className="relative">
                <div className="min-w-0">
                    {/* Header */}
                    {properties.settings.dataSources.length > 0 && (
                        <div className="mb-3 w-[520px] text-sm font-medium">
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
                    <div id="data-sources-container" ref={dataSourcesContainerReference}>
                        <Reorder.Group
                            axis="y"
                            values={localDataSources}
                            onReorder={(values) => {
                                // Update local state immediately for smooth animation
                                setLocalDataSources(values);
                                // Store for URL sync after drag ends
                                pendingUrlSyncReference.current = values;
                            }}
                            layoutScroll
                            style={{ position: 'relative' }}
                        >
                            <AnimatePresence mode="popLayout" initial={false} propagate>
                                {localDataSources.map((dataSource, index) => {
                                    return (
                                        <DataSource
                                            key={dataSource.id}
                                            settings={{
                                                ...dataSource,
                                                startTime: properties.settings.startTime,
                                                endTime: properties.settings.endTime,
                                                timeInterval: properties.settings.timeInterval,
                                                chartType: properties.settings.chartType,
                                            }}
                                            dataSource={dataSource}
                                            setDataSources={properties.setDataSources}
                                            setDataSourcesWithMetrics={properties.setDataSourcesWithMetrics}
                                            deleteDataSource={handleRemoveDataSource}
                                            isFirst={index === 0}
                                            error={properties.error}
                                            setLoading={properties.setLoading}
                                            containerReference={dataSourcesContainerReference}
                                            onDragEnd={handleDragEnd}
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
