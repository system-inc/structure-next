// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';
import { MenuItemMemoized } from '@structure/source/common/menus/MenuItemMemoized';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - MenuItemsList
// This component is memoized to prevent re-rendering search and other elements when highlight changes
export interface MenuItemsListProperties {
    itemsToRender: MenuItemProperties[];
    itemsToRenderHighlightIndex: number;
    itemsClassName?: string;
    itemDomElementReferences: React.MutableRefObject<(HTMLButtonElement | null)[]>;
    itemOnClickIntercept: (
        item: MenuItemProperties,
        itemRenderIndex: number,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    itemOnMouseMoveIntercept: (
        item: MenuItemProperties,
        itemIndex: number,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void;
}
export const MenuItemsList = React.memo(function (properties: MenuItemsListProperties) {
    return (
        <div className={mergeClassNames('overflow-y-auto p-1', properties.itemsClassName)}>
            {properties.itemsToRender.map(function (itemToRender, itemToRenderIndex) {
                return (
                    <MenuItemMemoized
                        key={itemToRender.value ?? itemToRenderIndex}
                        item={itemToRender}
                        itemIndex={itemToRenderIndex}
                        highlighted={itemToRenderIndex === properties.itemsToRenderHighlightIndex}
                        itemDomElementReferences={properties.itemDomElementReferences}
                        onClickIntercept={properties.itemOnClickIntercept}
                        onMouseMoveIntercept={properties.itemOnMouseMoveIntercept}
                    />
                );
            })}
        </div>
    );
});

// Set displayName for debugging purposes
MenuItemsList.displayName = 'MenuItemsList';
