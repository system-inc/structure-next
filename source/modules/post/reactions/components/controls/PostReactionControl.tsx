'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { usePostReactionCreateRequest } from '@structure/source/modules/post/reactions/hooks/usePostReactionCreateRequest';

// Dependencies - Assets
import ReactionIcon from '@structure/assets/icons/people/ReactionIcon.svg';

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostReactionControl
export interface PostReactionControlProperties {
    ideaId: string;
    className?: string;
    onReactionCreate: (content: string) => void;
}
export function PostReactionControl(properties: PostReactionControlProperties) {
    // Hooks
    const account = useAccount();
    const postReactionCreateRequest = usePostReactionCreateRequest();

    // Function to handle a reaction
    async function handleReaction(content: string) {
        // If the user is signed in
        if(account.data) {
            // Opportunistically update the parent component
            properties.onReactionCreate(content);

            // Invoke the mutation
            postReactionCreateRequest.execute({
                postId: properties.ideaId,
                content: content,
            });
        }
        // If the user is not signed in
        else {
            // Show the sign in dialog
            account.setAuthenticationDialogOpen(true);
        }
    }

    // Render the component
    return (
        <PopoverMenu
            itemsClassName="grid grid-cols-6 gap-1 text-2xl"
            onItemSelected={function (item) {
                if(item.content) {
                    handleReaction(item.content.toString());
                }
            }}
            closeOnItemSelected={true}
            items={[
                // Positive
                {
                    content: '😍',
                },
                {
                    content: '🎉',
                },
                {
                    content: '💯',
                },
                {
                    content: '🚀',
                },
                {
                    content: '❤️‍🔥',
                },
                {
                    content: '👍',
                },
                // Negative
                {
                    content: '😢',
                },
                {
                    content: '😡',
                },
                {
                    content: '💔',
                },
                {
                    content: '👿',
                },
                {
                    content: '😠',
                },
                {
                    content: '👎',
                },
                // Neutral
                {
                    content: '😐',
                },
                {
                    content: '🤔',
                },
                {
                    content: '😑',
                },
                {
                    content: '🤷',
                },
                {
                    content: '🤨',
                },
                {
                    content: '😕',
                },
                // Funny
                {
                    content: '😂',
                },
                {
                    content: '😆',
                },
                {
                    content: '🤣',
                },
                {
                    content: '😜',
                },
                {
                    content: '🤪',
                },
                {
                    content: '😝',
                },
                // Miscellaneous
                {
                    content: '🔥',
                },
                {
                    content: '🎯',
                },
                {
                    content: '🎊',
                },
                {
                    content: '😈',
                },
                {
                    content: '🥑',
                },
                {
                    content: '🍑',
                },
            ]}
            popoverProperties={{
                side: 'top',
            }}
        >
            <PostControl className="">
                <ReactionIcon className="h-4 w-4" />
            </PostControl>
        </PopoverMenu>
    );
}
