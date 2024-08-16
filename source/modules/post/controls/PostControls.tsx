'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PostInterface } from '@structure/source/modules/post/Post';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';
import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
import { PostReactionControl } from '@structure/source/modules/post/controls/PostReactionControl';
import { PostShareControl } from '@structure/source/modules/post/controls/PostShareControl';
import { PostReportControl } from '@structure/source/modules/post/controls/PostReportControl';
import { ProfileLink } from '@structure/source/modules/post/ProfileLink';
import { TimeAgo } from '@structure/source/common/time/TimeAgo';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/AccountProvider';

// Dependencies - Assets
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostControls
export interface PostControlsInterface {
    className?: string;
    id: PostInterface['id'];
    identifier: PostInterface['identifier'];
    title: PostInterface['title'];
    createdByProfileId: PostInterface['createdByProfileId'];
    createdByProfile: PostInterface['createdByProfile'];
    upvoteCount: PostInterface['upvoteCount'];
    voteType: PostInterface['voteType'];
    createdAt: PostInterface['createdAt'];

    // Control Visibility
    voteControl?: boolean;
    reactionControl?: boolean;
    commentControl?: boolean;
    shareControl?: boolean;
    reportControl?: boolean;

    onVoteChange: (newUpvoteCount: PostInterface['upvoteCount'], newVoteType: PostInterface['voteType']) => void;
    onReactionCreate: (content: string) => void;
}
export function PostControls(properties: PostControlsInterface) {
    // Hooks
    const { accountState } = useAccount();

    // Defaults
    const voteControl = properties.voteControl ?? true;
    const reactionControl = properties.reactionControl ?? true;
    const commentControl = properties.commentControl ?? true;
    const shareControl = properties.shareControl ?? true;
    const reportControl = properties.reportControl ?? true;

    const windowLocationOrigin = React.useMemo(function () {
        if(typeof window === 'undefined') return '';
        return window.location.origin;
    }, []);

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-between space-x-2 text-sm', properties.className)}>
            <div className="flex select-none items-center">
                {/* Voting */}
                {voteControl && (
                    <PostVoteControl
                        display="Mobile"
                        ideaId={properties.id}
                        upvoteCount={properties.upvoteCount}
                        voteType={properties.voteType}
                        onVoteChange={properties.onVoteChange}
                    />
                )}

                {/* Reactions */}
                {reactionControl && (
                    <PostReactionControl ideaId={properties.id} onReactionCreate={properties.onReactionCreate} />
                )}

                {/* Comments */}
                {commentControl && (
                    <PostControl className="space-x-1.5" href={'/ideas/' + properties.id + '/' + properties.identifier}>
                        <CommentIcon className="h-4 w-4" />
                        {/* Comment Count */}
                        {false ? <div className="">10</div> : null}
                    </PostControl>
                )}

                {/* Share */}
                {shareControl && (
                    <PostShareControl
                        ideaUrl={`${windowLocationOrigin}/ideas/${properties.id}/${properties.identifier}`}
                    />
                )}

                {/* Report */}
                {reportControl && <PostReportControl ideaId={properties.id} ideaTitle={properties.title} />}

                {/* Edit */}
                {/* Must be signed in and the current profile must match the creator profile of the post */}
                {accountState.account && accountState.account.currentProfile.id === properties.createdByProfileId && (
                    <PostControl href={'/posts/' + properties.identifier + '/edit'}>Edit</PostControl>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <ProfileLink
                    username={properties.createdByProfile?.username ?? 'anonymous'}
                    displayName={properties.createdByProfile?.displayName ?? 'Anonymous'}
                    imageUrls={
                        properties.createdByProfile?.imageUrls && properties.createdByProfile?.imageUrls.length
                            ? properties.createdByProfile?.imageUrls.map(function (imageUrl) {
                                  return {
                                      url: imageUrl.url!,
                                      //   type: imageUrl.type,
                                      variant: imageUrl.variant!,
                                  };
                              })
                            : undefined
                    }
                />

                <div>&bull;</div>

                {/* Time Ago */}
                <div className="text-neutral+3 dark:text-neutral">
                    <TimeAgo startTimeInMilliseconds={new Date(properties.createdAt).getTime()} />
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default PostControls;
