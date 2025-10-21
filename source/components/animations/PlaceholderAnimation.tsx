'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PlaceholderAnimation
export type PlaceholderAnimationProperties = {
    className?: string;
};
export function PlaceholderAnimation(properties: PlaceholderAnimationProperties) {
    // Render the component
    return (
        <div
            className={mergeClassNames(
                'rounded-small bg-light-3 dark:bg-dark-2 relative overflow-hidden',
                properties.className,
            )}
        >
            <div className="via-light-4 dark:via-dark-3 absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent"></div>
        </div>
    );
}
