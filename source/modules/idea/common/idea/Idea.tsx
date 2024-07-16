'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { IdeaVoteControl } from '@structure/source/modules/idea/common/idea/controls/IdeaVoteControl';
import { IdeaReactions } from '@structure/source/modules/idea/common/idea/controls/IdeaReactions';
import { IdeaControls } from '@structure/source/modules/idea/common/idea/controls/IdeaControls';

// Dependencies - API
import { ArticleVoteType, IdeasQuery } from '@project/source/api/GraphQlGeneratedCode';

// Type - Reactions
export type IdeaReactionsType = NonNullable<IdeasQuery['articlesMine']['items'][0]['reactions']>;

// Component - Idea
export interface IdeaInterface {
    id: string;
    identifier: string;
    title: string;
    description: string;
    upvoteCount: number;
    voteType: ArticleVoteType | null | undefined;
    reactions: IdeaReactionsType;
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
    const [reactions, setReactions] = React.useState<IdeaReactionsType>(properties.reactions || []);

    // The URL path for the idea
    const ideaUrlPath = '/ideas/' + properties.id + '/' + properties.identifier;

    // Function to handle a change in vote count and type
    // We need to do this because we have two vote controls that need to stay synchronized
    function onVoteChange(newUpvoteCount: IdeaInterface['upvoteCount'], newVoteType: IdeaInterface['voteType']) {
        setUpvoteCount(newUpvoteCount);
        setVoteType(newVoteType);
    }

    // Function to handle a new reaction
    function onReactionCreate(content: string) {
        // console.log('reaction', content);

        // Keep track of whether the reaction exists
        let reactionExists = false;

        // Create a new state for the reactions
        const updatedReactions = reactions.map(function (reaction) {
            // If a reaction with this content already exists
            if(reaction.content === content) {
                reactionExists = true;

                // If the user has already done this reaction
                if(reaction.reacted) {
                    // Do nothing
                    return reaction;
                }
                // If the user has not done this reaction
                else {
                    // Increment the count and set the reacted boolean
                    return {
                        ...reaction,
                        count: reaction.count + 1,
                        reacted: true,
                    };
                }
            }
            // Not the reaction we are looking for
            else {
                return reaction;
            }
        });

        // If the reaction does not exist
        if(!reactionExists) {
            // Add the reaction
            updatedReactions.push({
                content: content,
                count: 1,
                reacted: true,
            });
        }

        // Update the state
        setReactions(updatedReactions);
    }

    // Function to handle deleting a reaction
    function onReactionDelete(content: string) {
        // console.log('reaction delete', content);

        // Create a new state for the reactions
        const updatedReactions = reactions.map(function (reaction) {
            // If a reaction with this content already exists
            if(reaction.content === content) {
                // If the user has already done this reaction
                if(reaction.reacted) {
                    const newReactionCount = reaction.count - 1;

                    // Decrement the count and set the reacted boolean
                    return {
                        ...reaction,
                        count: newReactionCount,
                        reacted: newReactionCount > 0 ? false : reaction.reacted,
                    };
                }
                // If the user has not done this reaction
                else {
                    // Do nothing
                    return reaction;
                }
            }
            // Not the reaction we are looking for
            else {
                return reaction;
            }
        });

        // Filter out reactions with a count of 0
        const newReactions = updatedReactions.filter((reaction) => reaction.count > 0);

        // Update the state
        setReactions(newReactions);
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
                {reactions.length > 0 && (
                    <IdeaReactions
                        className="mt-3.5"
                        ideaId={properties.id}
                        reactions={reactions}
                        onReactionCreate={onReactionCreate}
                        onReactionDelete={onReactionDelete}
                    />
                )}

                {/* Controls */}
                <IdeaControls
                    className="mt-3"
                    id={properties.id}
                    identifier={properties.identifier}
                    upvoteCount={upvoteCount}
                    voteType={voteType}
                    submittedByUsername={properties.submittedByUsername}
                    onVoteChange={onVoteChange}
                    onReactionCreate={onReactionCreate}
                />
            </div>
        </div>
    );
}

// Export - Default
export default Idea;
