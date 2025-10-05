'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import { NavigationTrail } from '@structure/source/common/navigation/trail/NavigationTrail';
import { SupportFeedback } from '@structure/source/modules/support/components/SupportFeedback';
import { Button } from '@structure/source/common/buttons/Button';
import { Markdown } from '@structure/source/common/markdown/Markdown';

// Dependencies - API
// import { useQuery } from '@apollo/client';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Dependencies - Utilities
// import { titleCase } from '@structure/source/utilities/String';
import { timeFromNow } from '@structure/source/utilities/Time';

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
        <div className="container pb-32 pt-8">
            {account.data?.isAdministator() && (
                <div className="float-end flex space-x-2">
                    <Button
                        className="pl-3"
                        icon={EditIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
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
                        <h1 className="inline text-3xl font-medium leading-10">{properties.post.title}</h1>
                    </Link>
                </div>

                <p className="neutral mb-8 text-sm">Updated {updatedTimeAgoString}</p>

                {/* Post Content in Markdown */}
                {properties.post.content && <Markdown className="mb-4 max-w-2xl">{properties.post.content}</Markdown>}
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
