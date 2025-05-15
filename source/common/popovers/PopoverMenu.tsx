'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverInterface, Popover } from '@structure/source/common/popovers/Popover';
import { MenuInterface, Menu } from '@structure/source/common/menus/Menu';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PopoverMenu
export interface PopoverMenuInterface extends Omit<MenuInterface, 'items'> {
    children: React.ReactElement; // Must be a ReactElement (e.g., div or span), not a ReactNode
    items: MenuItemInterface[];
    closeOnItemSelected?: boolean;
    popoverProperties?: Omit<PopoverInterface, 'children' | 'content'>;
}
export function PopoverMenu(properties: PopoverMenuInterface) {
    // State
    const [open, setOpen] = React.useState<boolean>(properties.popoverProperties?.open ?? false);

    // Defaults
    const popoverPropertiesSide = properties.popoverProperties?.side ?? 'bottom';
    const popoverPropertiesAlign = properties.popoverProperties?.align ?? 'start';

    // Function to focus on the search input on open
    const propertiesSearch = properties.search;
    const onOpenAutoFocus = React.useCallback(
        function (event: Event) {
            // console.log('PopoverMenu opened', event);

            // Get the popover element
            const popoverElement = event.target as HTMLElement;

            // Get the input element
            if(propertiesSearch) {
                const inputElement = popoverElement.querySelector('input');

                // Focus on the input element after a short delay
                setTimeout(function () {
                    if(inputElement) {
                        inputElement.focus();
                    }
                }, 25);
            }

            // Get the selected menu item
            const selectedMenuItem = popoverElement.querySelector('[data-selected="true"]');
            // console.log('selectedItem', selectedItem);

            // Scroll the selected item into the center of the view
            // This setTimeout is needed to allow the popover to open and the menu to render
            setTimeout(function () {
                if(selectedMenuItem) {
                    selectedMenuItem.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
                }
            }, 1);
        },
        [propertiesSearch],
    );

    // Function to handle when a menu item is selected
    const propertiesOnItemSelected = properties.onItemSelected;
    const propertiesCloseOnItemSelected = properties.closeOnItemSelected;
    const onItemSelectedIntercept = React.useCallback(
        function (menuItem: MenuItemInterface, menuItemRenderIndex?: number, event?: React.SyntheticEvent) {
            // Call the onSelected callback
            if(propertiesOnItemSelected) {
                propertiesOnItemSelected(
                    menuItem,
                    menuItemRenderIndex,
                    event as unknown as React.MouseEvent<HTMLElement, MouseEvent>,
                );
            }

            // Close the popover if closePopoverOnSelect is true
            if(propertiesCloseOnItemSelected || menuItem.closeMenuOnSelected) {
                setOpen(false);
            }
        },
        [propertiesOnItemSelected, propertiesCloseOnItemSelected],
    );

    // Get the menu properties to spread onto the Menu component
    const { className, ...menuProperties } = properties;

    // Get the popover properties to spread onto the Popover component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { side, align, ...popoverProperties } = properties.popoverProperties ?? {};

    // Render the component
    return (
        <Popover
            {...popoverProperties}
            open={open}
            onOpenChange={setOpen}
            content={
                <Menu
                    {...menuProperties}
                    className={mergeClassNames('max-h-screen', className)}
                    style={{
                        // Set the max height of the menu to the available height of the popover
                        maxHeight: 'var(--radix-popover-content-available-height)',
                    }}
                    onItemSelected={onItemSelectedIntercept}
                />
            }
            side={popoverPropertiesSide}
            align={popoverPropertiesAlign}
            onOpenAutoFocus={onOpenAutoFocus}
            className={mergeClassNames('border-none', popoverProperties.className)}
        >
            {properties.children}
        </Popover>
    );
}

// Export - Default
export default PopoverMenu;
