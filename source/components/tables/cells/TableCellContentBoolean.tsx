// Dependencies - React and Next.js
import React from 'react';

// Component - TableCellContentBoolean
export interface TableCellContentBooleanProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
}
export function TableCellContentBoolean(properties: TableCellContentBooleanProperties) {
    // Render the component
    return (
        <div className="inline-flex rounded-md border border--a px-2.5 py-1 text-xs font-medium uppercase">
            {properties.value}
        </div>
    );
}
