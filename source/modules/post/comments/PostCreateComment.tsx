'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCreateComment
export interface PostCreateCommentInterface {
    className?: string;
}
export function PostCreateComment(properties: PostCreateCommentInterface) {
    // Render the component
    return <div className={mergeClassNames('', properties.className)}>Create comment</div>;
}

// Export - Default
export default PostCreateComment;
