// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationLinkProperties } from './OpsNavigationLink';
import OpsNavigationLinks from '@structure/source/ops/layouts/navigation/OpsNavigationLinks';
import { DialogMenuProperties, DialogMenu } from '@structure/source/common/dialogs/DialogMenu';
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';

// Dependencies - Assets

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - OpsDialogMenu
export interface OpsDialogMenuProperties extends Omit<DialogMenuProperties, 'menuItems'> {}
export function OpsDialogMenu(properties: OpsDialogMenuProperties) {
    // Function to get the menu items from the internal navigation links
    function getMenuItemsFromOpsNavigationLinks(
        internalNavigationLink: OpsNavigationLinkProperties[],
        prefix?: string,
        icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    ) {
        // A variable to store the menu items
        let menuItems: MenuItemProperties[] = [];

        // Set the prefix string
        const prefixString = prefix ? prefix : '';

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
                menuItems = menuItems.concat(getMenuItemsFromOpsNavigationLinks(link.links, link.title + ' • ', icon));
            }
        });

        return menuItems;
    }

    // Get the menu items from the internal navigation links
    const menuItems = getMenuItemsFromOpsNavigationLinks(OpsNavigationLinks);

    // Render the component
    return <DialogMenu {...properties} items={menuItems} search={true} />;
}

// Export - Default
export default OpsDialogMenu;
