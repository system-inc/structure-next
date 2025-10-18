// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipButton } from '@structure/source/components/buttons/TipButton';

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
            <TipButton
                icon={WebIcon}
                openOnPress={true}
                tipClassName="border-none"
                tip={
                    (
                        <div className="relative h-96 w-96">
                            {/* IFRAME */}
                            <iframe
                                className="absolute inset-0 h-full w-full bg-light"
                                srcDoc={properties.value}
                                sandbox="" // Full restrictions
                            />
                        </div>
                    ) as React.ReactNode
                }
                popoverProperties={{
                    align: 'start',
                    side: 'left',
                }}
            />
            <div className="ml-1">{properties.value}</div>
        </div>
    );
}
