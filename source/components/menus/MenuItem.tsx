'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/components/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Class Names - Menu Item
export const menuItemClassName = '';

// Type - MenuItemHandle
export interface MenuItemHandle {
    focus: () => void;
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
    getBoundingClientRect: () => DOMRect | undefined;
}

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
    React.forwardRef<MenuItemHandle, MenuItemProperties>(function MenuItem(
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
        // References
        const buttonReference = React.useRef<HTMLButtonElement | null>(null);

        // Expose imperative handle for programmatic focus and scrolling
        React.useImperativeHandle(
            reference,
            function () {
                return {
                    focus: function () {
                        buttonReference.current?.focus();
                    },
                    scrollIntoView: function (options?: ScrollIntoViewOptions) {
                        buttonReference.current?.scrollIntoView(options);
                    },
                    getBoundingClientRect: function () {
                        return buttonReference.current?.getBoundingClientRect();
                    },
                };
            },
            [],
        );

        // Render the component
        return (
            <Button
                {...buttonProperties} // Spread remaining Button properties
                ref={buttonReference}
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
    function arePropertiesEqual(previousProperties, nextProperties) {
        // Only re-render if these specific props change
        // We ignore onClick and onMouseMove function references since they're recreated every render
        return (
            previousProperties.content === nextProperties.content &&
            previousProperties.highlighted === nextProperties.highlighted &&
            previousProperties.selected === nextProperties.selected &&
            previousProperties.disabled === nextProperties.disabled &&
            previousProperties.className === nextProperties.className &&
            previousProperties.value === nextProperties.value
        );
    },
);
