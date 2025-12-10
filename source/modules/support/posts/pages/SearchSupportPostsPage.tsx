'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Button } from '@structure/source/components/buttons/Button';
import { SupportSearch } from '@structure/source/modules/support/posts/components/SupportSearch';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';

// Dependencies - API
import { PostsQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { ArrowRightIcon, CaretRightIcon, QuestionIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SearchSupportPostsPage
export interface SearchSupportPostsPageProperties {
    className?: string;
    searchTerm: string;
    posts: PostsQuery['posts']['items'];
}
export function SearchSupportPostsPage(properties: SearchSupportPostsPageProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            <h1 className="text-2xl font-medium">
                <Link href="/support">Support</Link>
            </h1>
            <HorizontalRule className="mt-6 mb-12" />

            <SupportSearch className="mx-auto mb-8" defaultValue={properties.searchTerm} />

            <p className="mb-8 text-center content--1">
                Search results for: <span className="content--0">{properties.searchTerm}</span>
            </p>

            {/* No Posts Found */}
            {properties.posts.length === 0 && (
                <div className="mb-12">
                    <p className="text-lg">No support articles found.</p>
                </div>
            )}

            {/* Posts */}
            {properties.posts.map(function (post, postIndex) {
                const postHref = '/support/articles/' + post.identifier + '/' + post.slug;

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

            <HorizontalRule className="mt-20 mb-14" />

            <div className="mx-auto max-w-170">
                <h2 className="mb-12 text-center text-[2rem] font-medium">Need more help?</h2>

                <div className="mb-12 rounded-2xl border border--0 background--2 p-8">
                    <QuestionIcon className="mx-auto mb-4 size-6" />
                    <p className="mb-2 text-center font-medium">Contact Us</p>
                    <p className="text-center text-sm font-normal content--4">We&apos;d love to hear from you.</p>

                    <div className="mt-8 flex flex-col items-center">
                        <Button variant="B" iconRight={ArrowRightIcon} href="/contact">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
