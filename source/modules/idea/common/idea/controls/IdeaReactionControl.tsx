'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';

// Dependencies - Assets
import ReactionIcon from '@structure/assets/icons/people/ReactionIcon.svg';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { IdeaReactionCreateDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReactionControl
export interface IdeaReactionControlInterface {
    ideaId: string;
    className?: string;
    onReactionCreate: (content: string) => void;
}
export function IdeaReactionControl(properties: IdeaReactionControlInterface) {
    // Hooks
    const [ideaReactionCreateMutation, ideaReactionCreateMutationState] = useMutation(IdeaReactionCreateDocument);

    // Function to handle a reaction
    async function handleReaction(content: string) {
        // Opportunistically update the parent component
        properties.onReactionCreate(content);

        // Invoke the mutation
        ideaReactionCreateMutation({
            variables: {
                articleId: properties.ideaId,
                content: content,
            },
        });
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
            <IdeaControl className="">
                <ReactionIcon className="h-4 w-4" />
            </IdeaControl>
        </PopoverMenu>
    );
}

// Export - Default
export default IdeaReactionControl;
