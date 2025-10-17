// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipProperties, Tip } from '@structure/source/components/popovers/Tip';
import { NoticeInterface } from '@structure/source/components/notifications/Notice';
import { CopyButton } from '@structure/source/components/buttons/CopyButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyTip
export interface CopyTipProperties extends Omit<TipProperties, 'content'> {
    value: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
}
export function CopyTip(properties: CopyTipProperties) {
    const { children, noticeData, value, className, ...tipProperties } = properties;

    // Render the component
    return (
        <Tip
            content={
                <div className="flex text-xs transition-all">
                    <div className="flex items-center border-r border-opsis-border-primary">
                        <CopyButton
                            value={value}
                            noticeData={noticeData}
                            className={mergeClassNames('p-1.5', className)}
                        />
                    </div>
                    <div className="p-1.5 whitespace-nowrap">{value}</div>
                </div>
            }
            align="start"
            {...tipProperties}
        >
            <span>{children}</span>
        </Tip>
    );
}
