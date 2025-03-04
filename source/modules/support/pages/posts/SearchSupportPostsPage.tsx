'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { SupportFeedback } from '@structure/source/modules/support/components/SupportFeedback';
import { Button } from '@structure/source/common/buttons/Button';
import { SupportSearch } from '@project/source/modules/support/components/SupportSearch';

// Dependencies - API
import { SupportPostQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { timeAgo } from '@structure/source/utilities/Time';

// Component - SearchSupportPostsPage
export interface SearchSupportPostsPageInterface {
    searchTerm: string;
    posts: SupportPostQuery['post'][];
}
export function SearchSupportPostsPage(properties: SearchSupportPostsPageInterface) {
    const searchUrlPath = '/support/search?term=' + encodeURIComponent(properties.searchTerm);

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            <h1 className="mb-6 text-3xl font-medium">Support</h1>

            <SupportSearch className="mb-10" defaultValue={properties.searchTerm} />

            <div className="mb-12">
                <p className="">Search results for: {properties.searchTerm}</p>
            </div>

            {/* No Posts Found */}
            {properties.posts.length === 0 && (
                <div className="mb-12">
                    <p className="text-lg">No support articles found.</p>
                </div>
            )}

            {/* Posts */}
            {properties.posts.map(function (post, postIndex) {
                // const postHref =
                //     postTopicHref + '/articles/' + post.identifier + '/' + post.slug;
                const postHref = '/support/articles/' + post.identifier + '/' + post.slug;

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
export default SearchSupportPostsPage;
