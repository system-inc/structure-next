// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipInterface, Tip } from '@structure/source/common/popovers/Tip';
import { NoticeInterface } from '@structure/source/common/notifications/Notice';
import { CopyButton } from '@structure/source/common/buttons/CopyButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - CopyTip
export interface CopyTipInterface extends Omit<TipInterface, 'content'> {
    value: string;
    notice?: Omit<NoticeInterface, 'id'>;
}
export function CopyTip(properties: CopyTipInterface) {
    const { children, notice, value, className, ...tipProperties } = properties;

    // Render the component
    return (
        <Tip
            content={
                <div className="flex text-xs transition-all">
                    <div className="border-r">
                        <CopyButton value={value} notice={notice} className={mergeClassNames('p-1.5', className)} />
                    </div>
                    <div className="whitespace-nowrap p-1.5">{value}</div>
                </div>
            }
            align="start"
            {...tipProperties}
        >
            <span>{children}</span>
        </Tip>
    );
}

// Export - Default
export default CopyTip;
