// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InternalNavigationLinkInterface } from './InternalNavigationLink';
import InternalNavigationLinks from '@structure/source/internal/common/navigation/InternalNavigationLinks';
import { DialogMenuInterface, DialogMenu } from '@structure/source/common/dialogs/DialogMenu';
import { MenuInterface, Menu } from '@structure/source/common/menus/Menu';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';

// Dependencies - Assets

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - InternalCommandDialog
export interface InternalDialogMenuInterface extends Omit<DialogMenuInterface, 'menuItems'> {}
export function InternalDialogMenu(properties: InternalDialogMenuInterface) {
    // Function to get the menu items from the internal navigation links
    function getMenuItemsFromInternalNavigationLinks(
        internalNavigationLink: InternalNavigationLinkInterface[],
        prefix?: string,
        icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    ) {
        // A variable to store the menu items
        let menuItems: MenuItemInterface[] = [];

        // Set the prefix string
        let prefixString = prefix ? prefix : '';

        // Loop through the internal navigation links
        internalNavigationLink.forEach((link) => {
            // Use the icon from the link if it exists
            if(link.icon) {
                icon = link.icon;
            }

            // Add the menu item
            menuItems.push({
                content: prefixString + link.title,
                value: prefixString + link.title,
                href: link.href,
                icon: icon,
                iconPosition: 'left',
            });

            // Add the menu items from the links recursively
            if(link.links) {
                menuItems = menuItems.concat(
                    getMenuItemsFromInternalNavigationLinks(link.links, link.title + ' • ', icon),
                );
            }
        });

        return menuItems;
    }

    // Get the menu items from the internal navigation links
    const menuItems = getMenuItemsFromInternalNavigationLinks(InternalNavigationLinks);

    // Render the component
    return <DialogMenu {...properties} items={menuItems} search={true} />;
}

// Export - Default
export default InternalDialogMenu;
