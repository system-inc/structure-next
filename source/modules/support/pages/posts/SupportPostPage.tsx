'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import { NavigationTrail } from '@structure/source/common/navigation/NavigationTrail';
import { SupportFeedback } from '@structure/source/modules/support/SupportFeedback';
import { Button } from '@structure/source/common/buttons/Button';
import { Markdown } from '@structure/source/common/markdown/Markdown';

// Dependencies - API
// import { useQuery } from '@apollo/client';
import { SupportPostQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Dependencies - Utilities
// import { titleCase } from '@structure/source/utilities/String';
import { timeAgo } from '@structure/source/utilities/Time';

// Component - SupportPostPage
export interface SupportPostPageInterface {
    postTopicSlug?: string;
    parentPostTopicsSlugs?: string[];
    post: SupportPostQuery['post'];
}
export function SupportPostPage(properties: SupportPostPageInterface) {
    console.log('SupportPostPage', properties);

    // Hooks
    const { accountState } = useAccount();

    const post = properties.post;

    // Hooks - API
    // const supportPostQueryState = useQuery(SupportPostDocument, {
    //     variables: {
    //         identifier: properties.postIdentifier,
    //     },
    // });

    // The URL pathname for the navigation trail
    let navigationTrailUrlPathname = '/support';
    if(properties.parentPostTopicsSlugs) {
        navigationTrailUrlPathname += properties.parentPostTopicsSlugs.length
            ? '/' + properties.parentPostTopicsSlugs.join('/')
            : '';
    }
    if(properties.postTopicSlug) {
        navigationTrailUrlPathname += '/' + properties.postTopicSlug;
    }

    const postHref = navigationTrailUrlPathname + '/articles/' + post.identifier + '/' + post.slug;

    const updateAtTimeInMilliseconds = new Date(post.updatedAt).getTime();
    let updatedTimeAgoString = timeAgo(updateAtTimeInMilliseconds);

    // If it has been over a week
    if(updateAtTimeInMilliseconds < new Date().getTime() - 1000 * 60 * 60 * 24 * 7) {
        updatedTimeAgoString = 'over a week ago';
    }

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            {accountState.account?.isAdministator() && (
                <div className="float-end flex space-x-2">
                    <Button
                        className="pl-3"
                        icon={EditIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
                        href={'/support/posts/' + post.identifier + '/edit'}
                    >
                        Edit Post
                    </Button>
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" urlPath={navigationTrailUrlPathname} />

                <div className="mb-4 max-w-2xl ">
                    <Link href={postHref} className="">
                        <h1 className="inline text-3xl font-medium leading-10">{post.title}</h1>
                    </Link>
                </div>

                <p className="neutral mb-8 text-sm">Updated {updatedTimeAgoString}</p>

                {/* Post Content in Markdown */}
                {post.content && <Markdown className="mb-4 max-w-2xl">{post.content}</Markdown>}
            </div>

            <hr className="my-16" />

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
export default SupportPostPage;
