'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { IdeaInterface } from '@structure/source/modules/idea/common/idea/Idea';
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';
import { IdeaVoteControl } from '@structure/source/modules/idea/common/idea/controls/IdeaVoteControl';
import { IdeaReactionControl } from '@structure/source/modules/idea/common/idea/controls/IdeaReactionControl';
import { IdeaShareControl } from '@structure/source/modules/idea/common/idea/controls/IdeaShareControl';
import { IdeaReportControl } from '@structure/source/modules/idea/common/idea/controls/IdeaReportControl';

// Dependencies - Assets
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { timeAgo } from '@structure/source/utilities/Time';

// Component - IdeaControls
export interface IdeaControlsInterface {
    className?: string;
    id: IdeaInterface['id'];
    identifier: IdeaInterface['identifier'];
    title: IdeaInterface['title'];
    upvoteCount: IdeaInterface['upvoteCount'];
    voteType: IdeaInterface['voteType'];
    createdAt: IdeaInterface['createdAt'];
    submittedByUsername: IdeaInterface['submittedByUsername'];

    onVoteChange: (newUpvoteCount: IdeaInterface['upvoteCount'], newVoteType: IdeaInterface['voteType']) => void;
    onReactionCreate: (content: string) => void;
}
export function IdeaControls(properties: IdeaControlsInterface) {
    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-between space-x-2 text-sm', properties.className)}>
            <div className="flex select-none items-center">
                {/* Voting */}
                <IdeaVoteControl
                    display="Mobile"
                    ideaId={properties.id}
                    upvoteCount={properties.upvoteCount}
                    voteType={properties.voteType}
                    onVoteChange={properties.onVoteChange}
                />

                {/* Reactions */}
                <IdeaReactionControl ideaId={properties.id} onReactionCreate={properties.onReactionCreate} />

                {/* Comments */}
                <IdeaControl className="space-x-1.5" href={'/ideas/' + properties.id + '/' + properties.identifier}>
                    <CommentIcon className="h-4 w-4" />
                    <div className="">10</div>
                </IdeaControl>

                {/* Share */}
                <IdeaShareControl
                    ideaUrl={`${window.location.origin}/ideas/${properties.id}/${properties.identifier}`}
                />

                {/* Report */}
                <IdeaReportControl ideaId={properties.id} ideaTitle={properties.title} />
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
export default IdeaControls;
