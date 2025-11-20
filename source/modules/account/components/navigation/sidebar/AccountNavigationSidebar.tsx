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
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - AccountNavigationSidebar
export interface AccountNavigationSidebarProperties extends Omit<React.HTMLProps<HTMLElement>, 'ref'> {
    navigationLinks: AccountNavigationLinkInterface[];
    shouldShowNavigationLink: AccountNavigationFilterFunction;
}
export function AccountNavigationSidebar(properties: AccountNavigationSidebarProperties) {
    // Hooks
    const urlPath = useUrlPath() ?? '';
    const account = useAccount();

    // Destructure to separate navigationLinks and filter from HTML props
    const { navigationLinks, shouldShowNavigationLink, ...htmlProperties } = properties;

    // Render the component
    return (
        <nav
            {...htmlProperties}
            className={mergeClassNames('hidden min-w-52 shrink-0 flex-col gap-1 md:flex', properties.className)}
        >
            {/* AccountNavigation Links */}
            {navigationLinks
                .filter(function (link) {
                    return shouldShowNavigationLink(
                        link,
                        'Account',
                        urlPath,
                        account.data?.isAdministrator() ?? false,
                        account.signedIn,
                    );
                })
                .map(function (accountNavigationLink, accountNavigationLinkIndex) {
                    const isActiveRoute = urlPath.includes(accountNavigationLink.href);
                    return (
                        <Link
                            key={accountNavigationLinkIndex}
                            href={accountNavigationLink.href}
                            className={mergeClassNames(
                                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-opacity',
                                'hover:background--2 active:background--4!',
                                isActiveRoute && 'background--3!',
                            )}
                        >
                            {accountNavigationLink.icon && <accountNavigationLink.icon className="mr-2.5 size-4" />}{' '}
                            <span className="">{accountNavigationLink.title}</span>
                        </Link>
                    );
                })}
        </nav>
    );
}
