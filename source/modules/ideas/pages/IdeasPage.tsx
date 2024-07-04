'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

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

// Component - IdeasPage
export interface IdeasPageInterface {}
export function IdeasPage(properties: IdeasPageInterface) {
    // Hooks
    const ideasQueryState = useQuery(IdeasDocument, {
        variables: {
            // pagination: {
            //     itemsPerPage: 10,
            // },
        },
    });

    const ideas = [
        {
            identifier: 'setting-to-enable-timestamps-on-each-chat-message-with-a-companion',
            title: 'Add a setting to enable timestamps on each chat message with a companion',
            description:
                'This allows the AI to provide more contextually relevant responses by knowing when the user sent a message.',
            upvotes: 12,
            views: 1542,
            submittedByDisplayName: 'Kirk Ouimet',
            submittedByUsername: 'kirkouimet',
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            topics: ['AI', 'Chat'],
        },
    ];

    ideasQueryState.data?.articlesMine.items.forEach(function (idea) {
        ideas.push({
            identifier: idea.id,
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
            topics: ['Topic 1'].map(function (topic) {
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
                    return (
                        <li
                            key={idea.identifier}
                            className="flex flex-col border-b border-dark-3 py-6 md:flex-row md:space-x-5"
                        >
                            {/* Voting */}
                            <div className="mb-0 hidden flex-col items-center md:flex">
                                {/* Votes */}
                                <div className="w-full rounded-md border border-dark-3 bg-dark-1 p-4 text-center">
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
                                    <Link href="/">
                                        <h4 className="inline font-medium">{idea.title}</h4>
                                    </Link>

                                    {/* Topics */}
                                    {idea.topics.map(function (topic, index) {
                                        return (
                                            <Link
                                                href="/"
                                                key={topic}
                                                className="ml-1.5 rounded-lg border border-purple-500 bg-purple-700 px-1.5 align-text-top text-sm leading-4 text-purple-200 hover:border-purple-400 hover:bg-purple-600 hover:text-purple-100"
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
                                    <div className="flex cursor-pointer select-none items-center space-x-1.5 rounded-lg border border-dark-3 bg-dark-1 px-2.5 text-light-2 hover:bg-dark-2 hover:text-light">
                                        <div className="text-lg">🍑</div>
                                        <div className="">6</div>
                                    </div>
                                    <div className="flex cursor-pointer select-none items-center space-x-1.5 rounded-lg border border-dark-3 bg-dark-1 px-2.5 text-light-2 hover:bg-dark-2 hover:text-light">
                                        <div className="text-lg">🍌</div>
                                        <div className="">2</div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="mt-3 flex items-center justify-between space-x-2 text-sm">
                                    <div className="flex items-center space-x-1">
                                        {/* Vote (Mobile) */}
                                        <div className="group flex cursor-pointer items-center space-x-1.5 rounded-lg border border-transparent px-2 py-1.5 hover:border-dark-3 hover:bg-dark-2 md:hidden">
                                            <ArrowUpIcon className="h-3.5 w-3.5" />
                                            <div className="">{idea.upvotes}</div>
                                        </div>

                                        {/* Reactions */}
                                        <div className="group flex cursor-pointer items-center rounded-lg border border-transparent px-2 py-1.5 hover:border-dark-3 hover:bg-dark-2">
                                            <ReactionIcon className="h-4 w-4" />
                                        </div>

                                        <div className="group flex cursor-pointer items-center space-x-1 rounded-lg border border-transparent px-2 py-1.5 hover:border-dark-3 hover:bg-dark-2">
                                            <CommentIcon className="h-4 w-4" />
                                            <div className="">10</div>
                                        </div>

                                        <div className="group flex cursor-pointer items-center space-x-1 rounded-lg border border-transparent px-2 py-1.5 hover:border-dark-3 hover:bg-dark-2">
                                            <ShareIcon className="h-4 w-4" />
                                            <p>this has a popover that has a Copy Link menu item and a notice</p>
                                        </div>

                                        <div className="group flex cursor-pointer items-center space-x-1 rounded-lg border border-transparent px-2 py-1.5 hover:border-dark-3 hover:bg-dark-2">
                                            <EllipsesIcon className="h-4 w-4" />
                                            <p>
                                                this has a popover that has a Report with flag icon which goes through a
                                                report flow - see randomseed.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        {/* Time Ago */}
                                        <div className="text-neutral">1 year ago by</div>

                                        {/* User Display Name */}
                                        <Link
                                            className="flex items-center space-x-1 text-light-3 hover:text-light"
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
