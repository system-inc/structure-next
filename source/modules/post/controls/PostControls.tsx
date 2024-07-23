'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { PostInterface } from '@structure/source/modules/post/Post';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';
import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
import { PostReactionControl } from '@structure/source/modules/post/controls/PostReactionControl';
import { PostShareControl } from '@structure/source/modules/post/controls/PostShareControl';
import { PostReportControl } from '@structure/source/modules/post/controls/PostReportControl';

// Dependencies - Assets
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { timeAgo } from '@structure/source/utilities/Time';

// Component - PostControls
export interface PostControlsInterface {
    className?: string;
    id: PostInterface['id'];
    identifier: PostInterface['identifier'];
    title: PostInterface['title'];
    upvoteCount: PostInterface['upvoteCount'];
    voteType: PostInterface['voteType'];
    createdAt: PostInterface['createdAt'];
    submittedByUsername: PostInterface['submittedByUsername'];

    onVoteChange: (newUpvoteCount: PostInterface['upvoteCount'], newVoteType: PostInterface['voteType']) => void;
    onReactionCreate: (content: string) => void;
}
export function PostControls(properties: PostControlsInterface) {
    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-between space-x-2 text-sm', properties.className)}>
            <div className="flex select-none items-center">
                {/* Voting */}
                <PostVoteControl
                    display="Mobile"
                    ideaId={properties.id}
                    upvoteCount={properties.upvoteCount}
                    voteType={properties.voteType}
                    onVoteChange={properties.onVoteChange}
                />

                {/* Reactions */}
                <PostReactionControl ideaId={properties.id} onReactionCreate={properties.onReactionCreate} />

                {/* Comments */}
                <PostControl className="space-x-1.5" href={'/ideas/' + properties.id + '/' + properties.identifier}>
                    <CommentIcon className="h-4 w-4" />
                    <div className="">10</div>
                </PostControl>

                {/* Share */}
                <PostShareControl
                    ideaUrl={`${window.location.origin}/ideas/${properties.id}/${properties.identifier}`}
                />

                {/* Report */}
                <PostReportControl ideaId={properties.id} ideaTitle={properties.title} />
            </div>

            <div className="flex space-x-1.5">
                {/* Time Ago */}
                <div className="text-neutral+3 dark:text-neutral">
                    {timeAgo(new Date(properties.createdAt).getTime())} by
                </div>

                {/* User Display Name */}
                <Link
                    className="flex items-center space-x-1 text-neutral-6 transition-colors hover:text-dark-6 active:text-dark dark:text-light-3 dark:hover:text-light-2 dark:active:text-light"
                    href={`/profile/${properties.submittedByUsername}`}
                >
                    {/* Profile Picture */}
                    <div className="h-4 w-4 rounded-full bg-neutral"></div>
                    <div>{properties.submittedByUsername}</div>
                </Link>
            </div>
        </div>
    );
}

// Export - Default
export default PostControls;
