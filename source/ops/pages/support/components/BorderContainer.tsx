// Dependencies - React and Next.js
import React from 'react';

// Variants
const borderVariants = {
    top: 'border-t',
    bottom: 'border-b',
};

// Component - Container
export interface BorderContainerInterface {
    border?: keyof typeof borderVariants;
    children: React.ReactNode;
}
export function BorderContainer(properties: BorderContainerInterface) {
    const border = properties.border !== undefined ? properties.border : 'bottom';

    return (
        <div
            className={`flex h-14 shrink-0 items-center justify-between px-4 ${borderVariants[border]} border-light-3 dark:border-dark-3`}
        >
            {properties.children}
        </div>
    );
}
