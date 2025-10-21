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
        <div className={mergeClassNames('relative overflow-hidden rounded-sm', properties.className)}>
            <div className="absolute inset-0 animate-shimmer from-transparent to-transparent"></div>
        </div>
    );
}
