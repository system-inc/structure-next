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

// Dependencies - Assets
import { PencilIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { timeFromNow } from '@structure/source/utilities/time/Time';

// Component - SupportPostPage
export interface SupportPostPageProperties {
    className?: string;
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
        <div className={mergeClassNames('container', properties.className)}>
            {account.data?.isAdministrator() && (
                <div className="float-end">
                    <Button
                        variant="Ghost"
                        size="Icon"
                        icon={PencilIcon}
                        href={
                            '/support/posts/' +
                            properties.post.identifier +
                            '/edit?postTopicSlug=' +
                            (properties.postTopicSlug ?? '')
                        }
                    />
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" urlPath={navigationTrailUrlPathname} />

                <div className="mb-4 max-w-2xl">
                    <Link href={postHref} className="">
                        <h1 className="inline text-3xl leading-10 font-medium">{properties.post.title}</h1>
                    </Link>
                </div>

                <p className="mb-8 text-sm content--1">Updated {updatedTimeAgoString}</p>

                {/* Post Content in Markdown */}
                {properties.post.content && <Markdown className="mb-4 max-w-2xl">{properties.post.content}</Markdown>}
            </div>

            <HorizontalRule className="my-16" />

            <Feedback className="flex justify-center text-center" />

            <HorizontalRule className="my-16" />

            <div className="flex justify-center">
                <div>
                    <p className="mb-4">Need more help?</p>
                    <Button variant="A" size="Large" href="/contact">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
}
