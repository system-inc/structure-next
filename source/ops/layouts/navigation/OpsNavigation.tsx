'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { OpsNavigationLinks } from '@structure/source/ops/layouts/navigation/OpsNavigationLinks';
import {
    OpsNavigationLinkProperties,
    OpsNavigationLink,
} from '@structure/source/ops/layouts/navigation/OpsNavigationLink';
import { OpsNavigationLinkGroup } from '@structure/source/ops/layouts/navigation/OpsNavigationLinkGroup';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Component - OpsNavigation
export function OpsNavigation() {
    // Hooks
    const account = useAccount();
    const urlPath = useUrlPath() ?? '';

    // Memoize the internal navigation links based on the current URL and user roles
    const memoizedOpsNavigationLinks = React.useMemo(
        function () {
            // Helper function to check if user has access to a navigation link
            function hasAccess(opsNavigationLink: OpsNavigationLinkProperties): boolean {
                // If no account data, deny access
                if(!account.data) {
                    return false;
                }

                // Administrator has access to everything
                if(account.data.isAdministrator()) {
                    return true;
                }

                // If no roles specified, only Administrator can access (already checked above)
                if(!opsNavigationLink.accessibleRoles || opsNavigationLink.accessibleRoles.length === 0) {
                    return false;
                }

                // Check if user has any of the required roles
                return account.data.hasAnyRole(opsNavigationLink.accessibleRoles);
            }

            // Helper function to filter and set active flags on navigation links
            function filterAndSetActiveFlag(
                opsNavigationLink: OpsNavigationLinkProperties,
            ): OpsNavigationLinkProperties | null {
                // Check if user has access to this link
                if(!hasAccess(opsNavigationLink)) {
                    return null;
                }

                // Filter sub-links if they exist
                if(opsNavigationLink.links) {
                    const filteredSubLinks = opsNavigationLink.links
                        .map(filterAndSetActiveFlag)
                        .filter((link): link is OpsNavigationLinkProperties => link !== null);

                    // If all sub-links are filtered out, hide the parent link too
                    if(filteredSubLinks.length === 0) {
                        return null;
                    }

                    opsNavigationLink.links = filteredSubLinks;
                }

                if(opsNavigationLink.title === 'Home') {
                    opsNavigationLink.active = urlPath === '/ops';
                }
                // Links besides the root link
                else if(opsNavigationLink.title !== 'Home') {
                    opsNavigationLink.active =
                        opsNavigationLink.href === urlPath || urlPath.includes(opsNavigationLink.href + '/');
                }

                return opsNavigationLink;
            }

            // Filter links by role access and set active flags
            return OpsNavigationLinks.map(filterAndSetActiveFlag).filter(
                (link): link is OpsNavigationLinkProperties => link !== null,
            );
        },
        [urlPath, account.data],
    );

    // Memoize the navigation list
    const navigationList = React.useMemo(
        function () {
            return (
                <ul role="list" className="-mx-2 space-y-0.5">
                    {memoizedOpsNavigationLinks.map(function (opsNavigationLink) {
                        // Check if the item is a group
                        if(opsNavigationLink.links) {
                            // Return a collapsible group
                            return (
                                <OpsNavigationLinkGroup
                                    key={opsNavigationLink.title}
                                    title={opsNavigationLink.title}
                                    href={opsNavigationLink.href}
                                    icon={opsNavigationLink.icon}
                                    links={opsNavigationLink.links}
                                    active={opsNavigationLink.active}
                                />
                            );
                        }
                        else {
                            return (
                                <li key={opsNavigationLink.title}>
                                    <OpsNavigationLink
                                        title={opsNavigationLink.title}
                                        href={opsNavigationLink.href}
                                        icon={opsNavigationLink.icon}
                                        active={opsNavigationLink.active}
                                    />
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        },
        [memoizedOpsNavigationLinks],
    );

    // Render the component
    return <div className="flex flex-1 flex-col px-5 py-3">{navigationList}</div>;
}
