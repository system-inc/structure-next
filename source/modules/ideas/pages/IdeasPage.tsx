'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { IdeaControl } from '@structure/source/modules/ideas/pages/IdeaControl';
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { IdeasDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import SupportIcon from '@structure/assets/icons/communication/SupportIcon.svg';
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';
import ReactionIcon from '@structure/assets/icons/people/ReactionIcon.svg';
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';

// Component - IdeasPage
export interface IdeasPageInterface {}
export function IdeasPage(properties: IdeasPageInterface) {
    // Hooks
    const { addNotice } = useNotice();
    const ideasQueryState = useQuery(IdeasDocument, {
        variables: {
            // pagination: {
            //     itemsPerPage: 10,
            // },
        },
    });

    const ideas: {
        id: string;
        identifier: string;
        title: string;
        description: string;
        upvotes: number;
        views: number;
        submittedByDisplayName: string;
        submittedByUsername: string;
        createdAt: string;
        updatedAt: string;
        topics: string[];
    }[] = [];

    ideasQueryState.data?.articlesMine.items.forEach(function (idea) {
        ideas.push({
            id: idea.id,
            identifier: 'slug',
            title: idea.title,
            // description: idea.content,
            // Truncate description
            description: idea.content.substring(0, 500) + '...',
            upvotes: 10,
            views: 100,
            submittedByDisplayName: 'Bill',
            submittedByUsername: 'bill',
            createdAt: idea.createdAt,
            updatedAt: idea.updatedAt,
            topics: ['Stack', 'Supplements'].map(function (topic) {
                return topic;
            }),
        });
    });

    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            {ideasQueryState.loading && <div>Loading...</div>}
            {ideasQueryState.error && <div>Error: {ideasQueryState.error.message}</div>}

            <div className="float-end">
                <Button
                    className="pl-3"
                    icon={PlusIcon}
                    iconPosition="left"
                    iconClassName="w-3 h-3"
                    href="/ideas/submit"
                >
                    Submit an Idea
                </Button>
            </div>

            <h1 className="mb-8">Ideas</h1>

            <p>
                ( Popular Ideas | Trending Ideas | New Ideas ) - use github issues filters
                https://github.com/reactchartjs/react-chartjs-2/issues
            </p>

            <ul className="mt-4">
                {ideas.map(function (idea) {
                    const ideaUrlPath = '/ideas/' + idea.id + '/' + idea.identifier;

                    return (
                        <li
                            key={idea.identifier}
                            className="flex flex-col border-b border-dark-3 py-6 md:flex-row md:space-x-5"
                        >
                            {/* Voting */}
                            <div className="mb-0 hidden flex-col items-center md:flex">
                                {/* Votes */}
                                <div className="w-full rounded-md border border-light-4 bg-light-1 p-4 text-center dark:border-dark-3 dark:bg-dark-1">
                                    <div className="text-2xl">{idea.upvotes}</div>
                                    <div className="text-sm">votes</div>
                                </div>
                                {/* Upvote */}
                                <div className="mb-4 mt-2">
                                    <Button
                                        className="pl-3"
                                        icon={ArrowUpIcon}
                                        iconPosition="left"
                                        iconClassName="w-3 h-3"
                                    >
                                        Upvote
                                    </Button>
                                </div>
                            </div>

                            {/* Post */}
                            <div>
                                {/* Title and Topics */}
                                <div className="">
                                    {/* Title */}
                                    <Link href={ideaUrlPath}>
                                        <h4 className="inline font-medium">{idea.title}</h4>
                                    </Link>

                                    {/* Topics */}
                                    {idea.topics.map(function (topic, index) {
                                        return (
                                            <Link
                                                href="/"
                                                key={topic}
                                                className={
                                                    // Layout
                                                    'ml-1.5 rounded-lg border px-1.5 align-text-top text-sm leading-4 transition-colors ' +
                                                    // Light
                                                    'border-purple-500 bg-purple-200 text-purple-500 hover:border-purple-600 hover:bg-purple-300 hover:text-purple-500 ' +
                                                    // Dark
                                                    'dark:border-purple-500 dark:bg-purple-700 dark:text-purple-200 dark:hover:border-purple-400 dark:hover:bg-purple-600 dark:hover:text-purple-100'
                                                }
                                            >
                                                {topic}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Description */}
                                <p className="mt-2.5">{idea.description}</p>

                                {/* Reactions */}
                                <div className="mt-3.5 flex space-x-1.5">
                                    {[
                                        { content: '🍑', count: 6 },
                                        { content: '🍌', count: 2 },
                                    ].map(function (reaction, reactionIndex) {
                                        return (
                                            <div
                                                key={reactionIndex}
                                                className={
                                                    // Layout
                                                    'flex cursor-pointer select-none items-center space-x-1.5 rounded-lg border px-2.5 ' +
                                                    // Animation
                                                    'transition-colors ' +
                                                    // Light
                                                    'border-light-3 text-dark ' +
                                                    // Dark
                                                    'dark:border-dark-3 dark:bg-dark-1 dark:text-light-2 ' +
                                                    // Hover - Light
                                                    'hover:border-light-4 hover:bg-light-1 hover:text-dark-1 ' +
                                                    // Hover - Dark
                                                    'dark:hover:border-dark-4 dark:hover:bg-dark-2 dark:hover:text-light ' +
                                                    // Active - Light
                                                    'active:border-light-5 active:bg-light-2 active:text-dark-2 ' +
                                                    // Active - Dark
                                                    'dark:active:border-dark-5 dark:active:bg-dark-3 '
                                                }
                                            >
                                                <div className="text-lg">{reaction.content}</div>
                                                <div className="">{reaction.count}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Controls */}
                                <div className="mt-3 flex items-center justify-between space-x-2 text-sm">
                                    <div className="flex select-none items-center">
                                        {/* Vote (Mobile) */}
                                        <IdeaControl className="space-x-1.5 md:hidden">
                                            <ArrowUpIcon className="h-3.5 w-3.5" />
                                            <div className="">{idea.upvotes}</div>
                                        </IdeaControl>

                                        {/* Reactions */}
                                        <PopoverMenu
                                            itemsClassName="grid grid-cols-6 gap-1 text-2xl"
                                            items={[
                                                // Positive
                                                {
                                                    content: '😍',
                                                },
                                                {
                                                    content: '🎉',
                                                },
                                                {
                                                    content: '💯',
                                                },
                                                {
                                                    content: '🚀',
                                                },
                                                {
                                                    content: '❤️‍🔥',
                                                },
                                                {
                                                    content: '👍',
                                                },
                                                // Negative
                                                {
                                                    content: '😢',
                                                },
                                                {
                                                    content: '😡',
                                                },
                                                {
                                                    content: '💔',
                                                },
                                                {
                                                    content: '👿',
                                                },
                                                {
                                                    content: '😠',
                                                },
                                                {
                                                    content: '👎',
                                                },
                                                // Neutral
                                                {
                                                    content: '😐',
                                                },
                                                {
                                                    content: '🤔',
                                                },
                                                {
                                                    content: '😑',
                                                },
                                                {
                                                    content: '🤷',
                                                },
                                                {
                                                    content: '🤨',
                                                },
                                                {
                                                    content: '😕',
                                                },
                                                // Funny
                                                {
                                                    content: '😂',
                                                },
                                                {
                                                    content: '😆',
                                                },
                                                {
                                                    content: '🤣',
                                                },
                                                {
                                                    content: '😜',
                                                },
                                                {
                                                    content: '🤪',
                                                },
                                                {
                                                    content: '😝',
                                                },
                                                // Miscellaneous
                                                {
                                                    content: '🔥',
                                                },
                                                {
                                                    content: '🎯',
                                                },
                                                {
                                                    content: '🎊',
                                                },
                                                {
                                                    content: '😈',
                                                },
                                                {
                                                    content: '🥑',
                                                },
                                                {
                                                    content: '🍑',
                                                },
                                            ]}
                                            popoverProperties={{
                                                side: 'top',
                                            }}
                                        >
                                            <IdeaControl className="">
                                                <ReactionIcon className="h-4 w-4" />
                                            </IdeaControl>
                                        </PopoverMenu>

                                        {/* Comments */}
                                        <IdeaControl className="space-x-1.5" href={ideaUrlPath}>
                                            <CommentIcon className="h-4 w-4" />
                                            <div className="">10</div>
                                        </IdeaControl>

                                        {/* Share */}
                                        <PopoverMenu
                                            items={[
                                                {
                                                    icon: CopyIcon,
                                                    iconPosition: 'left',
                                                    content: 'Copy Link',
                                                    closeMenuOnSelected: true,
                                                    onSelected: function () {
                                                        const link = `${window.location.origin}/ideas/${idea.id}/${idea.identifier}`;

                                                        // Copy the link to the clipboard
                                                        navigator.clipboard.writeText(link);

                                                        addNotice({
                                                            title: 'Copied Link',
                                                            content: link,
                                                        });
                                                    },
                                                },
                                            ]}
                                        >
                                            <IdeaControl className="">
                                                <ShareIcon className="h-4 w-4" />
                                            </IdeaControl>
                                        </PopoverMenu>

                                        <PopoverMenu
                                            items={[
                                                {
                                                    icon: FlagIcon,
                                                    iconPosition: 'left',
                                                    content:
                                                        'Report - this has a popover that has a Report with flag icon which goes through a report flow - see randomseed.com',
                                                    onClick: function () {
                                                        console.log('report');
                                                    },
                                                },
                                            ]}
                                        >
                                            <IdeaControl className="">
                                                <EllipsesIcon className="h-4 w-4" />
                                            </IdeaControl>
                                        </PopoverMenu>
                                    </div>

                                    <div className="flex space-x-1.5">
                                        {/* Time Ago */}
                                        <div className="text-neutral+3 dark:text-neutral">1 year ago by</div>

                                        {/* User Display Name */}
                                        <Link
                                            className="flex items-center space-x-1 text-neutral-6 transition-colors hover:text-dark-6 active:text-dark dark:text-light-3 dark:hover:text-light-2 dark:active:text-light"
                                            href={`/profile/${idea.submittedByUsername}`}
                                        >
                                            {/* Profile Picture */}
                                            <div className="h-4 w-4 rounded-full bg-neutral"></div>
                                            <div>{idea.submittedByUsername}</div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// Export - Default
export default IdeasPage;
