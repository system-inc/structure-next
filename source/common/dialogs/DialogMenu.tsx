'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { MenuProperties, Menu } from '@structure/source/common/menus/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - CommandDialog
export interface DialogMenuProperties extends MenuProperties {
    keyboardShortcutKey?: string;
    dialogProperties?: DialogProperties;
}
export function DialogMenu(properties: DialogMenuProperties) {
    // State
    const [open, setOpen] = React.useState(false);

    // Defaults
    const keyboardShortcutKey = properties.keyboardShortcutKey ?? 'k';

    // On mount
    React.useEffect(
        function () {
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
        },
        [keyboardShortcutKey],
    );

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

    const menu = (
        <Menu
            {...properties}
            className={mergeClassNames('max-h-[30vh]', properties.className)}
            onItemSelected={function () {
                setOpen(false);
            }}
        />
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
