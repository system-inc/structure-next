// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationLinkProperties } from './OpsNavigationLink';
import { OpsNavigationLinks } from '@structure/source/ops/layout/navigation/OpsNavigationLinks';
import { DialogMenuProperties, DialogMenu } from '@structure/source/components/dialogs/DialogMenu';
import { MenuItemInterface } from '@structure/source/components/menus/Menu';

// Dependencies - Assets

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - OpsDialogMenu
export type OpsDialogMenuProperties = Omit<DialogMenuProperties, 'menuItems'>;
export function OpsDialogMenu(properties: OpsDialogMenuProperties) {
    // Function to get the menu items from the internal navigation links
    function getMenuItemsFromOpsNavigationLinks(
        internalNavigationLink: OpsNavigationLinkProperties[],
        prefix?: string,
        IconComponent?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    ) {
        // A variable to store the menu items
        let menuItems: MenuItemInterface[] = [];

        // Set the prefix string
        const prefixString = prefix ? prefix : '';

        // Loop through the internal navigation links
        internalNavigationLink.forEach(function (link) {
            // Use the icon from the link if it exists
            if(link.icon) {
                IconComponent = link.icon;
            }

            // Add the menu item
            menuItems.push({
                value: prefixString + link.title,
                children: prefixString + link.title,
                href: link.href,
                iconLeft: IconComponent ? <IconComponent /> : undefined,
            });

            // Add the menu items from the links recursively
            if(link.links) {
                menuItems = menuItems.concat(
                    getMenuItemsFromOpsNavigationLinks(link.links, link.title + ' • ', IconComponent),
                );
            }
        });

        return menuItems;
    }

    // Get the menu items from the internal navigation links
    const menuItems = getMenuItemsFromOpsNavigationLinks(OpsNavigationLinks);

    // Render the component
    return <DialogMenu {...properties} items={menuItems} search={true} />;
}
