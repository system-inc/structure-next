'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { PostProperties } from '@structure/source/modules/post/components/Post';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';

// Dependencies - Assets
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';

// Dependencies - API
import { PostVoteType } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { usePostVoteRequest } from '@structure/source/modules/post/hooks/usePostVoteRequest';
import { usePostUnvoteRequest } from '@structure/source/modules/post/hooks/usePostUnvoteRequest';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
    const postVoteRequest = usePostVoteRequest();
    const postUnvoteRequest = usePostUnvoteRequest();

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
                            'dark:bg-dark-1 w-full rounded-md border border--3 background--2 p-4 text-center',
                            voteType ? 'border-purple-500 dark:border-purple-500' : '',
                        )}
                    >
                        <div className="text-2xl">{upvoteCount}</div>
                        <div className="text-sm">votes</div>
                    </div>
                    {/* Upvote */}
                    <Button
                        className="mt-2 mb-4 w-full pl-3"
                        iconLeft={voteType ? undefined : ArrowUpIcon}
                        onClick={handleVote}
                    >
                        {voteType ? 'Upvoted' : 'Upvote'}
                    </Button>
                </div>
            )}
        </>
    );
}
