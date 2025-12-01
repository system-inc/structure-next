'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button, ButtonProperties } from '@structure/source/components/buttons/Button';

// Type - MenuItemHandle
export interface MenuItemHandle {
    focus: () => void;
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
    getBoundingClientRect: () => DOMRect | undefined;
}

// Component - MenuItem
export type MenuItemProperties = ButtonProperties & {
    highlighted?: boolean;
    selected?: boolean;
};
export const MenuItem = React.memo(
    React.forwardRef<MenuItemHandle, MenuItemProperties>(function MenuItem(
        { highlighted, selected, ...buttonProperties },
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

        // Determine the variant and size based on whether this is a selectable menu item
        // MenuItemSelectable has left padding for checkmark, MenuItem does not
        const isSelectable = selected !== undefined;
        const defaultVariant = isSelectable ? 'MenuItemSelectable' : 'MenuItem';
        const defaultSize = isSelectable ? 'MenuItemSelectable' : 'MenuItem';

        // Render the component
        return (
            <Button
                {...buttonProperties} // Spread remaining Button properties
                ref={buttonReference}
                tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                variant={buttonProperties.variant || defaultVariant}
                size={buttonProperties.size || defaultSize}
                data-highlighted={buttonProperties.disabled ? undefined : highlighted ? 'true' : undefined}
                data-selected={selected ? 'true' : undefined}
                // onSelect <- use this in place of onClick if you want to do something when the menu item is selected
                onClick={buttonProperties.onClick} // Passed in by the Menu component, do not use this directly, use onSelect instead
                type="button"
            >
                {buttonProperties.children}
            </Button>
        );
    }),
    function arePropertiesEqual(previousProperties, nextProperties) {
        // Only re-render if these specific props change
        // We ignore onClick and onMouseMove function references since they're recreated every render
        return (
            previousProperties.children === nextProperties.children &&
            previousProperties.highlighted === nextProperties.highlighted &&
            previousProperties.selected === nextProperties.selected &&
            previousProperties.disabled === nextProperties.disabled &&
            previousProperties.className === nextProperties.className
        );
    },
);
