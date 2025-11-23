'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Types
import {
    AccountNavigationLinkInterface,
    AccountNavigationFilterFunction,
} from '@structure/source/modules/account/components/navigation/types/AccountNavigationTypes';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { MenuItemInterface } from '@structure/source/components/menus/Menu';

// Dependencies - Assets
import { CaretDownIcon } from '@phosphor-icons/react';

// Component - AccountNavigationPopoverMenu
export interface AccountNavigationPopoverMenuProperties {
    navigationLinks: AccountNavigationLinkInterface[];
    shouldShowNavigationLink: AccountNavigationFilterFunction;
}
export function AccountNavigationPopoverMenu(properties: AccountNavigationPopoverMenuProperties) {
    // Hooks
    const urlPath = useUrlPath();
    const account = useAccount();

    // Find current page from navigation links
    const currentPage = properties.navigationLinks.find(function (link) {
        return urlPath?.includes(link.href);
    });

    // Transform accountNavigationLinks into menu items
    const menuItems: MenuItemInterface[] = properties.navigationLinks
        .filter(function (link) {
            // Don't show Sign Out in the popover menu
            if(link.href === '/sign-out') {
                return false;
            }

            return properties.shouldShowNavigationLink(
                link,
                'Account',
                urlPath,
                account.data?.isAdministrator() ?? false,
                account.signedIn,
            );
        })
        .map(function (link) {
            const isActive = urlPath?.includes(link.href);
            return {
                className: 'rounded-3xl pl-4! pr-4 pt-2.5 pb-2.5 cursor-pointer',
                children: link.title,
                href: link.href,
                iconLeft: link.icon,
                selected: isActive,
                value: link.title,
            };
        });

    // Render the component
    return (
        <PopoverMenu
            trigger={
                <Button variant="Outline" className="w-full justify-between rounded-3xl" iconRight={CaretDownIcon}>
                    {currentPage?.title || 'Account Menu'}
                </Button>
            }
            items={menuItems}
            closeOnItemSelected={true}
            className="rounded-3xl p-0"
            itemsClassName="p-1"
            popoverProperties={{
                side: 'Bottom',
                align: 'Start',
                contentClassName: 'w-full rounded-3xl',
            }}
        />
    );
}
