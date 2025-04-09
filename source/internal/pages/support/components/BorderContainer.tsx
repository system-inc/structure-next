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
export function BorderContainer({
    border = 'top',
    children
}: BorderContainerInterface) {
    return (
        <div className={`flex items-center justify-between px-4 h-14 ${borderVariants[border]} border-light-3 dark:border-dark-3`}>
            {children}
        </div>
    );
}