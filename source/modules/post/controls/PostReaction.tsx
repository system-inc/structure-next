'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/common/popovers/Tip';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import {
    PostReactionProfilesDocument,
    PostReactionCreateDocument,
    PostReactionDeleteDocument,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostReaction
export interface PostReactionProperties {
    className?: string;
    ideaId: string;
    content: string;
    count: number;
    reacted: boolean;
    onReactionCreate: (content: string) => void;
    onReactionDelete: (content: string) => void;
}
export function PostReaction(properties: PostReactionProperties) {
    // State
    const [tipOpen, setTipOpen] = React.useState<boolean>(false);

    // Hooks
    const { accountState, setAuthenticationDialogOpen } = useAccount();
    const ideaReactionProfilesQueryState = useQuery(PostReactionProfilesDocument, {
        skip: !tipOpen,
        variables: {
            postId: properties.ideaId,
            content: properties.content,
            pagination: {
                itemsPerPage: 10,
            },
        },
    });
    const [ideaReactionCreateMutation] = useMutation(PostReactionCreateDocument);
    const [ideaReactionDeleteMutation] = useMutation(PostReactionDeleteDocument);

    // Function to handle clicking on the reaction
    async function handleReaction() {
        // If the user is signed in
        if(accountState.account) {
            // If the user has already done this reaction
            if(properties.reacted) {
                // Opportunistically update the parent component
                properties.onReactionDelete(properties.content);

                // Invoke the mutation to delete the reaction
                ideaReactionDeleteMutation({
                    variables: {
                        postId: properties.ideaId,
                        content: properties.content,
                    },
                });
            }
            // If the user has not done this reaction
            else {
                // Opportunistically update the parent component
                properties.onReactionCreate(properties.content);

                // Invoke the mutation to create the reaction
                ideaReactionCreateMutation({
                    variables: {
                        postId: properties.ideaId,
                        content: properties.content,
                    },
                });
            }
        }
        // If the user is not signed in
        else {
            // Show the sign in dialog
            setAuthenticationDialogOpen(true);
        }
    }

    // Render the component
    return (
        <Tip
            content={
                <div className="flex space-x-4 px-4 py-3.5">
                    {/* Reaction */}
                    <div className="text-5xl">{properties.content}</div>

                    {/* Profiles Query State */}
                    <div className="min-w-32">
                        {/* Loading */}
                        {ideaReactionProfilesQueryState.loading && (
                            <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                        )}

                        {/* Error */}
                        {ideaReactionProfilesQueryState.error && (
                            <div>Error: {ideaReactionProfilesQueryState.error.message}</div>
                        )}

                        {/* Profiles */}
                        {ideaReactionProfilesQueryState.data && (
                            <div className="">
                                {ideaReactionProfilesQueryState.data.postReactionProfiles.items.map(
                                    function (profile, profileIndex) {
                                        return (
                                            <div key={profileIndex} className="">
                                                {profile.username}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </div>
            }
            align="start"
            delayInMilliseconds={1500}
            onOpenChange={function (open) {
                setTipOpen(open);
            }}
        >
            <div
                className={mergeClassNames(
                    // Layout
                    'flex cursor-pointer select-none items-center space-x-1.5 rounded-lg border px-2.5 ' +
                        // Light
                        'border-light-3 ' +
                        // Dark
                        'dark:border-dark-3 ' +
                        // Hover - Light
                        'hover:border-light-4 ' +
                        // Hover - Dark
                        'dark:hover:border-dark-4 dark:hover:bg-dark-2 ' +
                        // Active - Light
                        'active:border-light-6 ' +
                        // Active - Dark
                        'dark:active:border-dark-5 dark:active:bg-dark-3',
                    properties.reacted
                        ? 'border-purple-400 hover:border-purple-500 active:border-purple-600 dark:border-purple-500 dark:hover:border-purple-500 dark:active:border-purple-600'
                        : '',
                    properties.className,
                )}
                onClick={handleReaction}
            >
                <div className="text-lg">{properties.content}</div>
                <div className="">{properties.count}</div>
            </div>
        </Tip>
    );
}
