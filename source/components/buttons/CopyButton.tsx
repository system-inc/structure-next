// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/components/notifications/Notice';
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyButton
export type CopyButtonProperties = Omit<NonLinkButtonProperties, 'onClick'> & {
    value: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
};
export function CopyButton({ value, noticeData, className, ...buttonProperties }: CopyButtonProperties) {
    // Hooks
    const notice = useNotice();

    // State
    const [valueCopiedToClipboard, setValueCopiedToClipboard] = React.useState(false);

    // Function to copy the value to the clipboard
    const onClick = function () {
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
    };

    // Render the component
    const IconComponent = valueCopiedToClipboard ? CheckCircledIcon : CopyIcon;

    return (
        <Button
            icon={IconComponent}
            {...buttonProperties}
            onClick={onClick}
            variant="GhostIcon"
            size="GhostIcon"
            className={mergeClassNames(
                valueCopiedToClipboard && 'bg-light-2 dark:bg-dark-4',
                !valueCopiedToClipboard && 'dark:text-neutral+6 text-neutral hover:text-dark dark:hover:text-light',
                valueCopiedToClipboard &&
                    'text-emerald-500 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-500',
                className,
            )}
        />
    );
}
