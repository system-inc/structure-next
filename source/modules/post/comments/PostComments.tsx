'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
// import { PostCommentControls } from '@structure/source/modules/post/comments/controls/PostCommentControls';
import { TimeAgo } from '@structure/source/common/time/TimeAgo';
import { ProfileLink } from '@structure/source/modules/post/ProfileLink';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostComments
export interface PostCommentsProperties {
    className?: string;
}
export function PostComments(properties: PostCommentsProperties) {
    // Render the component
    return (
        <div id="comments" className={mergeClassNames('text-sm', properties.className)}>
            <div>
                <Button icon={PlusIcon} iconPosition="left" iconClassName="w-3 h-3 ml-1">
                    Add a Comment
                </Button>
            </div>
            <div className="mt-4">Sort and search comments</div>

            <div className="mt-8">
                {/* Comment Meta */}
                <div className="flex items-center space-x-1.5">
                    <ProfileLink username={'anonymous'} displayName={'Anonymous'} />
                    <div>&bull;</div>
                    <div className="text-neutral+3 dark:text-neutral">
                        <TimeAgo startTimeInMilliseconds={new Date().getTime()} />
                    </div>
                </div>

                <div className="">
                    {/* Comment Content */}
                    <div className="ml-8 mt-3">This is the first principle of our company.</div>

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
