'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import NavigationTrailSeparatorPopoverMenu from '@structure/source/common/navigation/trail/NavigationTrailSeparatorPopoverMenu';

// Dependencies - Utilities
import { slug, titleCase } from '@structure/source/utilities/String';
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
export interface NavigationTrailProperties {
    className?: string;
    urlPath?: string; // Optional, will take preference over the current URL path
    links?: NavigationTrailLinkInterface[];
    separator?: React.ReactNode;
}
export function NavigationTrail(properties: NavigationTrailProperties) {
    // Hooks
    const currentUrlPath = useUrlPath() ?? '';

    // Defaults
    const urlPath = properties.urlPath || currentUrlPath;
    const separator = properties.separator || <ChevronRightIcon className="h-4 w-4" />;

    // Function to generate links from pathname
    const generateNavigationTrailLinksFromPathname = React.useCallback(
        function (): NavigationTrailLinkInterface[] {
            const urlPathSegments = urlPath.replaceAll('-', ' ').split('/').filter(Boolean);
            let urlPathAccumulator = '';

            const result = urlPathSegments.map(function (segment) {
                urlPathAccumulator += `/${slug(segment)}`;

                return {
                    title: titleCase(segment),
                    href: urlPathAccumulator,
                };
            });

            // console.log('result', result);

            return result;
        },
        [urlPath],
    );

    // Function to get links list
    const getLinks = React.useCallback(function (links: NavigationTrailLinkInterface[]) {
        return links.map(function (currentLink: NavigationTrailLinkInterface) {
            return {
                title: currentLink.title,
                href: currentLink.href,
            };
        });
    }, []);

    // Get the navigation trail links from the properties or generate them from the pathname
    const navigationTrailLinks = properties.links || generateNavigationTrailLinksFromPathname();

    // Render the component
    return (
        <ol aria-label="Navigation Trail" className={mergeClassNames('flex list-none text-sm', properties.className)}>
            {navigationTrailLinks.map(function (navigationTrailLink, index) {
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
                                className={`hover:text-dark dark:hover:text-light ${
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
