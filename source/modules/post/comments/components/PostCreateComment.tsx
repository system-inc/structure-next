'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostCreateComment
export interface PostCreateCommentProperties {
    className?: string;
}
export function PostCreateComment(properties: PostCreateCommentProperties) {
    // Render the component
    return <div className={mergeClassNames('', properties.className)}>Create comment</div>;
}
