'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import NavigationTrailSeparatorPopoverMenu from '@structure/source/common/navigation/NavigationTrailSeparatorPopoverMenu';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Interface - NavigationTrailLink
export interface NavigationTrailLinkInterface {
    title: string;
    href: string;
    links?: NavigationTrailLinkInterface[];
}

// Component - NavigationTrail
export interface NavigationTrailInterface {
    className?: string;
    links?: NavigationTrailLinkInterface[];
    separator?: React.ReactNode;
}
export function NavigationTrail(properties: NavigationTrailInterface) {
    // Hooks
    const urlPathname = usePathname();

    // Defaults
    let separator = properties.separator || <ChevronRightIcon className="h-4 w-4" />;

    // Function to generate links from pathname
    const generateNavigationTrailLinksFromPathname = React.useCallback(
        function (): NavigationTrailLinkInterface[] {
            const urlPathSegments = urlPathname.split('/').filter(Boolean);
            let urlPathAccumulator = '';
            return urlPathSegments.map((segment, index) => {
                urlPathAccumulator += `/${segment}`;
                return {
                    title: titleCase(segment),
                    href: urlPathAccumulator,
                };
            });
        },
        [urlPathname],
    );

    // Function to get links list
    const getLinks = React.useCallback(function (links: NavigationTrailLinkInterface[]) {
        return links.map((currentLink: any, index: any) => ({
            title: currentLink.title,
            href: currentLink.href,
        }));
    }, []);

    // Get the navigation trail links from the properties or generate them from the pathname
    const navigationTrailLinks = properties.links || generateNavigationTrailLinksFromPathname();

    // Render the component
    return (
        <ol aria-label="Navigation Trail" className={mergeClassNames('flex list-none text-sm', properties.className)}>
            {navigationTrailLinks.map((navigationTrailLink, index) => {
                // Find the index of the last title in the navigationTrailLinks array
                let lastTitleIndex = navigationTrailLinks
                    .slice()
                    .reverse()
                    .findIndex((link) => link.title !== '');
                lastTitleIndex =
                    lastTitleIndex >= 0 ? navigationTrailLinks.length - 1 - lastTitleIndex : lastTitleIndex;

                return (
                    <li key={index} className="flex items-center">
                        {index > 0 ? (
                            navigationTrailLink.links && navigationTrailLink.links.length > 0 ? (
                                <NavigationTrailSeparatorPopoverMenu
                                    separator={separator}
                                    links={getLinks(navigationTrailLink.links)}
                                />
                            ) : (
                                <div className="mx-1 h-4 w-4">{separator}</div>
                            )
                        ) : null}
                        {/* Only render the link if it has a title */}
                        {navigationTrailLink.title != '' && (
                            <Link
                                tabIndex={1}
                                href={navigationTrailLink.href}
                                className={`transition-colors hover:text-dark dark:hover:text-light ${
                                    index === lastTitleIndex ? 'text-dark dark:text-light' : 'text-neutral '
                                }`}
                            >
                                {navigationTrailLink.title}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

// Export - Default
export default NavigationTrail;
