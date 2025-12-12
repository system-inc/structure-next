'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { PostSearch } from '@structure/source/modules/post/search/components/PostSearch';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';

// Dependencies - API
import { PostsQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SearchPostsPage
export interface SearchPostsPageProperties {
    className?: string;
    searchTerm: string;
    posts: PostsQuery['posts']['items'];
    basePath: string;
    title: string;
    searchPath: string;
    showNeedMoreHelp?: boolean;
}
export function SearchPostsPage(properties: SearchPostsPageProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            <h1 className="text-2xl font-medium">
                <Link href={properties.basePath}>{properties.title}</Link>
            </h1>
            <PostSearch className="mt-6 mb-8" defaultValue={properties.searchTerm} searchPath={properties.searchPath} />
            <HorizontalRule className="mt-6 mb-10" />

            <p className="mb-10 content--1">
                Search results for: <span className="font-medium content--0">{properties.searchTerm}</span>
            </p>

            {/* No Posts Found */}
            {properties.posts.length === 0 && (
                <div className="mb-12">
                    <p className="text-lg">No support articles found.</p>
                </div>
            )}

            {/* Posts */}
            {properties.posts.map(function (post, postIndex) {
                const postHref = properties.basePath + '/articles/' + post.slug + '-' + post.identifier;

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

            {properties.showNeedMoreHelp !== false && (
                <>
                    <HorizontalRule className="mt-20 mb-14" />
                    <SupportNeedMoreHelp />
                </>
            )}
        </div>
    );
}
