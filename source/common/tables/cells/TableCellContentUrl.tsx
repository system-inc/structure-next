// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Component - TableCellContentUrl
export interface TableCellContentUrlInterface extends React.HTMLAttributes<HTMLElement> {
    value: string;
    openUrlInNewTab?: boolean;
}
export function TableCellContentUrl(properties: TableCellContentUrlInterface) {
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

// Export - Default
export default TableCellContentUrl;
