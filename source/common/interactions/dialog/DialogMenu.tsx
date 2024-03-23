'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogInterface, Dialog } from '@structure/source/common/interactions/dialog/Dialog';
import { MenuInterface, Menu } from '@structure/source/common/interactions/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - CommandDialog
export interface DialogMenuInterface extends MenuInterface {
    keyboardShortcutKey?: string;
    dialogProperties?: DialogInterface;
}
export function DialogMenu(properties: DialogMenuInterface) {
    // State
    const [open, setOpen] = React.useState(false);

    // Defaults
    const keyboardShortcutKey = properties.keyboardShortcutKey ?? 'k';

    // On mount
    React.useEffect(() => {
        // Listen for the keyboard shortcut
        const down = (event: KeyboardEvent) => {
            // If the user presses CMD+key or CTRL+key, toggle the dialog
            if(event.key === keyboardShortcutKey && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((open) => !open);
            }
        };

        // Add the event listener to the document
        document.addEventListener('keydown', down);

        // Remove the event listener on unmount
        return () => document.removeEventListener('keydown', down);
    }, [keyboardShortcutKey]);

    // Function to focus on the search input on open
    const onOpenAutoFocus = React.useCallback(function (event: Event) {
        console.log('CommandDialog opened', event);

        // Get the dialog element
        const dialogElement = event.target as HTMLElement;

        // Get the input element
        const inputElement = dialogElement.querySelector('input');

        // Focus on the input element after a short delay
        setTimeout(() => {
            if(inputElement) {
                inputElement.focus();
            }
        }, 25);
    }, []);

    const menu = React.useMemo(
        function () {
            return (
                <Menu
                    {...properties}
                    className={mergeClassNames('max-h-[30vh]', properties.className)}
                    onItemSelected={function (item, itemIndex) {
                        setOpen(false);
                    }}
                />
            );
        },
        [properties],
    );

    // Render the component
    return (
        <Dialog
            variant="unstyledTopFixed"
            content={menu}
            open={open}
            onOpenChange={setOpen}
            onOpenAutoFocus={onOpenAutoFocus}
            closeControl={false}
            header={properties.dialogProperties?.header}
            className={mergeClassNames('', properties.dialogProperties?.className)}
        />
    );
}

// Export - Default
export default DialogMenu;
