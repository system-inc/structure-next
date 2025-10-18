// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipProperties, Tip } from '@structure/source/components/popovers/Tip';
import { NoticeInterface } from '@structure/source/components/notifications/Notice';
import { CopyButton } from '@structure/source/components/buttons/CopyButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyTip
export interface CopyTipProperties extends Omit<TipProperties, 'content' | 'trigger'> {
    trigger: React.ReactElement; // The element that triggers the copy tip
    value: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
    copyButtonClassName?: string;
}
export function CopyTip({ trigger, noticeData, value, copyButtonClassName, ...tipProperties }: CopyTipProperties) {
    // Render the component
    return (
        <Tip
            trigger={trigger}
            content={
                <div className="flex text-xs transition-all">
                    <div className="flex items-center border-r border-opsis-border-primary">
                        <CopyButton
                            value={value}
                            noticeData={noticeData}
                            className={mergeClassNames('p-1.5', copyButtonClassName)}
                        />
                    </div>
                    <div className="p-1.5 whitespace-nowrap">{value}</div>
                </div>
            }
            align="start"
            {...tipProperties}
        />
    );
}
