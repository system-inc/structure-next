'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
import { PostReactions } from '@structure/source/modules/post/controls/PostReactions';
import { PostControls } from '@structure/source/modules/post/controls/PostControls';

// Dependencies - API
import { PostVoteType, PostsQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - EditPostPage
export interface EditPostPageInterface {
    className?: string;
    params: {
        postIdentifier: string;
    };
}
export function EditPostPage(properties: EditPostPageInterface) {
    // State

    // Render the component
    return (
        <div className={mergeClassNames('container items-center justify-center pb-32 pt-8', properties.className)}>
            Edit Post Page {properties.params.postIdentifier}
        </div>
    );
}

// Export - Default
export default EditPostPage;
