// Dependencies - React
import React from 'react';

// Dependencies - Types
import { NavigationTrailLinkInterface } from '@structure/source/components/navigation/trail/NavigationTrail';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/type/String';

// Interface for icon mapping
export interface PostNavigationTrailIconMapping {
    [key: string]: React.ReactElement<{ className?: string }>;
}

// Function to generate navigation trail links with icons
export function generatePostNavigationTrailLinks(
    parentPostTopicsSlugs: string[] | undefined,
    postTopicSlug: string | undefined,
    postTopicTitle: string | undefined,
    navigationTrailIconMapping?: PostNavigationTrailIconMapping,
): NavigationTrailLinkInterface[] {
    const links: NavigationTrailLinkInterface[] = [];
    let hrefAccumulator = '';

    // Add parent topic slugs
    if(parentPostTopicsSlugs) {
        parentPostTopicsSlugs.forEach(function (parentSlug) {
            hrefAccumulator += '/' + parentSlug;
            links.push({
                title: titleCase(parentSlug.replaceAll('-', ' ')),
                href: hrefAccumulator,
                icon: navigationTrailIconMapping?.[parentSlug],
            });
        });
    }

    // Add current topic
    if(postTopicSlug) {
        hrefAccumulator += '/' + postTopicSlug;
        links.push({
            // Use provided title if available, otherwise generate from slug
            title: postTopicTitle ?? titleCase(postTopicSlug.replaceAll('-', ' ')),
            href: hrefAccumulator,
            icon: navigationTrailIconMapping?.[postTopicSlug],
        });
    }

    return links;
}
