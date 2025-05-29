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
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - CopyButton
export interface CopyButtonProperties extends ButtonProperties {
    className?: string;
    value: string;
    notice?: Omit<NoticeInterface, 'id'>;
}
export function CopyButton({ className, value, notice, ...buttonProperties }: CopyButtonProperties) {
    // Hooks
    const { addNotice } = useNotice();

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
            if(notice) {
                addNotice(notice);
            }

            // Reset the state after a delay
            setTimeout(function () {
                setValueCopiedToClipboard(false);
            }, 1000);
        },
        [value, notice, addNotice],
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
                !valueCopiedToClipboard ? 'text-neutral hover:text-dark dark:text-neutral+6 dark:hover:text-light' : '',
                className,
                valueCopiedToClipboard
                    ? 'text-emerald-500 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-500'
                    : '',
            )}
        />
    );
}
