// Dependencies - React and Next.js
import React from 'react';
import { Options as NextUseQueryStateOptions } from 'next-usequerystate';

// Dependencies - Main Components
import { DataSourceType, DataSourceWithMetricsType } from './Metrics';
import DataSource from './DataSource';

import { TimeInterval } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Supporting Components
import { Button } from '@structure/source/common/buttons/Button';
import useDragAnimation from '@structure/source/common/animations/useDragAnimation';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { hexStringToRgbaString, getComplementaryHexColor } from '@structure/source/utilities/Color';
import { useSprings, animated, config, UseSpringProps as UseSpringProperties } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { clamp } from '@structure/source/utilities/Number';
import { swapArrayElements } from '@structure/source/utilities/Array';

// Component - DataSources
// This component is responsible for fetching the data and passing it up to the higher level component
export interface DataSourcesInterface {
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
export function DataSources(properties: DataSourcesInterface) {
    const dataSourcesContainerRef = React.useRef<HTMLDivElement>(null);

    // Store the original order of the data sources (before dragging) this will be used to update the visual order of the data sources
    const visualOrder = React.useRef(Array.from(Array(properties.settings.dataSources.length).keys()));

    // console.log("Data Order: ", properties.settings.dataSources);
    // console.log("Visual Order: ", visualOrder.current);

    // Use the drag animation
    const dragAnimation = useDragAnimation();

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
        visualOrder.current = [...visualOrder.current, newIndex];
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
            const configIndex = oldData?.findIndex((config) => config.id === id);

            return oldData?.filter((configuration, id) => id !== configIndex);
        });

        // Update the visual order
        visualOrder.current = Array.from(Array(visualOrder.current.length - 1).keys());
    };

    // Set the height of each row
    const rowHeight = 52;

    // Create springs, each corresponds to an item, controlling its transform, scale, etc.
    const [springs, springsApi] = useSprings(
        visualOrder.current.length,
        dragAnimation({ order: visualOrder.current, height: rowHeight }),
    );

    // Bind the drag event to the row
    const dragEventListener = useDrag(
        ({ args: [originalIndex], active, movement: [x, y] }) => {
            // Find the current index of the row in the visual order (contained in visualOrder)
            const visualIndex = visualOrder.current.indexOf(originalIndex);

            // If the row is not found, return
            if(visualIndex === -1) return;

            // Calculate the new index of the row
            const currentRow = clamp(
                Math.round((visualIndex * rowHeight + y) / rowHeight),
                0,
                visualOrder.current.length - 1,
            );

            // Swap the order of the rows
            const newOrder = swapArrayElements(visualOrder.current, visualIndex, currentRow);

            // Animate the new order
            springsApi.start(
                dragAnimation({
                    order: newOrder,
                    active,
                    originalIndex,
                    currentIndex: visualIndex,
                    y,
                    height: rowHeight,
                    // Once the animation is complete, update the queryConfig and the visual order
                    onRest: () => {
                        if(!active) {
                            // Check if the order of the datasources is the same as the visual order
                            const datasourceOrder = properties.settings.dataSources.map((datasource) => datasource.id);
                            const visualOrderIds = newOrder.map((index) => properties.settings.dataSources[index]?.id);
                            // console.log(datasourceOrder, visualOrderIds);

                            // If the order is the same, don't update the data sources
                            if(datasourceOrder.join('') === visualOrderIds.join('')) return;

                            // If not, update the order of the data sources

                            // Update the data sources
                            console.log('Updating the order of the data sources.');
                            const newDataSourcesOrder: DataSourceType[] = newOrder
                                .map((index) => properties.settings.dataSources[index])
                                .filter((config): config is DataSourceType => Boolean(config));
                            console.log(newDataSourcesOrder);
                            properties.setDataSources(newDataSourcesOrder);
                        }
                    },
                }),
            ); // Feed springs new style data, they'll animate the view without causing a single render
        },
        {
            bounds: dataSourcesContainerRef,
            axis: 'y',
        },
    );

    // Immediately animate to the new visual order when the data sources change
    React.useEffect(() => {
        // Update the visual order
        visualOrder.current = Array.from(Array(properties.settings.dataSources.length).keys());

        // Animate the new order
        springsApi.start(
            dragAnimation({
                order: visualOrder.current,
                active: false,
                originalIndex: 0,
                currentIndex: 0,
                y: 0,
                height: rowHeight,
                // This is an immediate animation, so it will not be animated
                immediate: true,
            }),
        );
    }, [properties.settings.dataSources, dragAnimation, springsApi]);

    // Render the component
    return (
        <>
            {/* Controls */}
            <div className="relative">
                <div className="overflow-x-auto">
                    {/* Header */}
                    {properties.settings.dataSources.length > 0 && (
                        <div className="mb-1 w-[520px] text-sm font-semibold">
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
                    <div
                        style={{
                            height: properties.settings.dataSources.length * rowHeight,
                        }}
                        className="relative"
                        ref={dataSourcesContainerRef}
                    >
                        {springs.map(function ({ zIndex, y, scale }, index) {
                            const dataSource = properties.settings.dataSources[index];

                            // If the data source is not found, return null
                            if(!dataSource) return null;

                            return (
                                <animated.div
                                    style={{
                                        zIndex,
                                        y,
                                        scale,
                                    }}
                                    key={dataSource.id + '-' + index}
                                    className={'absolute touch-none'}
                                >
                                    <DataSource
                                        settings={{
                                            ...dataSource,
                                            startTime: properties.settings.startTime,
                                            endTime: properties.settings.endTime,
                                            timeInterval: properties.settings.timeInterval,
                                            chartType: properties.settings.chartType,
                                        }}
                                        setDataSources={properties.setDataSources}
                                        setDataSourcesWithMetrics={properties.setDataSourcesWithMetrics}
                                        deleteDataSource={handleRemoveDataSource}
                                        isFirst={index === 0}
                                        dragEventListener={dragEventListener(index)}
                                        error={properties.error}
                                        setLoading={properties.setLoading}
                                    />
                                </animated.div>
                            );
                        })}
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

// Export - Default
export default DataSources;
