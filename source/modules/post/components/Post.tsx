'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { PostVoteControl } from '@structure/source/modules/post/components/controls/PostVoteControl';
import { PostReactions } from '@structure/source/modules/post/reactions/components/PostReactions';
import { PostControls } from '@structure/source/modules/post/components/controls/PostControls';
import { PostComments } from '@structure/source/modules/post/comments/components/PostComments';

// Dependencies - API
import { PostVoteType, PostsQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Type - Reactions
export type PostReactionsType = NonNullable<PostsQuery['posts']['items'][0]['reactions']>;

// Component - Post
export interface PostProperties {
    className?: string;
    titleContainerClassName?: string;
    titleAndTopicsContainerClassName?: string;
    titleClassName?: string;

    id: string;
    identifier: string;
    nodeFirstChild?: React.ReactNode;
    nodeBeforeTitle?: React.ReactNode;
    title: string;
    nodeBeforeTitleInLink?: React.ReactNode;
    nodeAfterTitleInLink?: React.ReactNode;
    nodeAfterTitle?: React.ReactNode;
    slug: string;
    urlPath: string;
    editUrlPath?: string;
    createdByProfileId: string;
    createdByProfile: PostsQuery['posts']['items'][0]['createdByProfile'];
    content?: PostsQuery['posts']['items'][0]['content'];
    upvoteCount: number;
    voteType: PostVoteType | null | undefined;
    reactions?: PostReactionsType;
    views: number;
    createdAt: string;
    updatedAt: string;
    topics: string[];

    // Control Visibility
    largeVoteControl?: boolean;
    voteControl?: boolean;
    reactionControl?: boolean;
    commentControl?: boolean;
    shareControl?: boolean;
    reportControl?: boolean;

    // Comments
    showComments?: boolean;
}
export function Post(properties: PostProperties) {
    // State
    const [upvoteCount, setUpvoteCount] = React.useState<number>(properties.upvoteCount);
    const [voteType, setVoteType] = React.useState<PostVoteType | null | undefined>(properties.voteType ?? null);
    const [reactions, setReactions] = React.useState<PostReactionsType>(properties.reactions || []);

    // Defaults
    const largeVoteControl = properties.largeVoteControl ?? false;
    const voteControl = properties.voteControl ?? true;
    const reactionControl = properties.reactionControl ?? true;
    const commentControl = properties.commentControl ?? true;
    const shareControl = properties.shareControl ?? true;
    const reportControl = properties.reportControl ?? true;
    const showComments = properties.showComments ?? true;

    // Function to handle a change in vote count and type
    // We need to do this because we have two vote controls that need to stay synchronized
    function onVoteChange(newUpvoteCount: PostProperties['upvoteCount'], newVoteType: PostProperties['voteType']) {
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
        <div>
            {/* Post */}
            <div
                className={mergeClassNames(
                    'border-light-3 dark:border-dark-3 flex flex-col border-b py-6 md:flex-row md:space-x-5',
                    properties.className,
                )}
            >
                {/* Node First Child */}
                {properties.nodeFirstChild}

                {/* Voting */}
                {largeVoteControl && voteControl && (
                    <PostVoteControl
                        display="Desktop"
                        className="hidden w-24 shrink-0 md:flex"
                        postId={properties.id}
                        upvoteCount={upvoteCount}
                        voteType={voteType}
                        onVoteChange={onVoteChange}
                    />
                )}

                <div className="flex-grow">
                    {/* Title and Topics */}
                    <div className={mergeClassNames('', properties.titleContainerClassName)}>
                        {/* Node Before Title */}
                        {properties.nodeBeforeTitle}

                        {/* Title and Topics */}
                        <span
                            className={mergeClassNames(
                                'text-dark-3 dark:text-light',
                                properties.titleAndTopicsContainerClassName,
                            )}
                        >
                            {/* Title */}
                            <Link
                                href={properties.urlPath}
                                className={mergeClassNames('leading-loose', properties.titleClassName)}
                            >
                                {properties.nodeBeforeTitleInLink}
                                <h4 className="inline">{properties.title}</h4>
                                {properties.nodeAfterTitleInLink}
                            </Link>

                            {/* Topics */}
                            {properties.topics.map(function (topic) {
                                return (
                                    <Link
                                        href="/"
                                        key={topic}
                                        className={mergeClassNames(
                                            // Layout
                                            'ml-1.5 rounded-lg border px-1.5 align-text-top text-sm leading-4',
                                            // Light
                                            'border-purple-500 bg-purple-200 text-purple-500 hover:border-purple-600 hover:bg-purple-300 hover:text-purple-500',
                                            // Dark
                                            'dark:border-purple-500 dark:bg-purple-700 dark:text-purple-200 dark:hover:border-purple-400 dark:hover:bg-purple-600 dark:hover:text-purple-100',
                                        )}
                                    >
                                        {topic}
                                    </Link>
                                );
                            })}
                        </span>

                        {/* Node After Title */}
                        {properties.nodeAfterTitle}
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
                        urlPath={properties.urlPath}
                        editUrlPath={properties.editUrlPath}
                        createdByProfileId={properties.createdByProfileId}
                        createdByProfile={properties.createdByProfile}
                        upvoteCount={upvoteCount}
                        voteType={voteType}
                        createdAt={properties.createdAt}
                        onVoteChange={onVoteChange}
                        onReactionCreate={onReactionCreate}
                        // Control Visibility
                        largeVoteControl={largeVoteControl}
                        voteControl={voteControl}
                        reactionControl={reactionControl}
                        commentControl={commentControl}
                        shareControl={shareControl}
                        reportControl={reportControl}
                    />
                </div>
            </div>
            {/* Comments */}
            {showComments && (
                <div>
                    <PostComments className="mt-6" />
                </div>
            )}
        </div>
    );
}
