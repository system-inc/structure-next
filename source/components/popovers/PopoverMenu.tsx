'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverProperties, Popover } from '@structure/source/components/popovers/Popover';
import { MenuProperties, Menu, MenuItemInterface } from '@structure/source/components/menus/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PopoverMenu
export interface PopoverMenuProperties extends Omit<MenuProperties, 'items'> {
    trigger: PopoverProperties['trigger'];
    items: MenuItemInterface[];
    closeOnItemSelected?: boolean;
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'content'>;
}
export function PopoverMenu({
    search,
    onItemSelected,
    closeOnItemSelected,
    popoverProperties,
    className,
    trigger,
    ...menuProperties
}: PopoverMenuProperties) {
    // State
    const [open, setOpen] = React.useState<boolean>(popoverProperties?.open ?? false);

    // Defaults
    const popoverPropertiesSide = popoverProperties?.side ?? 'Bottom';
    const popoverPropertiesAlign = popoverProperties?.align ?? 'Start';

    // Function to focus on the search input on open
    function onOpenAutoFocus(event: Event) {
        // console.log('PopoverMenu opened', event);

        // Get the popover element
        const popoverElement = event.target as HTMLElement;

        // Get the input element
        if(search) {
            const inputElement = popoverElement.querySelector('input');

            // Focus on the input element after a short delay
            setTimeout(function () {
                inputElement?.focus();
            }, 25);
        }

        // Get the selected menu item
        const selectedMenuItem = popoverElement.querySelector('[data-selected="true"]');
        // console.log('selectedItem', selectedItem);

        // Scroll the selected item into the center of the view
        // This setTimeout is needed to allow the popover to open and the menu to render
        setTimeout(function () {
            selectedMenuItem?.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
        }, 1);
    }

    // Function to handle when a menu item is selected
    function onItemSelectedIntercept(
        menuItem: MenuItemInterface,
        menuItemRenderIndex?: number,
        event?: React.SyntheticEvent,
    ) {
        // Call the onSelected callback
        onItemSelected?.(menuItem, menuItemRenderIndex, event as unknown as React.MouseEvent<HTMLElement, MouseEvent>);

        // Close the popover if closePopoverOnSelect is true
        if(closeOnItemSelected || menuItem.closeMenuOnSelected) {
            setOpen(false);
            // Also call the parent's onOpenChange callback if provided (for controlled mode)
            popoverProperties?.onOpenChange?.(false);
        }
    }

    // Effect to synchronize local open state with property changes (for controlled mode)
    React.useEffect(
        function () {
            if(popoverProperties?.open !== undefined) {
                setOpen(popoverProperties.open);
            }
        },
        [popoverProperties?.open],
    );

    // Render the component
    return (
        <Popover
            {...popoverProperties}
            trigger={trigger}
            open={open}
            onOpenChange={setOpen}
            content={
                <Menu
                    {...menuProperties}
                    search={search}
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
            contentClassName={mergeClassNames('border-none', popoverProperties?.contentClassName)}
        />
    );
}
