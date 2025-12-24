'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { PostTopicQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Button } from '@structure/source/components/buttons/Button';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { NavigationTrail } from '@structure/source/components/navigation/trail/NavigationTrail';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { Feedback } from '@structure/source/modules/feedback/components/Feedback';
import { PostTopicTile } from '@structure/source/modules/post/topics/components/PostTopicTile';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';
import { PostSearch } from '@structure/source/modules/post/search/components/PostSearch';

// Dependencies - Assets
import { PlusIcon, PencilSimpleIcon, GearIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import {
    generatePostNavigationTrailLinks,
    PostNavigationTrailIconMapping,
    PostNavigationTrailAncestor,
} from '@structure/source/modules/post/utilities/PostNavigationTrail';
import { generatePostUrl } from '@structure/source/modules/post/utilities/PostUrl';

// Component - PostTopicPage
export interface PostTopicPageProperties {
    className?: string;
    basePath: string;
    title: string; // Title for the navigation trail (e.g., "Support", "Library")
    managementBasePath: string; // Base path for management links (edit topic, create post, etc.)
    showNavigationTrail?: boolean; // Whether to show the breadcrumb trail - defaults to true
    showTitle?: boolean; // Whether to show the title - defaults to true
    showNeedMoreHelp?: boolean;
    searchPath?: string; // Path for search - if provided, shows search bar
    searchPlaceholder?: string;
    postTopic: PostTopicQuery['postTopic'];
    postTopicAndSubPostTopicsWithPosts: {
        postTopicId?: string;
        postTopicTitle: string; // "General" will be the title root topic
        postTopicSlug: string; // "general" will be the slug root topic
        postTopicDescription?: string | null;
        posts: PostTopicQuery['postTopic']['pagedPosts']['items'];
    }[];
    topicIconMapping?: {
        [key: string]: React.ReactElement<{ className?: string }>;
    };
    // Maps path slugs (e.g., 'library') to icons for the navigation trail
    navigationTrailIconMapping?: PostNavigationTrailIconMapping;
}
export function PostTopicPage(properties: PostTopicPageProperties) {
    // Hooks
    const account = useAccount();

    // Defaults
    const showNavigationTrail = properties.showNavigationTrail !== false;
    const showTitle = properties.showTitle !== false;

    // Extract basePath slug for comparison
    const basePathSlug = properties.basePath.replace(/^\//, '');

    // Build the base href for this topic from ancestors
    const topicBaseHref =
        properties.basePath +
        (properties.postTopic.ancestors ?? [])
            .filter(function (ancestor) {
                return ancestor.slug !== basePathSlug;
            })
            .map(function (ancestor) {
                return '/' + ancestor.slug;
            })
            .join('') +
        (properties.postTopic.topic.slug !== basePathSlug ? '/' + properties.postTopic.topic.slug : '');

    // Icon
    const postTopicIcon =
        properties.topicIconMapping && properties.postTopic.topic.id in properties.topicIconMapping
            ? properties.topicIconMapping[properties.postTopic.topic.id]
            : undefined;

    // Separate general posts from sub-topics
    const generalPosts = properties.postTopicAndSubPostTopicsWithPosts.find(function (item) {
        return item.postTopicSlug === 'general';
    });
    const subTopics = properties.postTopicAndSubPostTopicsWithPosts.filter(function (item) {
        return item.postTopicSlug !== 'general';
    });

    // Check if we should render sub-topics as tiles (when they have no posts, meaning > 5 sub-topics)
    const shouldRenderSubTopicsAsTiles = subTopics.length > 0 && subTopics[0]?.posts.length === 0;

    // Generate navigation trail links using ancestors from the API
    const navigationTrailLinks = generatePostNavigationTrailLinks(
        properties.basePath,
        properties.title,
        properties.postTopic.ancestors as PostNavigationTrailAncestor[] | undefined,
        properties.postTopic.topic.slug,
        properties.postTopic.topic.title,
        properties.navigationTrailIconMapping,
    );

    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            {account.data?.isAdministrator() && (
                <PopoverMenu
                    popoverProperties={{
                        align: 'End',
                    }}
                    trigger={<Button variant="Ghost" size="Icon" className="float-end" icon={GearIcon} />}
                    items={[
                        {
                            iconLeft: PencilSimpleIcon,
                            children: 'Edit Topic',
                            href:
                                properties.managementBasePath +
                                '/post-topics/' +
                                properties.postTopic.topic.id +
                                '/edit',
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Sub Topic',
                            href:
                                properties.managementBasePath +
                                '/post-topics/create?parentPostTopicId=' +
                                properties.postTopic.topic.id,
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Post',
                            href:
                                properties.managementBasePath +
                                '/posts/create?postTopicId=' +
                                properties.postTopic.topic.id,
                        },
                    ]}
                />
            )}

            {showNavigationTrail && <NavigationTrail className="mb-6" links={navigationTrailLinks} />}

            {properties.searchPath && (
                <PostSearch
                    className="mb-8"
                    placeholder={properties.searchPlaceholder}
                    searchPath={properties.searchPath}
                />
            )}

            {showTitle && (
                <div className="max-w-2xl">
                    <Link href={topicBaseHref} className="">
                        <h1 className="inline-flex items-center space-x-3 text-2xl font-medium">
                            {postTopicIcon && React.cloneElement(postTopicIcon, { className: 'size-6' })}
                            <span>{properties.postTopic.topic.title}</span>
                        </h1>
                    </Link>
                </div>
            )}

            <div className={showTitle ? 'mt-8 flex flex-col' : 'flex flex-col'}>
                {/* Render general posts */}
                {generalPosts && generalPosts.posts.length > 0 && (
                    <div>
                        <div className="">
                            {generalPosts.posts.map(function (post, postIndex) {
                                const postHref = generatePostUrl(properties.basePath, post.slug, post.identifier);

                                return (
                                    <div key={postIndex} className="mb-4">
                                        <Link
                                            className="-mx-3.5 -my-3 flex items-center justify-between rounded-md px-3.5 py-3 transition-colors hover:background--2"
                                            href={postHref}
                                        >
                                            <span>
                                                <h3 className="text-base font-medium">{post.title}</h3>
                                                <p className="text-sm content--4">{post.description}</p>
                                            </span>
                                            <CaretRightIcon className="h-4 w-4" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Only show HR if there are sub-topics following */}
                        {subTopics.length > 0 && <HorizontalRule className="my-6" />}
                    </div>
                )}

                {/* Render sub-topics as tiles when there are many */}
                {shouldRenderSubTopicsAsTiles && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {subTopics.map(function (subTopic, subTopicIndex) {
                            const subTopicHref = topicBaseHref + '/' + subTopic.postTopicSlug;

                            // Get icon from mapping if available
                            const subTopicIcon =
                                subTopic.postTopicId &&
                                properties.topicIconMapping &&
                                subTopic.postTopicId in properties.topicIconMapping
                                    ? properties.topicIconMapping[subTopic.postTopicId]
                                    : undefined;

                            return (
                                <PostTopicTile
                                    key={subTopicIndex}
                                    href={subTopicHref}
                                    title={subTopic.postTopicTitle}
                                    description={subTopic.postTopicDescription}
                                    icon={subTopicIcon}
                                    rainbowPosition={subTopicIndex / subTopics.length}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Render sub-topics with posts (original behavior for 5 or fewer sub-topics) */}
                {!shouldRenderSubTopicsAsTiles &&
                    subTopics.map(function (subTopic, subTopicIndex) {
                        const subTopicHref = topicBaseHref + '/' + subTopic.postTopicSlug;
                        const isLastSubTopic = subTopicIndex === subTopics.length - 1;

                        return (
                            <div key={subTopicIndex}>
                                <Link href={subTopicHref}>
                                    <h2 className="mb-6 text-xl font-medium">{subTopic.postTopicTitle}</h2>
                                </Link>
                                <div className="">
                                    {subTopic.posts.map(function (post, postIndex) {
                                        const postHref = generatePostUrl(
                                            properties.basePath,
                                            post.slug,
                                            post.identifier,
                                        );

                                        return (
                                            <div key={postIndex} className="mb-4">
                                                <Link
                                                    className="-mx-3.5 -my-3 flex items-center justify-between rounded-md px-3.5 py-3 transition-colors hover:background--2"
                                                    href={postHref}
                                                >
                                                    <span>
                                                        <h3 className="text-base font-medium">{post.title}</h3>
                                                        <p className="text-sm content--4">{post.description}</p>
                                                    </span>
                                                    <CaretRightIcon className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                                {!isLastSubTopic && <HorizontalRule className="my-6" />}
                            </div>
                        );
                    })}
            </div>

            <HorizontalRule className="mt-16 mb-16" />

            <Feedback className="flex justify-center text-center" />

            {properties.showNeedMoreHelp !== false && (
                <>
                    <HorizontalRule className="mt-16 mb-16" />

                    <SupportNeedMoreHelp />
                </>
            )}
        </div>
    );
}
