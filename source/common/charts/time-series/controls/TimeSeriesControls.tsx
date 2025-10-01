'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeRangeType } from '@structure/source/common/time/TimeRange';

// Dependencies - Main Components
import { FormInputTimeRange } from '@structure/source/common/forms/FormInputTimeRange';
import { TimeIntervalFormInputSelect } from './TimeIntervalFormInputSelect';
import { ChartTypeFormInputSelect, ChartType } from './ChartTypeFormInputSelect';
import { SortOrderToggle, SortOrderType } from './SortOrderToggle';

// Dependencies - Types
import { TimeInterval } from '../TimeInterval';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - TimeSeriesControls
export interface TimeSeriesControlsProperties {
    // Time range controls
    timeRange?: TimeRangeType;
    onTimeRangeChange?: (value: TimeRangeType) => void;
    showTimeRange?: boolean;

    // Time interval controls
    timeInterval?: TimeInterval;
    onTimeIntervalChange?: (value: TimeInterval) => void;
    showTimeInterval?: boolean;
    availableTimeIntervals?: TimeInterval[];

    // Chart type controls
    chartType?: ChartType;
    onChartTypeChange?: (value: ChartType) => void;
    showChartType?: boolean;
    availableChartTypes?: ChartType[];

    // Sort order controls
    sortOrder?: SortOrderType;
    onSortOrderChange?: (value: SortOrderType) => void;
    showSortOrder?: boolean;

    // Styling
    className?: string;
    children?: React.ReactNode;
}
export function TimeSeriesControls(properties: TimeSeriesControlsProperties) {
    // Generate unique ID for this instance
    const instanceId = React.useId();

    // Default values for show flags
    const showTimeRange = properties.showTimeRange !== false;
    const showInterval = properties.showTimeInterval !== false;
    const showChartType = properties.showChartType !== false;
    const showSortOrder = properties.showSortOrder !== false;

    // Render the component
    return (
        <div className={mergeClassNames('flex flex-wrap items-center gap-4', properties.className)}>
            {/* Time Range */}
            {showTimeRange && properties.timeRange && properties.onTimeRangeChange && (
                <FormInputTimeRange
                    id={`time-range-${instanceId}`}
                    defaultValue={properties.timeRange}
                    onChange={function (value) {
                        return value && properties.onTimeRangeChange && properties.onTimeRangeChange(value);
                    }}
                    showTimeRangePresets={true}
                />
            )}

            {/* Time Interval */}
            <div className="flex flex-wrap items-center gap-2">
                {showInterval && properties.timeInterval && properties.onTimeIntervalChange && (
                    <TimeIntervalFormInputSelect
                        value={properties.timeInterval}
                        onChange={properties.onTimeIntervalChange}
                        availableIntervals={properties.availableTimeIntervals}
                    />
                )}

                {/* Chart Type */}
                {showChartType && properties.chartType && properties.onChartTypeChange && (
                    <ChartTypeFormInputSelect
                        value={properties.chartType}
                        onChange={properties.onChartTypeChange}
                        availableTypes={properties.availableChartTypes}
                    />
                )}

                {/* Sort Order */}
                {showSortOrder && properties.sortOrder && properties.onSortOrderChange && (
                    <SortOrderToggle value={properties.sortOrder} onChange={properties.onSortOrderChange} />
                )}
            </div>

            {properties.children}
        </div>
    );
}
