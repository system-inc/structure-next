'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { IdeaVoteDocument, IdeaUnvoteDocument, ArticleVoteType } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaVoteControl
export interface IdeaVoteControlInterface {
    className?: string;
    ideaId: string;
    upvoteCount: number;
    upvoted: boolean;
}
export function IdeaVoteControl(properties: IdeaVoteControlInterface) {
    // State
    const [upvoteCount, setUpvoteCount] = React.useState<number>(properties.upvoteCount);
    const [upvoted, setUvoted] = React.useState<boolean>(properties.upvoted ?? false);

    // Hooks
    const [ideaVoteMutation, ideaVoteMutationState] = useMutation(IdeaVoteDocument);
    const [ideaUnvoteMutation, ideaUnvoteMutationState] = useMutation(IdeaUnvoteDocument);

    // Render the component
    return (
        <div className={mergeClassNames('flex-col items-center', properties.className)}>
            {/* Votes */}
            <div
                className={mergeClassNames(
                    'w-full rounded-md border border-light-4 bg-light-1 p-4 text-center transition-colors dark:border-dark-3 dark:bg-dark-1',
                    upvoted ? 'border-purple-500 dark:border-purple-500' : '',
                )}
            >
                <div className="text-2xl">{upvoteCount}</div>
                <div className="text-sm">votes</div>
            </div>
            {/* Upvote */}
            <Button
                className="mb-4 mt-2 w-full pl-3"
                icon={upvoted ? undefined : ArrowUpIcon}
                iconPosition={upvoted ? undefined : 'left'}
                iconClassName={upvoted ? '' : 'w-3 h-3'}
                onClick={function () {
                    // If they have already upvoted, unvote
                    if(upvoted) {
                        // Opportunistically update the UI
                        setUvoted(false);
                        setUpvoteCount(upvoteCount - 1);

                        // Run the unvote mutation in the background
                        ideaUnvoteMutation({
                            variables: {
                                articleId: properties.ideaId,
                            },
                        });
                    }
                    // Otherwise, upvote
                    else {
                        // Opportunistically update the UI
                        setUvoted(true);
                        setUpvoteCount(upvoteCount + 1);

                        // Run the vote mutation in the background
                        ideaVoteMutation({
                            variables: {
                                articleId: properties.ideaId,
                                type: ArticleVoteType.Upvote,
                            },
                        });
                    }
                }}
            >
                {upvoted ? 'Upvoted' : 'Upvote'}
            </Button>
        </div>
    );
}

// Export - Default
export default IdeaVoteControl;
