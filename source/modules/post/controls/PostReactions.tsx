'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PostReactionsType } from '@structure/source/modules/post/Post';
import { PostReaction } from '@structure/source/modules/post/controls/PostReaction';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostReactions
export interface PostReactionsProperties {
    className?: string;
    ideaId: string;
    reactions: PostReactionsType;
    onReactionCreate: (content: string) => void;
    onReactionDelete: (content: string) => void;
}
export function PostReactions(properties: PostReactionsProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('flex space-x-1.5', properties.className)}>
            {properties.reactions?.map(function (reaction, reactionIndex) {
                return (
                    <PostReaction
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
