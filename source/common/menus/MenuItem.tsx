'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { removeProperties } from '@structure/source/utilities/React';

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
    React.forwardRef<HTMLButtonElement, MenuItemProperties>(function (properties, reference) {
        // Separate the non-Button properties from the Button properties
        const buttonProperties = removeProperties(properties, [
            'value',
            'content',
            'highlighted',
            'selected',
            'onSelected',
            'closeMenuOnSelected',
        ]);

        // Render the component
        return (
            <Button
                {...buttonProperties} // Spread DOM properties
                ref={reference}
                tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                variant="menuItem"
                size="menuItem"
                className={mergeClassNames(menuItemClassName, properties.className)}
                data-highlighted={properties.disabled ? undefined : properties.highlighted ? 'true' : undefined}
                data-selected={properties.selected ? 'true' : undefined}
                // onSelect <- use this in place of onClick if you want to do something when the menu item is selected
                onClick={properties.onClick} // Passed in by the Menu component, do not use this directly, use onSelect instead
                type="button"
            >
                {properties.content}
            </Button>
        );
    }),
);

// Set displayName for debugging purposes
MenuItem.displayName = 'MenuItem';
