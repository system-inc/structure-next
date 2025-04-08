// Dependencies - React and Next.js
import React from 'react';

// Component - Container
export interface ContainerInterface {
    height?: string;
    justify?: string;
    border?: string;
    children: React.ReactNode;
}
export function Container(properties: ContainerInterface) {
    const {
        justify = 'between',
        border = 'b',
        children,
    } = properties;

    return (
        <div className={`flex items-center justify-${justify} shrink-0 px-4 h-[56px] border-${border} border-light-3 dark:border-dark-3`}>
            {children}
        </div>
    );
}