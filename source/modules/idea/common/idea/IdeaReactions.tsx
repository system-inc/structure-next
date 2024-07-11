'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReactions
export interface IdeaReactionsInterface {
    className?: string;
}
export function IdeaReactions(properties: IdeaReactionsInterface) {
    // Render the component
    return (
        <div className={mergeClassNames(properties.className)}>
            {[
                { content: '🍑', count: 6 },
                { content: '🍌', count: 2 },
            ].map(function (reaction, reactionIndex) {
                return (
                    <div
                        key={reactionIndex}
                        className={
                            // Layout
                            'flex cursor-pointer select-none items-center space-x-1.5 rounded-lg border px-2.5 ' +
                            // Animation
                            'transition-colors ' +
                            // Light
                            'border-light-3 text-dark ' +
                            // Dark
                            'dark:border-dark-3 dark:bg-dark-1 dark:text-light-2 ' +
                            // Hover - Light
                            'hover:border-light-4 hover:bg-light-1 hover:text-dark-1 ' +
                            // Hover - Dark
                            'dark:hover:border-dark-4 dark:hover:bg-dark-2 dark:hover:text-light ' +
                            // Active - Light
                            'active:border-light-5 active:bg-light-2 active:text-dark-2 ' +
                            // Active - Dark
                            'dark:active:border-dark-5 dark:active:bg-dark-3 '
                        }
                    >
                        <div className="text-lg">{reaction.content}</div>
                        <div className="">{reaction.count}</div>
                    </div>
                );
            })}
        </div>
    );
}

// Export - Default
export default IdeaReactions;
