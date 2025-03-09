// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/common/notifications/Notice';
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { removeProperties } from '@structure/source/utilities/React';

// Component - CopyButton
export interface CopyButtonInterface extends ButtonInterface {
    className?: string;
    value: string;
    notice?: Omit<NoticeInterface, 'id'>;
}
export function CopyButton(properties: CopyButtonInterface) {
    // Hooks
    const { addNotice } = useNotice();

    // State
    const [valueCopiedToClipboard, setValueCopiedToClipboard] = React.useState(false);

    // Function to copy the value to the clipboard
    const propertiesValue = properties.value;
    const propertiesNotice = properties.notice;
    const onCopyValueToClipboard = React.useCallback(
        function () {
            // Copy the value to the clipboard
            navigator.clipboard.writeText(propertiesValue);

            // Update the state
            setValueCopiedToClipboard(true);

            // Show a notice
            if(propertiesNotice) {
                addNotice(propertiesNotice);
            }

            // Reset the state after a delay
            setTimeout(function () {
                setValueCopiedToClipboard(false);
            }, 1000);
        },
        [propertiesValue, propertiesNotice, addNotice],
    );

    // Separate the properties
    const buttonProperties = removeProperties(properties, ['className', 'value', 'notice']);

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
                properties.className,
                valueCopiedToClipboard
                    ? 'text-emerald-500 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-500'
                    : '',
            )}
        />
    );
}

// Export - Default
export default CopyButton;
