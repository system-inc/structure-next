// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CopyTip } from '@structure/source/common/popovers/CopyTip';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/Number';

// Component - TableCellContentNumber
export interface TableCellContentNumberProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
}
export function TableCellContentNumber(properties: TableCellContentNumberProperties) {
    // Render the component
    return (
        <CopyTip
            noticeData={{
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
