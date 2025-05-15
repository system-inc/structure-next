'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname as useUrlPath } from 'next/navigation';

// Dependencies - Main Components
import OpsNavigationLinks from '@structure/source/ops/layouts/navigation/OpsNavigationLinks';
import {
    OpsNavigationLinkInterface,
    OpsNavigationLink,
} from '@structure/source/ops/layouts/navigation/OpsNavigationLink';
import { OpsNavigationLinkGroup } from '@structure/source/ops/layouts/navigation/OpsNavigationLinkGroup';

// Component - OpsNavigation
export function OpsNavigation() {
    // Get the current pathname from the URL using the usePathname hook
    const urlPath = useUrlPath() ?? '';

    // Memoize the internal navigation links based on the current URL
    const memoizedOpsNavigationLinks = React.useMemo(
        function () {
            function setActiveFlag(opsNavigationLink: OpsNavigationLinkInterface): OpsNavigationLinkInterface {
                // Check if the link is active, and handle a special case for the root link
                if(opsNavigationLink.title === 'Home') {
                    opsNavigationLink.active = urlPath === '/ops';
                }
                // Links besides the root link
                else if(opsNavigationLink.title !== 'Home') {
                    opsNavigationLink.active =
                        opsNavigationLink.href === urlPath || urlPath.includes(opsNavigationLink.href + '/');
                }

                // If the link is a group, recursively set the active flag on the links
                if(opsNavigationLink.links) {
                    opsNavigationLink.links = opsNavigationLink.links.map(setActiveFlag);
                }

                return opsNavigationLink;
            }

            return OpsNavigationLinks.map(setActiveFlag);
        },
        [urlPath],
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

// Export - Default
export default OpsNavigation;
