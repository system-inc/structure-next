// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { ArrowUpIcon, ArrowDownIcon } from '@phosphor-icons/react';

// Types
export type SortOrderType = 'Ascending' | 'Descending';

// Component - SortOrderToggle
export interface SortOrderToggleProperties {
    value: SortOrderType;
    onChange: (value: SortOrderType) => void;
    className?: string;
}
export function SortOrderToggle(properties: SortOrderToggleProperties) {
    // Extract properties for dependencies
    const onChange = properties.onChange;
    const value = properties.value;

    // Handle toggle
    const handleToggle = React.useCallback(
        function () {
            onChange(value === 'Ascending' ? 'Descending' : 'Ascending');
        },
        [onChange, value],
    );

    // Render the component
    return (
        <Button
            variant="Ghost"
            onClick={handleToggle}
            className={properties.className}
            iconLeft={properties.value === 'Ascending' ? ArrowUpIcon : ArrowDownIcon}
        >
            {properties.value === 'Ascending' ? 'Ascending' : 'Descending'}
        </Button>
    );
}
