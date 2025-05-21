'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostComment
export interface PostCommentProperties {
    className?: string;
}
export function PostComment(properties: PostCommentProperties) {
    // Render the component
    return <div className={mergeClassNames('', properties.className)}>Comment</div>;
}
