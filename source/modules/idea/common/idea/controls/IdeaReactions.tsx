'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { IdeaReactionsType } from '@structure/source/modules/idea/common/idea/Idea';
import { IdeaReaction } from '@structure/source/modules/idea/common/idea/controls/IdeaReaction';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReactions
export interface IdeaReactionsInterface {
    className?: string;
    ideaId: string;
    reactions: IdeaReactionsType;
    onReactionCreate: (content: string) => void;
    onReactionDelete: (content: string) => void;
}
export function IdeaReactions(properties: IdeaReactionsInterface) {
    // Render the component
    return (
        <div className={mergeClassNames('flex space-x-1.5', properties.className)}>
            {properties.reactions?.map(function (reaction, reactionIndex) {
                return (
                    <IdeaReaction
                        key={reactionIndex}
                        ideaId={properties.ideaId}
                        content={reaction.content}
                        count={reaction.count}
                        reacted={reaction.reacted}
                        onReactionCreate={properties.onReactionCreate}
                        onReactionDelete={properties.onReactionDelete}
                    />
                );
            })}
        </div>
    );
}

// Export - Default
export default IdeaReactions;
