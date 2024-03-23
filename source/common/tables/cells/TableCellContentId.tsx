// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { CopyTip } from '@structure/source/common/notifications/CopyTip';

// Dependencies - Utilities
import { truncateUniqueIdentifier } from '@structure/source/utilities/String';

// Component - TableCellContentId
export interface TableCellContentIdInterface extends React.HTMLAttributes<HTMLElement> {
    value: string;
    url?: string;
    openUrlInNewTab?: boolean;
}
export function TableCellContentId(properties: TableCellContentIdInterface) {
    const content = truncateUniqueIdentifier(properties.value);

    // Render the component
    return (
        <CopyTip
            notice={{
                title: 'ID Copied',
                content: (
                    <span>
                        The ID <i>{properties.value}</i> has been copied to your clipboard.
                    </span>
                ),
            }}
            value={properties.value}
        >
            {properties.url ? (
                // If there is a URL, render a Link
                <Link
                    href={properties.url}
                    className="hover:underline"
                    target={properties.openUrlInNewTab ? '_blank' : undefined}
                    prefetch={false}
                >
                    {content}
                </Link>
            ) : (
                // If there is no URL, just render the content
                <span>{content}</span>
            )}
        </CopyTip>
    );
}

// Export - Default
export default TableCellContentId;
