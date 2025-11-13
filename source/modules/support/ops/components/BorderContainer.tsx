// Dependencies - React and Next.js
import React from 'react';

// Variants
const borderVariants = {
    top: 'border-t',
    bottom: 'border-b',
};

// Component - Container
export interface BorderContainerProperties {
    border?: keyof typeof borderVariants;
    children: React.ReactNode;
}
export function BorderContainer(properties: BorderContainerProperties) {
    // Determine the border variant
    const border = properties.border !== undefined ? properties.border : 'bottom';

    // Render the component
    return (
        <div
            className={`flex h-12 shrink-0 items-center justify-between pr-1.5 pl-3 ${borderVariants[border]} border--0`}
        >
            {properties.children}
        </div>
    );
}
