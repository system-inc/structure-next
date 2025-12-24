'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Button } from '@structure/source/components/buttons/Button';
import { Feedback } from '@structure/source/modules/feedback/components/Feedback';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { Markdown } from '@structure/source/components/markdown/Markdown';
import { NavigationTrail } from '@structure/source/components/navigation/trail/NavigationTrail';
import { PostSearch } from '@structure/source/modules/post/search/components/PostSearch';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';

// Dependencies - Assets
import { CaretLeftIcon, CaretRightIcon, PencilIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { timeFromNow } from '@structure/source/utilities/time/Time';
import {
    generatePostNavigationTrailLinks,
    PostNavigationTrailIconMapping,
    PostNavigationTrailAncestor,
} from '@structure/source/modules/post/utilities/PostNavigationTrail';
import { generatePostUrl } from '@structure/source/modules/post/utilities/PostUrl';

// Component - PostPage
export interface PostPageProperties {
    className?: string;
    basePath: string;
    title: string; // Title for the navigation trail (e.g., "Support", "Library")
    searchPath?: string;
    searchPlaceholder?: string;
    showNeedMoreHelp?: boolean;
    // Maps path slugs (e.g., 'library') to icons for the navigation trail
    navigationTrailIconMapping?: PostNavigationTrailIconMapping;
    post: {
        identifier: string;
        slug: string;
        status: string;
        title: string;
        description?: string | null;
        content?: string | null;
        updatedAt: string | Date;
        createdAt: string | Date;
        topics?:
            | {
                  id: string;
                  title: string;
                  slug: string;
                  ancestors?: PostNavigationTrailAncestor[] | null;
              }[]
            | null;
        previousSibling?: {
            identifier: string;
            title: string;
            slug: string;
        } | null;
        nextSibling?: {
            identifier: string;
            title: string;
            slug: string;
        } | null;
    };
}
export function PostPage(properties: PostPageProperties) {
    // Hooks
    const account = useAccount();

    // Get the primary topic and its ancestors from the post data
    const primaryTopic = properties.post.topics?.[0];
    const ancestors = primaryTopic?.ancestors ?? undefined;

    // Generate navigation trail links using ancestors from the API
    const navigationTrailLinks = generatePostNavigationTrailLinks(
        properties.basePath,
        properties.title,
        ancestors,
        primaryTopic?.slug,
        primaryTopic?.title,
        properties.navigationTrailIconMapping,
    );

    const postHref = generatePostUrl(properties.basePath, properties.post.slug, properties.post.identifier);

    const updateAtTimeInMilliseconds = new Date(properties.post.updatedAt).getTime();
    let updatedTimeAgoString = timeFromNow(updateAtTimeInMilliseconds);

    // If it has been over a week
    if(updateAtTimeInMilliseconds < new Date().getTime() - 1000 * 60 * 60 * 24 * 7) {
        updatedTimeAgoString = 'over a week ago';
    }

    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            {account.data?.isAdministrator() && (
                <div className="float-end">
                    <Button
                        variant="Ghost"
                        size="Icon"
                        icon={PencilIcon}
                        href={
                            properties.basePath +
                            '/posts/' +
                            properties.post.identifier +
                            '/edit?postTopicSlug=' +
                            (primaryTopic?.slug ?? '')
                        }
                    />
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-6" links={navigationTrailLinks} />

                {properties.searchPath && (
                    <PostSearch
                        className="mb-8"
                        placeholder={properties.searchPlaceholder}
                        searchPath={properties.searchPath}
                    />
                )}

                <div className="mb-4 max-w-2xl">
                    <Link href={postHref} className="">
                        <h1 className="inline text-3xl leading-10 font-medium">{properties.post.title}</h1>
                    </Link>
                </div>

                <p className="mb-8 text-sm content--1">Updated {updatedTimeAgoString}</p>

                {/* Post Content - FAQ sections are automatically transformed to accordions by the Markdown component */}
                {properties.post.content && <Markdown className="mb-4 max-w-2xl">{properties.post.content}</Markdown>}

                {/* Previous/Next Article Navigation */}
                {(properties.post.previousSibling || properties.post.nextSibling) && (
                    <div className="mt-12 flex items-stretch gap-4">
                        {properties.post.previousSibling ? (
                            <Link
                                href={generatePostUrl(
                                    properties.basePath,
                                    properties.post.previousSibling.slug,
                                    properties.post.previousSibling.identifier,
                                )}
                                className="flex flex-1 items-center gap-3 rounded-lg border border--0 p-4 transition-colors hover:background--1"
                            >
                                <CaretLeftIcon className="h-5 w-5 shrink-0 content--4" />
                                <div className="min-w-0">
                                    <p className="text-xs content--4">Previous</p>
                                    <p className="truncate font-medium">{properties.post.previousSibling.title}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {properties.post.nextSibling ? (
                            <Link
                                href={generatePostUrl(
                                    properties.basePath,
                                    properties.post.nextSibling.slug,
                                    properties.post.nextSibling.identifier,
                                )}
                                className="flex flex-1 items-center justify-end gap-3 rounded-lg border border--0 p-4 text-right transition-colors hover:background--1"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs content--4">Next</p>
                                    <p className="truncate font-medium">{properties.post.nextSibling.title}</p>
                                </div>
                                <CaretRightIcon className="h-5 w-5 shrink-0 content--4" />
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </div>
                )}
            </div>

            <HorizontalRule className="my-16" />

            <Feedback className="flex justify-center text-center" />

            {properties.showNeedMoreHelp !== false && (
                <>
                    <HorizontalRule className="my-16" />

                    <SupportNeedMoreHelp />
                </>
            )}
        </div>
    );
}
