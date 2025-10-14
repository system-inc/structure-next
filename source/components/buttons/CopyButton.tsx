// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/common/notifications/Notice';
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyButton
export interface CopyButtonProperties extends ButtonProperties {
    className?: string;
    value: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
}
export function CopyButton({ className, value, noticeData, ...buttonProperties }: CopyButtonProperties) {
    // Hooks
    const notice = useNotice();

    // State
    const [valueCopiedToClipboard, setValueCopiedToClipboard] = React.useState(false);

    // Function to copy the value to the clipboard
    const onCopyValueToClipboard = React.useCallback(
        function () {
            // Copy the value to the clipboard
            navigator.clipboard.writeText(value);

            // Update the state
            setValueCopiedToClipboard(true);

            // Show a notice
            if(noticeData) {
                notice.addNotice(noticeData);
            }

            // Reset the state after a delay
            setTimeout(function () {
                setValueCopiedToClipboard(false);
            }, 1000);
        },
        [value, noticeData, notice],
    );

    // Render the component
    return (
        <Button
            variant="unstyled"
            size="unstyled"
            onClick={onCopyValueToClipboard}
            icon={valueCopiedToClipboard ? CheckCircledIcon : CopyIcon}
            iconClassName={valueCopiedToClipboard ? 'h-4 w-4' : 'h-4 w-4'}
            {...buttonProperties}
            className={mergeClassNames(
                'cursor-pointer',
                !valueCopiedToClipboard ? 'dark:text-neutral+6 text-neutral hover:text-dark dark:hover:text-light' : '',
                className,
                valueCopiedToClipboard
                    ? 'text-emerald-500 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-500'
                    : '',
            )}
        />
    );
}
