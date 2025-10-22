// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { useNotice } from '@structure/source/components/notifications/NoticeProvider';

// Component - TableCellContentOption
export interface TableCellContentOptionProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
    possibleValues?: string[];
}
export function TableCellContentOption(properties: TableCellContentOptionProperties) {
    // Hooks
    // const { addNotice } = useNotice();

    // Render the component
    return (
        <div className="inline-flex rounded-md border border--0 px-2.5 py-1 text-xs font-medium">
            {properties.value}
        </div>
    );
}
