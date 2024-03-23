// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/common/notifications/Tip';

// Dependencies - Utilities
import { getTimeAgoString } from '@structure/source/utilities/Time';

// Component - TableCellContentDateTime
export interface TableCellContentDateTimeInterface extends React.HTMLAttributes<HTMLElement> {
    value: string | null;
}
export function TableCellContentDateTime(properties: TableCellContentDateTimeInterface) {
    const date = properties.value ? new Date(properties.value) : null;

    // Render the component
    return date !== null ? (
        <Tip
            className="p-1.5"
            content={
                <div className="flex flex-col space-y-1 text-xs">
                    <div>{properties.value}</div>
                    <div>
                        {date.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            timeZoneName: 'longGeneric',
                        })}
                    </div>
                    {/* 5 minutes ago */}
                    <div>{getTimeAgoString(date.getTime())}</div>
                </div>
            }
        >
            <span>{date.toISOString().split('T')[0]}</span>
        </Tip>
    ) : (
        properties.value
    );
}

// Export - Default
export default TableCellContentDateTime;
