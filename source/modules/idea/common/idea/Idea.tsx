'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { IdeaVoteControl } from '@structure/source/modules/idea/common/idea/controls/IdeaVoteControl';
import { IdeaReactions } from '@structure/source/modules/idea/common/idea/IdeaReactions';
import { IdeaControls } from '@structure/source/modules/idea/common/idea/controls/IdeaControls';

// Component - Idea
export interface IdeaInterface {
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
}
export function Idea(properties: IdeaInterface) {
    // The URL path for the idea
    const ideaUrlPath = '/ideas/' + properties.id + '/' + properties.identifier;

    // Render the component
    return (
        <div className="flex flex-col border-b border-dark-3 py-6 md:flex-row md:space-x-5">
            {/* Voting */}
            <IdeaVoteControl
                className="hidden w-24 shrink-0 md:flex"
                ideaId={properties.id}
                upvoteCount={properties.upvoteCount}
                upvoted={properties.upvoted}
            />

            {/* Post */}
            <div>
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
                <IdeaControls className="mt-3" idea={properties} />
            </div>
        </div>
    );
}

// Export - Default
export default Idea;
