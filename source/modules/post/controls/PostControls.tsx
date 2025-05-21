'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { PostProperties } from '@structure/source/modules/post/Post';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';
import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
import { PostReactionControl } from '@structure/source/modules/post/controls/PostReactionControl';
import { PostShareControl } from '@structure/source/modules/post/controls/PostShareControl';
import { PostReportControl } from '@structure/source/modules/post/controls/PostReportControl';
import { ProfileLink } from '@structure/source/modules/post/ProfileLink';
import { TimeAgo } from '@structure/source/common/time/TimeAgo';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Assets
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostControls
export interface PostControlsProperties {
    className?: string;
    id: PostProperties['id'];
    identifier: PostProperties['identifier'];
    title: PostProperties['title'];
    urlPath: PostProperties['urlPath'];
    editUrlPath?: string;
    createdByProfileId: PostProperties['createdByProfileId'];
    createdByProfile: PostProperties['createdByProfile'];
    upvoteCount: PostProperties['upvoteCount'];
    voteType: PostProperties['voteType'];
    createdAt: PostProperties['createdAt'];

    // Control Visibility
    largeVoteControl?: boolean;
    voteControl?: boolean;
    reactionControl?: boolean;
    commentControl?: boolean;
    shareControl?: boolean;
    reportControl?: boolean;

    onVoteChange: (newUpvoteCount: PostProperties['upvoteCount'], newVoteType: PostProperties['voteType']) => void;
    onReactionCreate: (content: string) => void;
}
export function PostControls(properties: PostControlsProperties) {
    // Hooks
    const { accountState } = useAccount();
    const urlPath = useUrlPath();

    // Defaults
    const editUrlPath = properties.editUrlPath ?? '/posts/' + properties.id + '/edit';
    const largeVoteControl = properties.largeVoteControl ?? false;
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
                {!largeVoteControl && voteControl && (
                    <PostVoteControl
                        display="Mobile"
                        postId={properties.id}
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
                    <PostControl
                        className="space-x-1.5"
                        href={
                            properties.urlPath +
                            // Add the comments anchor if the current URL path is the same as the post URL path
                            (urlPath == properties.urlPath ? '#comments' : '')
                        }
                    >
                        <CommentIcon className="h-4 w-4" />
                        {/* Comment Count */}
                        {<div className="">0</div>}
                    </PostControl>
                )}

                {/* Share */}
                {shareControl && <PostShareControl url={windowLocationOrigin + properties.urlPath} />}

                {/* Report */}
                {reportControl && <PostReportControl ideaId={properties.id} ideaTitle={properties.title} />}

                {/* Edit */}
                {/* Must be signed in and the current profile must match the creator profile of the post */}
                {accountState.account && accountState.account.profile?.id === properties.createdByProfileId && (
                    <PostControl href={editUrlPath}>Edit</PostControl>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <ProfileLink
                    className="flex-shrink-0"
                    username={properties.createdByProfile?.username ?? 'anonymous'}
                    displayName={properties.createdByProfile?.displayName ?? 'Anonymous'}
                    imageUrls={
                        properties.createdByProfile?.images && properties.createdByProfile?.images.length
                            ? properties.createdByProfile?.images.map(function (image) {
                                  return {
                                      url: image.url!,
                                      //   type: imageUrl.type,
                                      variant: image.variant!,
                                  };
                              })
                            : undefined
                    }
                />

                <div>&bull;</div>

                {/* Time Ago */}
                <div className="text-neutral+3 dark:text-neutral">
                    <TimeAgo
                        startTimeInMilliseconds={new Date(properties.createdAt).getTime()}
                        abbreviatedOnlyAtMobileSize={true}
                    />
                </div>
            </div>
        </div>
    );
}
