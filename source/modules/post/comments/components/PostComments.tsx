'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
// import { PostCommentControls } from '@structure/source/modules/post/comments/controls/PostCommentControls';
import { TimeAgo } from '@structure/source/components/time/TimeAgo';
import { ProfileLink } from '@structure/source/modules/post/components/ProfileLink';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostComments
export interface PostCommentsProperties {
    className?: string;
}
export function PostComments(properties: PostCommentsProperties) {
    // Render the component
    return (
        <div id="comments" className={mergeClassNames('text-sm', properties.className)}>
            <div>
                <Button iconLeft={PlusIcon} className="pl-3">
                    Add a Comment
                </Button>
            </div>
            <div className="mt-4">Sort and search comments</div>

            <div className="mt-8">
                {/* Comment Meta */}
                <div className="flex items-center space-x-1.5">
                    <ProfileLink username={'anonymous'} displayName={'Anonymous'} />
                    <div>&bull;</div>
                    <div className="content--2">
                        <TimeAgo startTimeInMilliseconds={new Date().getTime()} />
                    </div>
                </div>

                <div className="">
                    {/* Comment Content */}
                    <div className="mt-3 ml-8">This is the first principle of our company.</div>

                    {/* Comment Controls */}
                    {/* <PostCommentControls
                        className="ml-6 mt-2"
                        id="1"
                        identifier="1"
                        title="First Principle"
                        upvoteCount={0}
                        // voteType={}
                    /> */}
                </div>
            </div>
        </div>
    );
}
