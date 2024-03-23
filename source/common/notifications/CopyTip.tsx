// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeInterface } from '@structure/source/common/interactions/notice/Notice';
import { useNotice } from '@structure/source/common/interactions/notice/NoticeProvider';
import { TipInterface, Tip } from '@structure/source/common/notifications/Tip';

// Dependencies - Assets
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Component - CopyTip
export interface CopyTipInterface extends Omit<TipInterface, 'content'> {
    value: string;
    notice?: Omit<NoticeInterface, 'id'>;
}
export function CopyTip(properties: CopyTipInterface) {
    // Hooks
    const { addNotice } = useNotice();

    // State
    const [valueCopiedToClipboard, setValueCopiedToClipboard] = React.useState(false);

    // Function to copy the value to the clipboard
    const onCopyValueToClipboard = React.useCallback(
        function () {
            // Copy the value to the clipboard
            navigator.clipboard.writeText(properties.value);

            // Update the state
            setValueCopiedToClipboard(true);

            // Show a notice
            if(properties.notice) {
                addNotice(properties.notice);
            }

            // Reset the state after a delay
            setTimeout(function () {
                setValueCopiedToClipboard(false);
            }, 1000);
        },
        [properties.value, properties.notice, addNotice],
    );

    // Get the Tip specific properties
    const { children, notice, ...tipProperties } = properties;

    // Render the component
    return (
        <Tip
            content={
                <div className="flex text-xs transition-all">
                    <div className="border-r">
                        <button
                            className={`p-1.5 transition-colors ${
                                valueCopiedToClipboard
                                    ? 'text-emerald-500 hover:text-emerald-500'
                                    : 'text-neutral hover:text-dark dark:text-neutral+6 dark:hover:text-light'
                            }`}
                            onClick={onCopyValueToClipboard}
                        >
                            {valueCopiedToClipboard ? (
                                <CheckCircledIcon className="h-4 w-4" />
                            ) : (
                                <CopyIcon className="h-4 w-4 p-[1px]" />
                            )}
                        </button>
                    </div>
                    <div className="whitespace-nowrap p-1.5">{properties.value}</div>
                </div>
            }
            align="start"
            {...tipProperties}
        >
            <span>{properties.children}</span>
        </Tip>
    );
}

// Export - Default
export default CopyTip;
