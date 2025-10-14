// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipIcon } from '@structure/source/components/popovers/TipIcon';

// Dependencies - Assets
import WebIcon from '@structure/assets/icons/content/WebIcon.svg';

// Component - TableCellContentHtml
export interface TableCellContentHtmlProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
}
export function TableCellContentHtml(properties: TableCellContentHtmlProperties) {
    // Render the component
    return (
        <div className="flex items-center">
            <TipIcon
                icon={WebIcon}
                iconClassName="h-4 w-4"
                openOnPress={true}
                contentVariant="unstyled"
                content={
                    <div className="relative h-96 w-96">
                        {/* IFRAME */}
                        <iframe
                            className="absolute inset-0 h-full w-full bg-light"
                            srcDoc={properties.value}
                            sandbox="" // Full restrictions
                        />
                    </div>
                }
                align="start"
                side="left"
            />
            <div className="ml-1">{properties.value}</div>
        </div>
    );
}
