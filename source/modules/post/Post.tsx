'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
import { PostReactions } from '@structure/source/modules/post/controls/PostReactions';
import { PostControls } from '@structure/source/modules/post/controls/PostControls';

// Dependencies - API
import { PostVoteType, PostsQuery } from '@project/source/api/GraphQlGeneratedCode';

// Type - Reactions
export type PostReactionsType = NonNullable<PostsQuery['posts']['items'][0]['reactions']>;

// Component - Post
export interface PostInterface {
    id: string;
    identifier: string;
    aboveTitleNode?: React.ReactNode;
    title: string;
    belowTitleNode?: React.ReactNode;
    slug: string;
    urlPath: string;
    content: string;
    upvoteCount: number;
    voteType: PostVoteType | null | undefined;
    reactions?: PostReactionsType;
    views: number;
    submittedByDisplayName: string;
    submittedByUsername: string;
    createdAt: string;
    updatedAt: string;
    topics: string[];

    // Control Visibility
    voteControl?: boolean;
    reactionControl?: boolean;
    commentControl?: boolean;
    shareControl?: boolean;
    reportControl?: boolean;
}
export function Post(properties: PostInterface) {
    // State
    const [upvoteCount, setUpvoteCount] = React.useState<number>(properties.upvoteCount);
    const [voteType, setVoteType] = React.useState<PostVoteType | null | undefined>(properties.voteType ?? null);
    const [reactions, setReactions] = React.useState<PostReactionsType>(properties.reactions || []);

    // Defaults
    const urlPath = properties.urlPath ?? '/posts/' + properties.identifier + '/' + properties.slug;

    // Function to handle a change in vote count and type
    // We need to do this because we have two vote controls that need to stay synchronized
    function onVoteChange(newUpvoteCount: PostInterface['upvoteCount'], newVoteType: PostInterface['voteType']) {
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
        <div className="flex flex-col border-b border-light-3 py-6 md:flex-row md:space-x-5 dark:border-dark-3">
            {/* Voting */}
            {properties.voteControl && (
                <PostVoteControl
                    display="Desktop"
                    className="hidden w-24 shrink-0 md:flex"
                    ideaId={properties.id}
                    upvoteCount={upvoteCount}
                    voteType={voteType}
                    onVoteChange={onVoteChange}
                />
            )}

            {/* Post */}
            <div className="flex-grow">
                {/* Title and Topics */}
                <div className="">
                    {/* Above Title Node */}
                    {properties.aboveTitleNode}

                    {/* Title */}
                    <Link href={properties.urlPath}>
                        <h4 className="inline font-medium">{properties.title}</h4>
                    </Link>

                    {/* Below Title Node */}
                    {properties.belowTitleNode}

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
                {properties.content && <p className="mt-2.5">{properties.content}</p>}

                {/* Reactions */}
                {reactions.length > 0 && (
                    <PostReactions
                        className="mt-3.5"
                        ideaId={properties.id}
                        reactions={reactions}
                        onReactionCreate={onReactionCreate}
                        onReactionDelete={onReactionDelete}
                    />
                )}

                {/* Controls */}
                <PostControls
                    className="mt-3"
                    id={properties.id}
                    identifier={properties.identifier}
                    title={properties.title}
                    upvoteCount={upvoteCount}
                    voteType={voteType}
                    submittedByUsername={properties.submittedByUsername}
                    createdAt={properties.createdAt}
                    onVoteChange={onVoteChange}
                    onReactionCreate={onReactionCreate}
                    // Control Visibility
                    voteControl={properties.voteControl}
                    reactionControl={properties.reactionControl}
                    commentControl={properties.commentControl}
                    shareControl={properties.shareControl}
                    reportControl={properties.reportControl}
                />
            </div>
        </div>
    );
}

// Export - Default
export default Post;