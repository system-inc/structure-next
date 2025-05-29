'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Class Names - Menu Item
export const menuItemClassName = '';

// Component - MenuItem
export interface MenuItemProperties extends Omit<ButtonProperties, 'content'> {
    value?: string; // Used for search and typeahead
    content?: React.ReactNode;
    highlighted?: boolean;
    selected?: boolean;
    onSelected?: (menuItem: MenuItemProperties, menuItemRenderIndex: number, event: React.SyntheticEvent) => void;
    closeMenuOnSelected?: boolean; // Used anytime the Menu is closable (e.g., in a popover or context menu)
}
export const MenuItem = React.memo(
    React.forwardRef<HTMLButtonElement, MenuItemProperties>(function (
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            value,
            content,
            highlighted,
            selected,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onSelected,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            closeMenuOnSelected,
            className,
            disabled,
            onClick,
            ...buttonProperties
        },
        reference,
    ) {
        // Render the component
        return (
            <Button
                {...buttonProperties} // Spread remaining Button properties
                ref={reference}
                tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                variant="menuItem"
                size="menuItem"
                className={mergeClassNames(menuItemClassName, className)}
                data-highlighted={disabled ? undefined : highlighted ? 'true' : undefined}
                data-selected={selected ? 'true' : undefined}
                // onSelect <- use this in place of onClick if you want to do something when the menu item is selected
                onClick={onClick} // Passed in by the Menu component, do not use this directly, use onSelect instead
                type="button"
            >
                {content}
            </Button>
        );
    }),
);

// Set displayName for debugging purposes
MenuItem.displayName = 'MenuItem';
