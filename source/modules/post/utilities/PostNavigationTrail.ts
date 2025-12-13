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
    basePath: string,
    basePathTitle: string,
    parentPostTopicsSlugs: string[] | undefined,
    postTopicSlug: string | undefined,
    postTopicTitle: string | undefined,
    navigationTrailIconMapping?: PostNavigationTrailIconMapping,
): NavigationTrailLinkInterface[] {
    const links: NavigationTrailLinkInterface[] = [];

    // Extract basePath slug for comparison (remove leading slash)
    const basePathSlug = basePath.replace(/^\//, '');

    // Start with the base path
    let hrefAccumulator = basePath;
    links.push({
        title: basePathTitle,
        href: hrefAccumulator,
        icon: navigationTrailIconMapping?.[basePathSlug],
    });

    // Add parent topic slugs (filter out any that match basePath to avoid duplication)
    if(parentPostTopicsSlugs) {
        parentPostTopicsSlugs.forEach(function (parentSlug) {
            if(parentSlug !== basePathSlug) {
                hrefAccumulator += '/' + parentSlug;
                links.push({
                    title: titleCase(parentSlug.replaceAll('-', ' ')),
                    href: hrefAccumulator,
                    icon: navigationTrailIconMapping?.[parentSlug],
                });
            }
        });
    }

    // Add current topic (skip if it matches basePath to avoid duplication)
    if(postTopicSlug && postTopicSlug !== basePathSlug) {
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
