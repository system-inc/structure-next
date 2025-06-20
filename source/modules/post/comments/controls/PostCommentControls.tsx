'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PostProperties } from '@structure/source/modules/post/Post';
import { PostCommentControl } from '@structure/source/modules/post/comments/controls/PostCommentControl';
import { PostCommentVoteControl } from '@structure/source/modules/post/comments/controls/PostCommentVoteControl';
import { PostCommentReactionControl } from '@structure/source/modules/post/comments/controls/PostCommentReactionControl';
import { PostCommentShareControl } from '@structure/source/modules/post/comments/controls/PostCommentShareControl';
import { PostCommentReportControl } from '@structure/source/modules/post/comments/controls/PostCommentReportControl';

// Dependencies - Assets
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentControls
export interface PostCommentControlsProperties {
    className?: string;
    id: PostProperties['id'];
    identifier: PostProperties['identifier'];
    title: PostProperties['title'];
    upvoteCount: PostProperties['upvoteCount'];
    // downvoteCount: PostInterface['downvoteCount'];
    voteType: PostProperties['voteType'];
    // createdAt: PostInterface['createdAt'];
    // submittedByUsername: PostInterface['submittedByUsername'];

    // Control Visibility
    voteControl?: boolean;
    reactionControl?: boolean;
    commentControl?: boolean;
    shareControl?: boolean;
    reportControl?: boolean;

    onVoteChange: (newUpvoteCount: PostProperties['upvoteCount'], newVoteType: PostProperties['voteType']) => void;
    onReactionCreate: (content: string) => void;
}
export function PostCommentControls(properties: PostCommentControlsProperties) {
    const windowLocationOrigin = React.useMemo(function () {
        if(typeof window === 'undefined') return '';
        return window.location.origin;
    }, []);

    // Defaults
    const voteControl = properties.voteControl ?? true;
    const reactionControl = properties.reactionControl ?? true;
    const commentControl = properties.commentControl ?? true;
    const shareControl = properties.shareControl ?? true;
    const reportControl = properties.reportControl ?? true;

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-between space-x-2 text-sm', properties.className)}>
            <div className="flex select-none items-center">
                {/* Voting */}
                {voteControl && (
                    <PostCommentVoteControl
                        display="Mobile"
                        ideaId={properties.id}
                        upvoteCount={properties.upvoteCount}
                        voteType={properties.voteType}
                        onVoteChange={properties.onVoteChange}
                    />
                )}

                {/* Reactions */}
                {reactionControl && (
                    <PostCommentReactionControl ideaId={properties.id} onReactionCreate={properties.onReactionCreate} />
                )}

                {/* Comments */}
                {commentControl && (
                    <PostCommentControl
                        className="space-x-1.5"
                        href={'/ideas/' + properties.id + '/' + properties.identifier}
                    >
                        <CommentIcon className="h-4 w-4" />
                        <div className="">Reply</div>
                    </PostCommentControl>
                )}

                {/* Share */}
                {shareControl && (
                    <PostCommentShareControl
                        ideaUrl={`${windowLocationOrigin}/ideas/${properties.id}/${properties.identifier}`}
                    />
                )}

                {/* Report */}
                {reportControl && <PostCommentReportControl ideaId={properties.id} ideaTitle={properties.title} />}

                {/* Edit */}
                <PostCommentControl href={'/posts/' + properties.identifier + '/edit'}>
                    Edit (limit to authors only)
                </PostCommentControl>
            </div>
        </div>
    );
}
