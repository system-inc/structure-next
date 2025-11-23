// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TipProperties, Tip } from '@structure/source/components/popovers/Tip';
import { NotificationInterface } from '@structure/source/components/notifications/Notification';
import { CopyButton } from '@structure/source/components/buttons/CopyButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyTip
export interface CopyTipProperties extends Omit<TipProperties, 'content' | 'trigger'> {
    trigger: React.ReactElement; // The element that triggers the copy tip
    value: string;
    notificationData?: Omit<NotificationInterface, 'id'>;
    copyButtonClassName?: string;
}
export function CopyTip({
    trigger,
    notificationData,
    value,
    copyButtonClassName,
    ...tipProperties
}: CopyTipProperties) {
    // Render the component
    return (
        <Tip
            trigger={trigger}
            content={
                <div className="flex text-xs transition-all">
                    <div className="flex items-center border-r border--0">
                        <CopyButton
                            value={value}
                            notificationData={notificationData}
                            className={mergeClassNames('p-1.5', copyButtonClassName)}
                        />
                    </div>
                    <div className="p-1.5 whitespace-nowrap">{value}</div>
                </div>
            }
            align="Start"
            {...tipProperties}
        />
    );
}
