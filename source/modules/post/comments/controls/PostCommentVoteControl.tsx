'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { PostProperties } from '@structure/source/modules/post/Post';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';

// Dependencies - Assets
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { PostVoteType } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentVoteControl
export interface PostCommentVoteControlProperties {
    className?: string;
    display: 'Mobile' | 'Desktop';
    ideaId: string;
    upvoteCount: number;
    voteType?: PostVoteType | null;
    onVoteChange: (newUpvoteCount: PostProperties['upvoteCount'], newVoteType: PostProperties['voteType']) => void;
}
export function PostCommentVoteControl(properties: PostCommentVoteControlProperties) {
    // State
    const [upvoteCount, setUpvoteCount] = React.useState<number>(properties.upvoteCount);
    const [voteType, setVoteType] = React.useState<PostVoteType | null | undefined>(properties.voteType ?? null);

    // Hooks
    const postVoteRequest = networkService.useGraphQlMutation(
        gql(`
            mutation PostVote($postId: String!, $type: PostVoteType!) {
                postVote(postId: $postId, type: $type) {
                    success
                }
            }
        `),
    );
    const postUnvoteRequest = networkService.useGraphQlMutation(
        gql(`
            mutation PostUnvote($postId: String!) {
                postUnvote(postId: $postId) {
                    success
                }
            }
        `),
    );

    // Function to handle voting
    function handleVote() {
        // If they have already upvoted, unvote
        if(voteType) {
            // Opportunistically update the UI
            setUpvoteCount(upvoteCount - 1);
            setVoteType(null);

            // Update the parent component
            properties.onVoteChange(upvoteCount - 1, null);

            // Run the unvote mutation in the background
            postUnvoteRequest.execute({
                postId: properties.ideaId,
            });
        }
        // Otherwise, upvote
        else {
            // Opportunistically update the UI
            setUpvoteCount(upvoteCount + 1);
            setVoteType(PostVoteType.Upvote);

            // Update the parent component
            properties.onVoteChange(upvoteCount + 1, PostVoteType.Upvote);

            // Run the vote mutation in the background
            postVoteRequest.execute({
                postId: properties.ideaId,
                type: PostVoteType.Upvote,
            });
        }
    }

    // Effect to handle vote property changes
    React.useEffect(
        function () {
            // Update the vote count
            setUpvoteCount(properties.upvoteCount);

            // Update the vote type
            setVoteType(properties.voteType);
        },
        [properties.upvoteCount, properties.voteType],
    );

    // Render the component
    return (
        <>
            {/* Mobile */}
            {properties.display === 'Mobile' && (
                <PostControl
                    className={mergeClassNames(
                        'space-x-1.5',
                        voteType ? 'border-purple-500 dark:border-purple-500' : '',
                    )}
                    onClick={handleVote}
                >
                    <ArrowUpIcon className="h-3.5 w-3.5" />
                    <div className="">{upvoteCount}</div>
                </PostControl>
            )}

            {/* Desktop */}
            {properties.display === 'Desktop' && (
                <div className={mergeClassNames('flex-col items-center', properties.className)}>
                    {/* Votes */}
                    <div
                        className={mergeClassNames(
                            'w-full rounded-medium border border-light-4 bg-light-1 p-4 text-center dark:border-dark-3 dark:bg-dark-1',
                            voteType ? 'border-purple-500 dark:border-purple-500' : '',
                        )}
                    >
                        <div className="text-2xl">{upvoteCount}</div>
                        <div className="text-sm">votes</div>
                    </div>
                    {/* Upvote */}
                    <Button
                        className="mb-4 mt-2 w-full pl-3"
                        icon={voteType ? undefined : ArrowUpIcon}
                        iconPosition={voteType ? undefined : 'left'}
                        iconClassName={voteType ? '' : 'w-3 h-3'}
                        onClick={handleVote}
                    >
                        {voteType ? 'Upvoted' : 'Upvote'}
                    </Button>
                </div>
            )}
        </>
    );
}
