// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CopyTip } from '@structure/source/common/notifications/CopyTip';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/Number';

// Component - TableCellContentNumber
export interface TableCellContentNumberInterface extends React.HTMLAttributes<HTMLElement> {
    value: string;
}
export function TableCellContentNumber(properties: TableCellContentNumberInterface) {
    // Render the component
    return (
        <CopyTip
            notice={{
                title: 'Number Copied',
                content: (
                    <span>
                        The number <i>{properties.value}</i> has been copied to your clipboard.
                    </span>
                ),
            }}
            value={properties.value}
        >
            <span>{addCommas(properties.value)}</span>
        </CopyTip>
    );
}

// Export - Default
export default TableCellContentNumber;
