'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { IdeaVoteControl } from '@structure/source/modules/idea/common/idea/controls/IdeaVoteControl';
import { IdeaReactions } from '@structure/source/modules/idea/common/idea/IdeaReactions';
import { IdeaControls } from '@structure/source/modules/idea/common/idea/controls/IdeaControls';

// Dependencies - API
import { ArticleVoteType } from '@project/source/api/GraphQlGeneratedCode';

// Component - Idea
export interface IdeaInterface {
    id: string;
    identifier: string;
    title: string;
    description: string;
    upvoteCount: number;
    voteType: ArticleVoteType | null | undefined;
    views: number;
    submittedByDisplayName: string;
    submittedByUsername: string;
    createdAt: string;
    updatedAt: string;
    topics: string[];
}
export function Idea(properties: IdeaInterface) {
    // State
    const [upvoteCount, setUpvoteCount] = React.useState<number>(properties.upvoteCount);
    const [voteType, setVoteType] = React.useState<ArticleVoteType | null | undefined>(properties.voteType ?? null);

    // The URL path for the idea
    const ideaUrlPath = '/ideas/' + properties.id + '/' + properties.identifier;

    // Function to handle a change in vote count and type
    // We need to do this because we have two vote controls that need to stay synchronized
    function onVoteChange(newUpvoteCount: IdeaInterface['upvoteCount'], newVoteType: IdeaInterface['voteType']) {
        setUpvoteCount(newUpvoteCount);
        setVoteType(newVoteType);
    }

    // Render the component
    return (
        <div className="flex flex-col border-b border-dark-3 py-6 md:flex-row md:space-x-5">
            {/* Voting */}
            <IdeaVoteControl
                display="Desktop"
                className="hidden w-24 shrink-0 md:flex"
                ideaId={properties.id}
                upvoteCount={upvoteCount}
                voteType={voteType}
                onVoteChange={onVoteChange}
            />

            {/* Post */}
            <div className="flex-grow">
                {/* Title and Topics */}
                <div className="">
                    {/* Title */}
                    <Link href={ideaUrlPath}>
                        <h4 className="inline font-medium">{properties.title}</h4>
                    </Link>

                    {/* Topics */}
                    {properties.topics.map(function (topic) {
                        return (
                            <Link
                                href="/"
                                key={topic}
                                className={
                                    // Layout
                                    'ml-1.5 rounded-lg border px-1.5 align-text-top text-sm leading-4 transition-colors ' +
                                    // Light
                                    'border-purple-500 bg-purple-200 text-purple-500 hover:border-purple-600 hover:bg-purple-300 hover:text-purple-500 ' +
                                    // Dark
                                    'dark:border-purple-500 dark:bg-purple-700 dark:text-purple-200 dark:hover:border-purple-400 dark:hover:bg-purple-600 dark:hover:text-purple-100'
                                }
                            >
                                {topic}
                            </Link>
                        );
                    })}
                </div>

                {/* Description */}
                <p className="mt-2.5">{properties.description}</p>

                {/* Reactions */}
                <IdeaReactions className="mt-3.5 flex space-x-1.5" />

                {/* Controls */}
                <IdeaControls
                    className="mt-3"
                    id={properties.id}
                    identifier={properties.identifier}
                    upvoteCount={upvoteCount}
                    voteType={voteType}
                    submittedByUsername={properties.submittedByUsername}
                    onVoteChange={onVoteChange}
                />
            </div>
        </div>
    );
}

// Export - Default
export default Idea;
