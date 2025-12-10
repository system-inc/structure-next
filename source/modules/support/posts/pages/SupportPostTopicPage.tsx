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
    postTopic: PostTopicQuery['postTopic'];
    postTopicAndSubPostTopicsWithPosts: {
        postTopicTitle: string; // "General" will be the title root topic
        postTopicSlug: string; // "general" will be the slug root topic
        posts: PostTopicQuery['postTopic']['pagedPosts']['items'];
    }[];
    topicIconMapping?: {
        [key: string]: React.ReactElement<{ className?: string }>;
    };
}
export function SupportPostTopicPage(properties: SupportPostTopicPageProperties) {
    // Hooks
    const account = useAccount();

    // Icon
    const postTopicIcon =
        properties.topicIconMapping && properties.postTopic.topic.id in properties.topicIconMapping
            ? properties.topicIconMapping[properties.postTopic.topic.id]
            : undefined;

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
                            href: '/support/post-topics/' + properties.postTopic.topic.id + '/edit',
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Sub Topic',
                            href: '/support/post-topics/create?parentPostTopicId=' + properties.postTopic.topic.id,
                        },
                        {
                            iconLeft: PlusIcon,
                            children: 'Create Post',
                            href: '/support/posts/create?postTopicId=' + properties.postTopic.topic.id,
                        },
                    ]}
                />
            )}

            <div className="">
                <NavigationTrail className="mb-6" />

                <div className="max-w-2xl">
                    <Link href={'/support/' + properties.postTopic.topic.slug} className="">
                        <h1 className="inline-flex items-center space-x-3 text-2xl font-medium">
                            {postTopicIcon && React.cloneElement(postTopicIcon, { className: 'size-6' })}
                            <span>{properties.postTopic.topic.title}</span>
                        </h1>
                    </Link>
                </div>
            </div>

            <div className="mt-6 flex flex-col">
                {properties.postTopicAndSubPostTopicsWithPosts.map(
                    function (postTopicAndSubPostTopicsWithPosts, postTopicAndSubPostTopicsWithPostsIndex) {
                        let postTopicHref = '/support';

                        // Add parent topic slugs
                        if(properties.parentPostTopicsSlugs?.length) {
                            postTopicHref += '/' + properties.parentPostTopicsSlugs.join('/');
                        }

                        // Add the current topic slug
                        postTopicHref += '/' + properties.postTopicSlug;

                        if(postTopicAndSubPostTopicsWithPosts.postTopicSlug !== 'general') {
                            postTopicHref += '/' + postTopicAndSubPostTopicsWithPosts.postTopicSlug;
                        }

                        return (
                            <div key={postTopicAndSubPostTopicsWithPostsIndex}>
                                {postTopicAndSubPostTopicsWithPosts.postTopicTitle !== 'General' && (
                                    <Link href={postTopicHref}>
                                        <h2 className="mb-6 text-xl font-medium">
                                            {postTopicAndSubPostTopicsWithPosts.postTopicTitle}
                                        </h2>
                                    </Link>
                                )}
                                <div className="">
                                    {postTopicAndSubPostTopicsWithPosts.posts.map(function (post, postIndex) {
                                        const postHref =
                                            postTopicHref + '/articles/' + post.slug + '-' + post.identifier;

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
                    },
                )}
            </div>

            <Feedback className="flex justify-center text-center" />

            <HorizontalRule className="my-16" />

            <SupportNeedMoreHelp />
        </div>
    );
}
