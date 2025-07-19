'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

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
    const { accountState, setAuthenticationDialogOpen } = useAccount();
    const postReactionCreateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation PostReactionCreate($postId: String!, $content: String!) {
                postReactionCreate(postId: $postId, content: $content) {
                    success
                }
            }
        `),
    );

    // Function to handle a reaction
    async function handleReaction(content: string) {
        // If the user is signed in
        if(accountState.account) {
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
            setAuthenticationDialogOpen(true);
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
