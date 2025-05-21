// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';

// Component - TableCellContentUrl
export interface TableCellContentUrlProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
    openUrlInNewTab?: boolean;
}
export function TableCellContentUrl(properties: TableCellContentUrlProperties) {
    // Render the component
    return (
        <Link
            href={properties.value}
            className="ml-1 hover:underline"
            target={properties.openUrlInNewTab ? '_blank' : undefined}
            prefetch={false}
        >
            {properties.value}
        </Link>
    );
}
