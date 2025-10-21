'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import { NavigationTrail } from '@structure/source/components/navigation/trail/NavigationTrail';
import { SupportPostFeedback } from '@structure/source/modules/support/posts/components/SupportPostFeedback';
import { Button } from '@structure/source/components/buttons/Button';
import { Markdown } from '@structure/source/components/markdown/Markdown';

// Dependencies - API
// import { useQuery } from '@apollo/client';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Dependencies - Utilities
// import { titleCase } from '@structure/source/utilities/String';
import { timeFromNow } from '@structure/source/utilities/time/Time';

// Component - SupportPostPage
export interface SupportPostPageProperties {
    postTopicSlug?: string;
    parentPostTopicsSlugs?: string[];
    post: {
        identifier: string;
        slug: string;
        status: string;
        title: string;
        description?: string | null;
        content?: string | null;
        updatedAt: string | Date;
        createdAt: string | Date;
    };
}
export function SupportPostPage(properties: SupportPostPageProperties) {
    // console.log('SupportPostPage', properties);

    // Hooks
    const account = useAccount();

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

    const postHref =
        navigationTrailUrlPathname + '/articles/' + properties.post.identifier + '/' + properties.post.slug;

    const updateAtTimeInMilliseconds = new Date(properties.post.updatedAt).getTime();
    let updatedTimeAgoString = timeFromNow(updateAtTimeInMilliseconds);

    // If it has been over a week
    if(updateAtTimeInMilliseconds < new Date().getTime() - 1000 * 60 * 60 * 24 * 7) {
        updatedTimeAgoString = 'over a week ago';
    }

    // Render the component
    return (
        <div className="container pt-8 pb-32">
            {account.data?.isAdministator() && (
                <div className="float-end flex space-x-2">
                    <Button
                        className="pl-3"
                        iconLeft={EditIcon}
                        href={'/support/posts/' + properties.post.identifier + '/edit'}
                    >
                        Edit Post
                    </Button>
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" urlPath={navigationTrailUrlPathname} />

                <div className="mb-4 max-w-2xl">
                    <Link href={postHref} className="">
                        <h1 className="inline text-3xl leading-10 font-medium">{properties.post.title}</h1>
                    </Link>
                </div>

                <p className="mb-8 text-sm content--b">Updated {updatedTimeAgoString}</p>

                {/* Post Content in Markdown */}
                {properties.post.content && <Markdown className="mb-4 max-w-2xl">{properties.post.content}</Markdown>}
            </div>

            <hr className="my-16 border--a" />

            <SupportPostFeedback className="flex justify-center text-center" />

            <hr className="my-16 border--a" />

            <div className="flex justify-center">
                <div>
                    <p className="mb-4">Need more help?</p>
                    <Button size="Large" href="/contact">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
}
