// Dependencies - React
import React from 'react';

// Dependencies - Types
import { NavigationTrailLinkInterface } from '@structure/source/components/navigation/trail/NavigationTrail';

// Dependencies - Utilities
import { generatePostUrl } from '@structure/source/modules/post/utilities/PostUrl';

// Interface for icon mapping
export interface PostNavigationTrailIconMapping {
    [key: string]: React.ReactElement<{ className?: string }>;
}

// Interface for ancestor topics (matches PostTopic from GraphQL)
export interface PostNavigationTrailAncestor {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
}

// Function to generate navigation trail links from ancestors array
export function generatePostNavigationTrailLinks(
    basePath: string,
    basePathTitle: string,
    ancestors: PostNavigationTrailAncestor[] | undefined,
    currentTopicSlug: string | undefined,
    currentTopicTitle: string | undefined,
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

    // Add ancestor topics (these come from the API with actual titles)
    // API returns ancestors with nearest parent first, root last - reverse for breadcrumb order
    if(ancestors) {
        const ancestorsRootFirst = ancestors.slice().reverse();
        ancestorsRootFirst.forEach(function (ancestor) {
            // Skip if ancestor slug matches basePath to avoid duplication
            if(ancestor.slug !== basePathSlug) {
                hrefAccumulator += '/' + ancestor.slug;
                links.push({
                    title: ancestor.title,
                    href: hrefAccumulator,
                    icon: navigationTrailIconMapping?.[ancestor.slug],
                });
            }
        });
    }

    // Add current topic (skip if it matches basePath to avoid duplication)
    if(currentTopicSlug && currentTopicSlug !== basePathSlug) {
        hrefAccumulator += '/' + currentTopicSlug;
        links.push({
            title: currentTopicTitle ?? currentTopicSlug,
            href: hrefAccumulator,
            icon: navigationTrailIconMapping?.[currentTopicSlug],
        });
    }

    return links;
}

// Function to generate navigation trail links for a post (article) page
// This adds the post title as the final breadcrumb item
export function generatePostArticleNavigationTrailLinks(
    basePath: string,
    basePathTitle: string,
    ancestors: PostNavigationTrailAncestor[] | undefined,
    currentTopicSlug: string | undefined,
    currentTopicTitle: string | undefined,
    postSlug: string,
    postIdentifier: string,
    postTitle: string,
    navigationTrailIconMapping?: PostNavigationTrailIconMapping,
): NavigationTrailLinkInterface[] {
    // Start with the topic trail
    const links = generatePostNavigationTrailLinks(
        basePath,
        basePathTitle,
        ancestors,
        currentTopicSlug,
        currentTopicTitle,
        navigationTrailIconMapping,
    );

    // Build the post href using flat URL format
    const postHref = generatePostUrl(basePath, postSlug, postIdentifier);

    // Add the post as the final breadcrumb
    links.push({
        title: postTitle,
        href: postHref,
    });

    return links;
}
