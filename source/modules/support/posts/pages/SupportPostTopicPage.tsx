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
import { SupportTopicTile } from '@structure/source/modules/support/posts/components/SupportTopicTile';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';

// Dependencies - Assets
import { PlusIcon, PencilSimpleIcon, GearIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SupportPostTopicPage
export interface SupportPostTopicPageProperties {
    className?: string;
    postTopicSlug: string;
    parentPostTopicsSlugs?: string[];
    basePath?: string;
    postTopic: PostTopicQuery['postTopic'];
    postTopicAndSubPostTopicsWithPosts: {
        postTopicTitle: string; // "General" will be the title root topic
        postTopicSlug: string; // "general" will be the slug root topic
        postTopicDescription?: string | null;
        posts: PostTopicQuery['postTopic']['pagedPosts']['items'];
    }[];
    topicIconMapping?: {
        [key: string]: React.ReactElement<{ className?: string }>;
    };
}
export function SupportPostTopicPage(properties: SupportPostTopicPageProperties) {
    // Hooks
    const account = useAccount();

    // Defaults
    const basePath = properties.basePath || '/support';

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
                            href: basePath + '/post-topics/' + properties.postTopic.topic.id + '/edit',
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Sub Topic',
                            href: basePath + '/post-topics/create?parentPostTopicId=' + properties.postTopic.topic.id,
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Post',
                            href: basePath + '/posts/create?postTopicId=' + properties.postTopic.topic.id,
                        },
                    ]}
                />
            )}

            <div className="">
                <NavigationTrail className="mb-6" />

                <div className="max-w-2xl">
                    <Link
                        href={
                            basePath +
                            (properties.parentPostTopicsSlugs?.length
                                ? '/' + properties.parentPostTopicsSlugs.join('/')
                                : '') +
                            '/' +
                            properties.postTopic.topic.slug
                        }
                        className=""
                    >
                        <h1 className="inline-flex items-center space-x-3 text-2xl font-medium">
                            {postTopicIcon && React.cloneElement(postTopicIcon, { className: 'size-6' })}
                            <span>{properties.postTopic.topic.title}</span>
                        </h1>
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                {/* Render general posts (Start Here section - only show heading when there are sub-topic tiles) */}
                {generalPosts && generalPosts.posts.length > 0 && (
                    <div>
                        {shouldRenderSubTopicsAsTiles && <h2 className="mb-6 text-xl font-medium">Start Here</h2>}
                        <div className="">
                            {generalPosts.posts.map(function (post, postIndex) {
                                let postHref = basePath;
                                if(properties.parentPostTopicsSlugs?.length) {
                                    postHref += '/' + properties.parentPostTopicsSlugs.join('/');
                                }
                                postHref += '/' + properties.postTopicSlug;
                                postHref += '/articles/' + post.slug + '-' + post.identifier;

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
                        <HorizontalRule className="my-6" />
                    </div>
                )}

                {/* Render sub-topics as tiles when there are many */}
                {shouldRenderSubTopicsAsTiles && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {subTopics.map(function (subTopic, subTopicIndex) {
                            let subTopicHref = basePath;
                            if(properties.parentPostTopicsSlugs?.length) {
                                subTopicHref += '/' + properties.parentPostTopicsSlugs.join('/');
                            }
                            subTopicHref += '/' + properties.postTopicSlug + '/' + subTopic.postTopicSlug;

                            return (
                                <SupportTopicTile
                                    key={subTopicIndex}
                                    href={subTopicHref}
                                    title={subTopic.postTopicTitle}
                                    description={subTopic.postTopicDescription}
                                    rainbowPosition={subTopicIndex / subTopics.length}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Render sub-topics with posts (original behavior for 5 or fewer sub-topics) */}
                {!shouldRenderSubTopicsAsTiles &&
                    subTopics.map(function (subTopic, subTopicIndex) {
                        let subTopicHref = basePath;
                        if(properties.parentPostTopicsSlugs?.length) {
                            subTopicHref += '/' + properties.parentPostTopicsSlugs.join('/');
                        }
                        subTopicHref += '/' + properties.postTopicSlug + '/' + subTopic.postTopicSlug;

                        return (
                            <div key={subTopicIndex}>
                                <Link href={subTopicHref}>
                                    <h2 className="mb-6 text-xl font-medium">{subTopic.postTopicTitle}</h2>
                                </Link>
                                <div className="">
                                    {subTopic.posts.map(function (post, postIndex) {
                                        const postHref =
                                            subTopicHref + '/articles/' + post.slug + '-' + post.identifier;

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
                                <HorizontalRule className="my-6" />
                            </div>
                        );
                    })}
            </div>

            <HorizontalRule className="mt-16 mb-16" />

            <Feedback className="flex justify-center text-center" />

            <HorizontalRule className="mt-16 mb-16" />

            <SupportNeedMoreHelp />
        </div>
    );
}
