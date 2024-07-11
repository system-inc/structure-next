'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';

// Dependencies - Assets
import ReactionIcon from '@structure/assets/icons/people/ReactionIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReactionControl
export interface IdeaReactionControlInterface {
    className?: string;
}
export function IdeaReactionControl(properties: IdeaReactionControlInterface) {
    // Render the component
    return (
        <PopoverMenu
            itemsClassName="grid grid-cols-6 gap-1 text-2xl"
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
