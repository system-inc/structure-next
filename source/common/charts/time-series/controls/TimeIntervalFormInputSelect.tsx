// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputSelect } from '@structure/source/common/forms/FormInputSelect';

// Dependencies - API
import { TimeInterval } from '@structure/source/api/graphql/GraphQlGeneratedCode';

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
        TimeInterval.Hour,
        TimeInterval.Day,
        TimeInterval.Month,
        TimeInterval.Quarter,
        TimeInterval.Year,
    ];

    // Create items for the select
    const items = availableIntervals.map(function (interval) {
        return {
            value: interval,
            content: interval.charAt(0).toUpperCase() + interval.slice(1).toLowerCase(),
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
