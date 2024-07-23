'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Post, PostReactionsType } from '@structure/source/modules/post/Post';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { PostVoteType, PostsDocument, ColumnFilterConditionOperator } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

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
        identifier: string;
        title: string;
        description: string;
        upvoteCount: number;
        voteType: PostVoteType | null | undefined;
        reactions: PostReactionsType;
        views: number;
        submittedByDisplayName: string;
        submittedByUsername: string;
        createdAt: string;
        updatedAt: string;
        topics: string[];
    }[] = [];

    postsQueryState.data?.posts.items.forEach(function (idea) {
        posts.push({
            id: idea.id,
            identifier: idea.identifier,
            title: idea.title,
            // description: idea.content,
            // Truncate description
            description: idea.content.substring(0, 500) + '...',
            upvoteCount: idea.upvoteCount,
            voteType: idea.voteType,
            reactions: idea.reactions ?? [],
            views: 100,
            submittedByDisplayName: 'Bill',
            submittedByUsername: 'bill',
            createdAt: idea.createdAt,
            updatedAt: idea.updatedAt,
            topics: ['Stack', 'Supplements'].map(function (topic) {
                return topic;
            }),
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
                    <div>
                        <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    </div>
                )}

                {/* Error */}
                {postsQueryState.error && <div>Error: {postsQueryState.error.message}</div>}

                {/* Posts */}
                {postsQueryState.data &&
                    posts.map(function (idea) {
                        return (
                            <Post
                                key={idea.id}
                                id={idea.id}
                                identifier={idea.identifier}
                                title={idea.title}
                                content={idea.description}
                                upvoteCount={idea.upvoteCount}
                                voteType={idea.voteType}
                                reactions={idea.reactions}
                                views={idea.views}
                                submittedByDisplayName={idea.submittedByDisplayName}
                                submittedByUsername={idea.submittedByUsername}
                                createdAt={idea.createdAt}
                                updatedAt={idea.updatedAt}
                                topics={idea.topics}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

// Export - Default
export default Posts;
