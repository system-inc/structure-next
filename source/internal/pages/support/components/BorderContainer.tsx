// Dependencies - React and Next.js
import React from 'react';

// Component - Container
export interface BorderContainerInterface {
    border?: 'top' | 'bottom';
    children: React.ReactNode;
}
export function BorderContainer(properties: BorderContainerInterface) {
    const borderVariants = {
        top: 'border-t',
        bottom: 'border-b',
    };

    const {
        border = 'bottom',
        children,
    } = properties;

    return (
        <div className={`flex items-center justify-between px-4 h-14 ${borderVariants[border]} border-light-3 dark:border-dark-3`}>
            {children}
        </div>
    );
}