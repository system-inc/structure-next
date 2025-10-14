// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemProperties, MenuItem, MenuItemHandle } from '@structure/source/common/menus/MenuItem';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - MenuItemsList
export interface MenuItemsListProperties {
    itemsToRender: MenuItemProperties[];
    itemsToRenderHighlightIndex: number;
    itemsClassName?: string;
    getItemReference: (index: number) => (handle: MenuItemHandle | null) => void;
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
export function MenuItemsList(properties: MenuItemsListProperties) {
    return (
        <div className={mergeClassNames('overflow-y-auto p-1', properties.itemsClassName)}>
            {properties.itemsToRender.map(function (itemToRender, itemToRenderIndex) {
                return (
                    <MenuItem
                        key={itemToRender.value ?? itemToRenderIndex}
                        {...itemToRender}
                        ref={properties.getItemReference(itemToRenderIndex)}
                        tabIndex={-1}
                        className={mergeClassNames('w-full', itemToRender.className)}
                        onClick={function (event: React.MouseEvent<HTMLElement, MouseEvent>) {
                            properties.itemOnClickIntercept(itemToRender, itemToRenderIndex, event);
                        }}
                        onMouseMove={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
                            properties.itemOnMouseMoveIntercept(itemToRender, itemToRenderIndex, event);
                        }}
                        highlighted={itemToRenderIndex === properties.itemsToRenderHighlightIndex}
                    />
                );
            })}
        </div>
    );
}
