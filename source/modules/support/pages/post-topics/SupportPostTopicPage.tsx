'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { NavigationTrail } from '@structure/source/common/navigation/NavigationTrail';
import { SupportFeedback } from '@structure/source/modules/support/SupportFeedback';
import { postTopicIdentifierToIconObject } from '@structure/source/modules/support/pages/SupportPage';
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
// import { useQuery } from '@apollo/client';
import { SupportPostTopicQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';
import GearIcon from '@structure/assets/icons/tools/GearIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Component - SupportPostTopicPage
export interface SupportPostTopicPageInterface {
    postTopicSlug: string;
    parentPostTopicsSlugs?: string[];
    postTopic: SupportPostTopicQuery['postTopic'];
    postTopicAndSubPostTopicsWithPosts: {
        postTopicTitle: string; // "General" will be the title root topic
        postTopicSlug: string; // "general" will be the slug root topic
        posts: SupportPostTopicQuery['postTopic']['pagedPosts']['items'];
    }[];
}
export function SupportPostTopicPage(properties: SupportPostTopicPageInterface) {
    // Hooks
    const { accountState } = useAccount();

    // Hooks - API
    // const supportPostTopicQueryState = useQuery(SupportPostTopicDocument, {
    //     variables: {
    //         slug: properties.topicSlug,
    //     },
    // });

    const postTopic = properties.postTopic;
    const PostTopicIcon = postTopicIdentifierToIconObject[postTopic.topic.id];

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            {accountState.account?.isAdministator() && (
                <PopoverMenu
                    items={[
                        {
                            icon: EditIcon,
                            iconPosition: 'left',
                            content: 'Edit Topic',
                            href: '/support/post-topics/' + postTopic.topic.id + '/edit',
                        },
                        {
                            icon: PlusIcon,
                            iconPosition: 'left',
                            content: 'Create Sub Topic',
                            href: '/support/post-topics/create?parentPostTopicId=' + postTopic.topic.id,
                        },
                        {
                            icon: PlusIcon,
                            iconPosition: 'left',
                            content: 'Create Post',
                            href: '/support/posts/create?postTopicId=' + postTopic.topic.id,
                        },
                    ]}
                >
                    <Button className="float-end" icon={GearIcon} />
                </PopoverMenu>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" />

                <Link href={'/support/' + properties.postTopic.topic.slug} className="">
                    <h1 className="mb-4 flex items-center space-x-3 text-3xl font-medium">
                        {PostTopicIcon && <PostTopicIcon className="h-8 w-8" />}
                        <span>{properties.postTopic.topic.title}</span>
                    </h1>
                </Link>

                {/* <p className="neutral">Cart issues, checkout problems, order submission errors</p> */}
            </div>

            <div className="flex flex-col">
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
                                        <h2 className="mb-8 text-2xl font-semibold">
                                            {postTopicAndSubPostTopicsWithPosts.postTopicTitle}
                                        </h2>
                                    </Link>
                                )}
                                <div className="">
                                    {postTopicAndSubPostTopicsWithPosts.posts.map(function (post, postIndex) {
                                        const postHref =
                                            postTopicHref + '/articles/' + post.identifier + '/' + post.slug;

                                        return (
                                            <div key={postIndex} className="mb-4">
                                                <Link
                                                    className="-mx-3.5 -my-3 flex items-center justify-between rounded-md px-3.5 py-3 transition-colors hover:bg-light-1 dark:hover:bg-dark-2"
                                                    href={postHref}
                                                >
                                                    <span>
                                                        <h3 className="text-base font-medium">{post.title}</h3>
                                                        <p className="neutral text-sm">{post.description}</p>
                                                    </span>
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                                <hr className="my-12" />
                            </div>
                        );
                    },
                )}
            </div>

            <SupportFeedback className="flex justify-center text-center" />

            <hr className="my-16" />

            <div className="flex justify-center">
                <div>
                    <p className="mb-4">Need more help?</p>
                    <Button size="lg" href="/contact">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default SupportPostTopicPage;
