// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputSelect } from '@structure/source/components/forms/FormInputSelect';

// Types
export type ChartType = 'Bar' | 'Line' | 'Area';

// Component - ChartTypeFormInputSelect
export interface ChartTypeFormInputSelectProperties {
    value: ChartType;
    onChange: (value: ChartType) => void;
    className?: string;
    availableTypes?: ChartType[];
}
export function ChartTypeFormInputSelect(properties: ChartTypeFormInputSelectProperties) {
    // Generate unique ID for this instance
    const instanceId = React.useId();

    // Default available chart types
    const availableTypes = properties.availableTypes || ['Bar', 'Line', 'Area'];

    // Create items for the select
    const items = availableTypes.map(function (type) {
        return {
            value: type,
            content: type.charAt(0).toUpperCase() + type.slice(1),
        };
    });

    // Render the component
    return (
        <FormInputSelect
            className={properties.className}
            id={`chart-type-select-${instanceId}`}
            items={items}
            defaultValue={properties.value}
            onChange={function (value) {
                return value && properties.onChange(value as ChartType);
            }}
        />
    );
}
