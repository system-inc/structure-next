// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItem, MenuItemHandle } from '@structure/source/components/menus/MenuItem';
import { MenuItemInterface } from '@structure/source/components/menus/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - MenuItemsList
export interface MenuItemsListProperties {
    itemsToRender: MenuItemInterface[];
    itemsToRenderHighlightIndex: number;
    itemsClassName?: string;
    getItemReference: (index: number) => (handle: MenuItemHandle | null) => void;
    itemOnClickIntercept: (
        item: MenuItemInterface,
        itemRenderIndex: number,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    itemOnMouseMoveIntercept: (
        item: MenuItemInterface,
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
                        // Handle keyboard activation (Enter/Space)
                        onClick={function (event: React.MouseEvent<HTMLElement, MouseEvent>) {
                            // Only handle onClick if it's not a mouse event (keyboard or programmatic)
                            // Mouse clicks will be handled by onMouseUp to support drag-to-select
                            if(event.nativeEvent.detail === 0) {
                                // detail === 0 means keyboard or programmatic click
                                properties.itemOnClickIntercept(itemToRender, itemToRenderIndex, event);
                            }
                        }}
                        // Allow users to click to drop on one item, and then move mouse and mouse up to select
                        onMouseUp={function (event: React.MouseEvent<HTMLElement, MouseEvent>) {
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
