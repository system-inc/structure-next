// Dependencies - React and Next.js
import React from 'react';

// Component - TableCellContentBoolean
export interface TableCellContentBooleanInterface extends React.HTMLAttributes<HTMLElement> {
    value: string;
}
export function TableCellContentBoolean(properties: TableCellContentBooleanInterface) {
    // Render the component
    return (
        <div className="inline-flex rounded-md border px-2.5 py-1 text-xs font-medium uppercase">
            {properties.value}
        </div>
    );
}

// Export - Default
export default TableCellContentBoolean;
