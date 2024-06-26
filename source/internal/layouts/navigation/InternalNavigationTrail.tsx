'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import {
    NavigationTrailLinkInterface,
    NavigationTrailInterface,
    NavigationTrail,
} from '@structure/source/common/navigation/NavigationTrail';
import InternalNavigationLinks from '@structure/source/internal/layouts/navigation/InternalNavigationLinks';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';

// Component - InternalNavigationTrail
export function InternalNavigationTrail(properties: NavigationTrailInterface) {
    // Get the current pathname from the URL using the usePathname hook
    const urlPathname = usePathname();

    // Function to get sibling navigation trail links for a given path
    const getSiblingNavigationTrailLinks = React.useCallback(function (
        path: string,
        links: NavigationTrailLinkInterface[],
    ): NavigationTrailLinkInterface[] {
        let siblingNavigationTrailLinks: NavigationTrailLinkInterface[] = [];

        // Loop over InternalNavigationLinks
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

    // Function to generate links from pathname using the pathname and InternalNavigationLinks
    const generateNavigationTrailLinksUsingPathname = React.useCallback(
        function () {
            const urlPathSegments = urlPathname.split('/').filter(Boolean);
            // console.log('generateNavigationTrailLinksUsingPathname', pathSegments);
            let navigationTrailLinks: NavigationTrailLinkInterface[] = [];
            let cumulativePath = '';

            // Loop over each path segment
            let lastUrlPathSegmentLinks: NavigationTrailLinkInterface[] = InternalNavigationLinks;
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

            // Look forward to see if there are any possible InternalNavigationLinks after this segment
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
        [urlPathname, getSiblingNavigationTrailLinks],
    );

    // Use provided links or generate from pathname
    let navigationTrailLinks = generateNavigationTrailLinksUsingPathname();

    // Render the component
    return <NavigationTrail links={navigationTrailLinks} {...properties} />;
}

// Export - Default
export default InternalNavigationTrail;
