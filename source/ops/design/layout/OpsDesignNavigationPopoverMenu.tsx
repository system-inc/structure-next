'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';

// Dependencies - Assets
import { CaretDownIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Types
import { type OpsDesignNavigationLinkInterface } from './OpsDesignNavigationLinks';
import { type MenuItemProperties } from '@structure/source/components/menus/MenuItem';

// Component - OpsDesignNavigationPopoverMenu
export interface OpsDesignNavigationPopoverMenuProperties {
    navigationLinks: OpsDesignNavigationLinkInterface[];
    className?: string;
}

export function OpsDesignNavigationPopoverMenu(properties: OpsDesignNavigationPopoverMenuProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Build base path for design navigation
    const basePath = '/ops/design';

    // Find current page from navigation links
    const currentPage = properties.navigationLinks.find(function (link) {
        const fullPath = link.href === '' ? basePath : basePath + link.href;
        return urlPath === fullPath || urlPath === fullPath + '/';
    });

    // Transform navigation links into menu items
    const menuItems: MenuItemProperties[] = properties.navigationLinks.map(function (link) {
        const fullPath = link.href === '' ? basePath : basePath + link.href;
        const isActive = urlPath === fullPath || urlPath === fullPath + '/';

        return {
            className: 'rounded-3xl pl-4! pr-4 pt-2.5 pb-2.5 cursor-pointer',
            children: link.title,
            href: fullPath,
            iconLeft: link.icon,
            selected: isActive,
            value: link.title,
        };
    });

    // Render
    return (
        <PopoverMenu
            trigger={
                <Button
                    variant="Outline"
                    className="w-full justify-between rounded-3xl"
                    iconLeft={currentPage?.icon}
                    iconRight={CaretDownIcon}
                >
                    <span className="flex-1 text-left">{currentPage?.title || 'Design Menu'}</span>
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
