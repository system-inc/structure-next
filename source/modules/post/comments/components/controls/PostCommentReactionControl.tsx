'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';

// Dependencies - Assets
import ReactionIcon from '@structure/assets/icons/people/ReactionIcon.svg';

// Dependencies - API
import { usePostReactionCreateRequest } from '@structure/source/modules/post/reactions/hooks/usePostReactionCreateRequest';

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentReactionControl
export interface PostCommentReactionControlProperties {
    ideaId: string;
    className?: string;
    onReactionCreate: (content: string) => void;
}
export function PostCommentReactionControl(properties: PostCommentReactionControlProperties) {
    // Hooks
    const postReactionCreateRequest = usePostReactionCreateRequest();

    // Function to handle a reaction
    async function handleReaction(content: string) {
        // Opportunistically update the parent component
        properties.onReactionCreate(content);

        // Invoke the mutation
        postReactionCreateRequest.execute({
            postId: properties.ideaId,
            content: content,
        });
    }

    // Render the component
    return (
        <PopoverMenu
            trigger={
                <PostControl className="">
                    <ReactionIcon className="h-4 w-4" />
                </PostControl>
            }
            itemsClassName="grid grid-cols-6 gap-1 text-2xl"
            onItemSelected={function (item) {
                if(item.value) {
                    handleReaction(item.value.toString());
                }
            }}
            closeOnItemSelected={true}
            items={[
                // Positive
                {
                    value: '😍',
                },
                {
                    value: '🎉',
                },
                {
                    value: '💯',
                },
                {
                    value: '🚀',
                },
                {
                    value: '❤️‍🔥',
                },
                {
                    value: '👍',
                },
                // Negative
                {
                    value: '😢',
                },
                {
                    value: '😡',
                },
                {
                    value: '💔',
                },
                {
                    value: '👿',
                },
                {
                    value: '😠',
                },
                {
                    value: '👎',
                },
                // Neutral
                {
                    value: '😐',
                },
                {
                    value: '🤔',
                },
                {
                    value: '😑',
                },
                {
                    value: '🤷',
                },
                {
                    value: '🤨',
                },
                {
                    value: '😕',
                },
                // Funny
                {
                    value: '😂',
                },
                {
                    value: '😆',
                },
                {
                    value: '🤣',
                },
                {
                    value: '😜',
                },
                {
                    value: '🤪',
                },
                {
                    value: '😝',
                },
                // Miscellaneous
                {
                    value: '🔥',
                },
                {
                    value: '🎯',
                },
                {
                    value: '🎊',
                },
                {
                    value: '😈',
                },
                {
                    value: '🥑',
                },
                {
                    value: '🍑',
                },
            ]}
            popoverProperties={{
                side: 'top',
            }}
        />
    );
}
