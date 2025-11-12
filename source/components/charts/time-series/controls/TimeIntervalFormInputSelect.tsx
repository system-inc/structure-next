// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputSelect } from '@structure/source/components/forms/FormInputSelect';

// Dependencies - Types
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/type/String';

// Component - TimeIntervalFormInputSelect
export interface TimeIntervalFormInputSelectProperties {
    value: TimeInterval;
    onChange: (value: TimeInterval) => void;
    className?: string;
    availableIntervals?: TimeInterval[];
}
export function TimeIntervalFormInputSelect(properties: TimeIntervalFormInputSelectProperties) {
    // Generate unique ID for this instance
    const instanceId = React.useId();

    // Default available intervals
    const availableIntervals = properties.availableIntervals || [
        TimeInterval.Minute,
        TimeInterval.Hour,
        TimeInterval.Day,
        TimeInterval.Week,
        TimeInterval.Month,
        TimeInterval.Quarter,
        TimeInterval.Year,
        TimeInterval.HourOfDay,
        TimeInterval.DayOfWeek,
        TimeInterval.DayOfMonth,
        TimeInterval.MonthOfYear,
        TimeInterval.WeekOfYear,
    ];

    // Create items for the select with formatted display text
    const items = availableIntervals.map(function (interval) {
        return {
            value: interval, // Keep enum value for internal use
            children: titleCase(interval), // Format for display (e.g., "Hour of Day")
        };
    });

    // Render the component
    return (
        <FormInputSelect
            className={properties.className}
            id={`time-interval-select-${instanceId}`}
            items={items}
            defaultValue={properties.value}
            onChange={function (value) {
                return value && properties.onChange(value as TimeInterval);
            }}
        />
    );
}
