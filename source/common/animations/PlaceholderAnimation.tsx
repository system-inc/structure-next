'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PlaceholderAnimation
export type PlaceholderAnimationProperties = {
    className?: string;
};
export function PlaceholderAnimation(properties: PlaceholderAnimationProperties) {
    // Render the component
    return (
        <div
            className={mergeClassNames(
                'relative overflow-hidden rounded-small bg-light-3 dark:bg-dark-2',
                properties.className,
            )}
        >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-light-4 to-transparent dark:via-dark-3"></div>
        </div>
    );
}
