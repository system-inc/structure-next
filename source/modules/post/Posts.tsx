'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Post, PostReactionsType } from '@structure/source/modules/post/Post';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    PostsQuery,
    PostVoteType,
    PostsDocument,
    ColumnFilterConditionOperator,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
// import { fullDate } from '@structure/source/utilities/Time';
// import { addCommas } from '@structure/source/utilities/Number';

// Component - Posts
export interface PostsInterface {
    type: 'Post' | 'Article' | 'Idea' | 'Question' | 'Principle';
    itemsPerPage?: number;
}
export function Posts(properties: PostsInterface) {
    // Hooks
    const postsQueryState = useQuery(PostsDocument, {
        variables: {
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
        },
    });
    console.log('postsQueryState', postsQueryState);

    const posts: {
        id: string;
        number: string;
        identifier: string;
        title: string;
        slug: string;
        urlPath: string;
        topics: string[];
        content: string;
        createdByProfileId: PostsQuery['posts']['items'][0]['createdByProfileId'];
        createdByProfile: PostsQuery['posts']['items'][0]['createdByProfile'];
        voteType: PostVoteType | null | undefined;
        upvoteCount: number;
        downvoteCount: number;
        views: number;
        reactions: PostReactionsType;
        metadata: any;
        updatedAt: string;
        createdAt: string;
    }[] = [];

    postsQueryState.data?.posts.items.forEach(function (post) {
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
                {postsQueryState.loading && (
                    <div className="mt-10">
                        <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    </div>
                )}

                {/* Error */}
                {postsQueryState.error && <div>Error: {postsQueryState.error.message}</div>}

                {/* Posts */}
                {postsQueryState.data &&
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

// Export - Default
export default Posts;
