// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemProperties, MenuItem } from '@structure/source/common/menus/MenuItem';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - MenuItemMemoized
// Wraps MenuItem with stable callbacks to prevent re-renders when only highlight changes
export interface MenuItemMemoizedProperties {
    item: MenuItemProperties;
    itemIndex: number;
    highlighted: boolean;
    itemDomElementReferences: React.MutableRefObject<(HTMLButtonElement | null)[]>;
    onClickIntercept: (
        item: MenuItemProperties,
        index: number,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    onMouseMoveIntercept: (
        item: MenuItemProperties,
        index: number,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void;
}
export const MenuItemMemoized = React.memo(
    function (properties: MenuItemMemoizedProperties) {
        return (
            <MenuItem
                {...properties.item}
                ref={function (element) {
                    properties.itemDomElementReferences.current[properties.itemIndex] = element;
                }}
                tabIndex={-1}
                className={mergeClassNames('w-full', properties.item.className)}
                onClick={function (event: React.MouseEvent<HTMLElement, MouseEvent>) {
                    properties.onClickIntercept(properties.item, properties.itemIndex, event);
                }}
                onMouseMove={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
                    properties.onMouseMoveIntercept(properties.item, properties.itemIndex, event);
                }}
                highlighted={properties.highlighted}
            />
        );
    },
    // Custom comparison: only re-render if highlighted actually changed for this specific item
    function (previousProperties, nextProperties) {
        return (
            previousProperties.item === nextProperties.item &&
            previousProperties.highlighted === nextProperties.highlighted &&
            previousProperties.onClickIntercept === nextProperties.onClickIntercept &&
            previousProperties.onMouseMoveIntercept === nextProperties.onMouseMoveIntercept
        );
    },
);

// Set displayName for debugging purposes
MenuItemMemoized.displayName = 'MenuItemMemoized';
