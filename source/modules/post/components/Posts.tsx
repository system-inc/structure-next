'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Post, PostReactionsType } from '@structure/source/modules/post/components/Post';

// Dependencies - API
import { usePostsDetailedRequest } from '@structure/source/modules/post/hooks/usePostsDetailedRequest';
import {
    PostsDetailedQuery,
    PostVoteType,
    ColumnFilterConditionOperator,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
// import { fullDate } from '@structure/source/utilities/Time';
// import { addCommas } from '@structure/source/utilities/Number';

// Component - Posts
export interface PostsProperties {
    type: 'Post' | 'Article' | 'Idea' | 'Question' | 'Principle';
    itemsPerPage?: number;
}
export function Posts(properties: PostsProperties) {
    // Hooks
    const postsDetailedRequest = usePostsDetailedRequest({
        pagination: {
            itemsPerPage: properties.itemsPerPage ?? 10,
            filters: [
                {
                    column: 'type',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: properties.type,
                },
            ],
        },
    });
    console.log('postsDetailedRequest', postsDetailedRequest);

    const posts: {
        id: string;
        number: string;
        identifier: string;
        title: string;
        slug: string;
        urlPath: string;
        topics: string[];
        content: string;
        createdByProfileId: PostsDetailedQuery['posts']['items'][0]['createdByProfileId'];
        createdByProfile: PostsDetailedQuery['posts']['items'][0]['createdByProfile'];
        voteType: PostVoteType | null | undefined;
        upvoteCount: number;
        downvoteCount: number;
        views: number;
        reactions: PostReactionsType;
        metadata: unknown;
        updatedAt: string;
        createdAt: string;
    }[] = [];

    postsDetailedRequest.data?.posts.items.forEach(function (post) {
        const contentTrimmed = post.content?.trim();
        let content = contentTrimmed && contentTrimmed.length > 0 ? contentTrimmed : '';

        // If there is 500 characters, add an ellipsis
        if(content && content.length > 500) {
            content = content.substring(0, 500) + '...';
        }

        const principleNumber = post.metadata?.principleNumber ?? 'Unknown';

        posts.push({
            id: post.id,
            number: principleNumber,
            identifier: post.identifier,
            title: post.title,
            slug: post.slug,
            urlPath: '/posts/' + principleNumber + '/' + post.slug,
            topics: [].map(function (topic) {
                return topic;
            }),
            content: content,
            createdByProfileId: post.createdByProfileId,
            createdByProfile: post.createdByProfile,
            voteType: post.voteType,
            upvoteCount: post.upvoteCount,
            downvoteCount: post.downvoteCount,
            views: 100,
            reactions: post.reactions ?? [],
            metadata: post.metadata,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        });
    });

    // Render the component
    return (
        <div>
            <p>
                ( Popular Posts | Trending Posts | New Posts ) - use github issues filters
                https://github.com/reactchartjs/react-chartjs-2/issues
            </p>

            <div className="mt-4">
                {/* Loading */}
                {postsDetailedRequest.isLoading && (
                    <div className="mt-10">
                        <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    </div>
                )}

                {/* Error */}
                {postsDetailedRequest.error && <div>Error: {postsDetailedRequest.error.message}</div>}

                {/* Posts */}
                {postsDetailedRequest.data &&
                    posts.map(function (post) {
                        return (
                            <Post
                                key={post.id}
                                id={post.id}
                                identifier={post.identifier}
                                title={post.title}
                                slug={post.slug}
                                urlPath={post.urlPath}
                                topics={post.topics}
                                content={post.content}
                                createdByProfileId={post.createdByProfileId}
                                createdByProfile={post.createdByProfile}
                                voteType={post.voteType}
                                upvoteCount={post.upvoteCount}
                                views={post.views}
                                reactions={post.reactions}
                                updatedAt={post.updatedAt}
                                createdAt={post.createdAt}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
