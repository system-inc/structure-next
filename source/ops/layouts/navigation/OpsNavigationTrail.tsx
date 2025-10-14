'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import {
    NavigationTrailLinkInterface,
    NavigationTrailProperties,
    NavigationTrail,
} from '@structure/source/components/navigation/trail/NavigationTrail';
import { OpsNavigationLinks } from '@structure/source/ops/layouts/navigation/OpsNavigationLinks';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { titleCase } from '@structure/source/utilities/type/String';

// Component - OpsNavigationTrail
export function OpsNavigationTrail(properties: NavigationTrailProperties) {
    // Get the current pathname from the URL using the usePathname hook
    const urlPath = useUrlPath() ?? '';

    // Function to get sibling navigation trail links for a given path
    const getSiblingNavigationTrailLinks = React.useCallback(function (
        path: string,
        links: NavigationTrailLinkInterface[],
    ): NavigationTrailLinkInterface[] {
        const siblingNavigationTrailLinks: NavigationTrailLinkInterface[] = [];

        // Loop over OpsNavigationLinks
        for(const internalNavigationLink of links) {
            // Check if the link matches the path
            if(internalNavigationLink.href !== path && internalNavigationLink.href.startsWith(path)) {
                siblingNavigationTrailLinks.push({
                    ...internalNavigationLink,
                });
            }
        }

        return siblingNavigationTrailLinks;
    }, []);

    // Function to generate links from pathname using the pathname and OpsNavigationLinks
    const generateNavigationTrailLinksUsingPathname = React.useCallback(
        function () {
            const urlPathSegments = urlPath.split('/').filter(Boolean);
            // console.log('generateNavigationTrailLinksUsingPathname', pathSegments);
            const navigationTrailLinks: NavigationTrailLinkInterface[] = [];
            let cumulativePath = '';

            // Loop over each path segment
            let lastUrlPathSegmentLinks: NavigationTrailLinkInterface[] = OpsNavigationLinks;
            for(let urlPathSegmentIndex = 0; urlPathSegmentIndex < urlPathSegments.length; urlPathSegmentIndex++) {
                const urlPathSegment = urlPathSegments[urlPathSegmentIndex]!;
                const siblingNavigationTrailLinks = getSiblingNavigationTrailLinks(
                    cumulativePath,
                    lastUrlPathSegmentLinks,
                );

                // If we are not on the first segment, add the sibling links to the navigation trail
                if(urlPathSegmentIndex > 0) {
                    lastUrlPathSegmentLinks = siblingNavigationTrailLinks.flatMap((link) => link.links ?? []);
                }

                // Add the path segment to the cumulative path
                cumulativePath += `/${urlPathSegment}`;

                // Add the path segment to the navigation trail
                navigationTrailLinks.push({
                    title: titleCase(urlPathSegment.replaceAll('-', ' ')), // Format the segment into a title
                    href: cumulativePath,
                    links: siblingNavigationTrailLinks,
                });
            }

            // Look forward to see if there are any possible OpsNavigationLinks after this segment
            const siblingNavigationTrailLinks = getSiblingNavigationTrailLinks(cumulativePath, lastUrlPathSegmentLinks);
            if(siblingNavigationTrailLinks.length > 0) {
                navigationTrailLinks.push({
                    title: '',
                    href: '',
                    links: siblingNavigationTrailLinks,
                });
            }

            return navigationTrailLinks;
        },
        [urlPath, getSiblingNavigationTrailLinks],
    );

    // Use provided links or generate from pathname
    const navigationTrailLinks = generateNavigationTrailLinksUsingPathname();

    // Render the component
    return (
        <NavigationTrail
            links={navigationTrailLinks}
            {...properties}
            className={mergeClassNames('mb-4', properties.className)}
        />
    );
}
