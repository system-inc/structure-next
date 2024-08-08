'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname as useUrlPath } from 'next/navigation';

// Dependencies - Main Components
import InternalNavigationLinks from '@structure/source/internal/layouts/navigation/InternalNavigationLinks';
import {
    InternalNavigationLinkInterface,
    InternalNavigationLink,
} from '@structure/source/internal/layouts/navigation/InternalNavigationLink';
import { InternalNavigationLinkGroup } from '@structure/source/internal/layouts/navigation/InternalNavigationLinkGroup';

// Component - InternalNavigation
export function InternalNavigation() {
    // Get the current pathname from the URL using the usePathname hook
    const urlPath = useUrlPath();

    // Memoize the internal navigation links based on the current URL
    const memoizedInternalNavigationLinks = React.useMemo(
        function () {
            function setActiveFlag(
                internalNavigationLink: InternalNavigationLinkInterface,
            ): InternalNavigationLinkInterface {
                // Check if the link is active, and handle a special case for the root link
                if(internalNavigationLink.title === 'Home') {
                    internalNavigationLink.active = urlPath === '/internal';
                }
                // Links besides the root link
                else if(internalNavigationLink.title !== 'Home') {
                    internalNavigationLink.active =
                        internalNavigationLink.href === urlPath || urlPath.includes(internalNavigationLink.href + '/');
                }

                // If the link is a group, recursively set the active flag on the links
                if(internalNavigationLink.links) {
                    internalNavigationLink.links = internalNavigationLink.links.map(setActiveFlag);
                }

                return internalNavigationLink;
            }

            return InternalNavigationLinks.map(setActiveFlag);
        },
        [urlPath],
    );

    // Memoize the navigation list
    const navigationList = React.useMemo(
        function () {
            return (
                <ul role="list" className="-mx-2 space-y-0.5">
                    {memoizedInternalNavigationLinks.map(function (internalNavigationLink) {
                        // Check if the item is a group
                        if(internalNavigationLink.links) {
                            // Return a collapsible group
                            return (
                                <InternalNavigationLinkGroup
                                    key={internalNavigationLink.title}
                                    title={internalNavigationLink.title}
                                    href={internalNavigationLink.href}
                                    icon={internalNavigationLink.icon}
                                    links={internalNavigationLink.links}
                                    active={internalNavigationLink.active}
                                />
                            );
                        }
                        else {
                            return (
                                <li key={internalNavigationLink.title}>
                                    <InternalNavigationLink
                                        title={internalNavigationLink.title}
                                        href={internalNavigationLink.href}
                                        icon={internalNavigationLink.icon}
                                        active={internalNavigationLink.active}
                                    />
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        },
        [memoizedInternalNavigationLinks],
    );

    // Render the component
    return <div className="flex flex-1 flex-col px-6 py-5">{navigationList}</div>;
}

// Export - Default
export default InternalNavigation;
