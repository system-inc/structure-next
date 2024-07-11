'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Idea } from '@structure/source/modules/idea/common/idea/Idea';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { IdeasDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Component - Ideas
export interface IdeasInterface {}
export function Ideas(properties: IdeasInterface) {
    // Hooks
    const ideasQueryState = useQuery(IdeasDocument, {
        variables: {
            // pagination: {
            //     itemsPerPage: 10,
            // },
        },
    });

    const ideas: {
        id: string;
        identifier: string;
        title: string;
        description: string;
        upvoteCount: number;
        upvoted: boolean;
        views: number;
        submittedByDisplayName: string;
        submittedByUsername: string;
        createdAt: string;
        updatedAt: string;
        topics: string[];
    }[] = [];

    ideasQueryState.data?.articlesMine.items.forEach(function (idea) {
        ideas.push({
            id: idea.id,
            identifier: 'slug',
            title: idea.title,
            // description: idea.content,
            // Truncate description
            description: idea.content.substring(0, 500) + '...',
            upvoteCount: idea.upvoteCount,
            upvoted: idea.upvoted,
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
                ( Popular Ideas | Trending Ideas | New Ideas ) - use github issues filters
                https://github.com/reactchartjs/react-chartjs-2/issues
            </p>

            <div className="mt-4">
                {/* Loading */}
                {ideasQueryState.loading && (
                    <div>
                        <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    </div>
                )}

                {/* Error */}
                {ideasQueryState.error && <div>Error: {ideasQueryState.error.message}</div>}

                {/* Ideas */}
                {ideasQueryState.data &&
                    ideas.map(function (idea) {
                        return (
                            <Idea
                                key={idea.id}
                                id={idea.id}
                                identifier={idea.identifier}
                                title={idea.title}
                                description={idea.description}
                                upvoteCount={idea.upvoteCount}
                                upvoted={idea.upvoted}
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
export default Ideas;
