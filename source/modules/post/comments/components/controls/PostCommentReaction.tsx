'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/components/popovers/Tip';

// Dependencies - API
// import { useQuery, useMutation } from '@apollo/client';
// import // PostCommentReactionProfilesDocument,
// // PostCommentReactionCreateDocument,
// // PostCommentReactionDeleteDocument,
// '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
// import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostCommentReaction
export interface PostCommentReactionProperties {
    className?: string;
    ideaId: string;
    content: string;
    count: number;
    reacted: boolean;
    onReactionCreate: (content: string) => void;
    onReactionDelete: (content: string) => void;
}
export function PostCommentReaction(properties: PostCommentReactionProperties) {
    // State
    const [
        ,
        // tipOpen,
        setTipOpen,
    ] = React.useState<boolean>(false);

    // Hooks
    // const ideaReactionProfilesQueryState = useQuery(PostCommentReactionProfilesDocument, {
    //     skip: !tipOpen,
    //     variables: {
    //         postId: properties.ideaId,
    //         content: properties.content,
    //     },
    // });
    // const [ideaReactionCreateMutation, ideaReactionCreateMutationState] = useMutation(
    //     PostCommentReactionCreateDocument,
    // );
    // const [ideaReactionDeleteMutation, ideaReactionDeleteMutationState] = useMutation(
    //     PostCommentReactionDeleteDocument,
    // );

    // Function to handle clicking on the reaction
    async function handleReaction() {
        // If the user has already done this reaction
        if(properties.reacted) {
            // Opportunistically update the parent component
            properties.onReactionDelete(properties.content);

            // Invoke the mutation to delete the reaction
            // ideaReactionDeleteMutation({
            //     variables: {
            //         postId: properties.ideaId,
            //         content: properties.content,
            //     },
            // });
        }
        // If the user has not done this reaction
        else {
            // Opportunistically update the parent component
            properties.onReactionCreate(properties.content);

            // Invoke the mutation to create the reaction
            // ideaReactionCreateMutation({
            //     variables: {
            //         postId: properties.ideaId,
            //         content: properties.content,
            //     },
            // });
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
                        {/* {ideaReactionProfilesQueryState.loading && (
                            <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                        )} */}

                        {/* Error */}
                        {/* {ideaReactionProfilesQueryState.error && (
                            <div>Error: {ideaReactionProfilesQueryState.error.message}</div>
                        )} */}

                        {/* Profiles */}
                        {/* {ideaReactionProfilesQueryState.data && (
                            <div className="">
                                {ideaReactionProfilesQueryState.data.PostCommentReactionProfiles.items.map(
                                    function (profile, profileIndex) {
                                        return (
                                            <div key={profileIndex} className="">
                                                {profile.username}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )} */}
                    </div>
                </div>
            }
            align="start"
            delayInMilliseconds={1500}
            onOpenChange={function (open) {
                setTipOpen(open);
            }}
            trigger={
                <div
                    className={mergeClassNames(
                        // Layout
                        'flex cursor-pointer items-center space-x-1.5 rounded-lg border px-2.5 select-none',
                        // Light
                        'text-dark border--d',
                        // Dark
                        'dark:bg-dark-1 dark:text-light-2',
                        // Hover - Light
                        'hover:text-dark-1 hover:border--d hover:background--c',
                        // Hover - Dark
                        'dark:hover:border-dark-4 dark:hover:bg-dark-2 dark:hover:text-light',
                        // Active - Light
                        'active:border-light-5 active:bg-light-2 active:text-dark-2',
                        // Active - Dark
                        'dark:active:border-dark-5 dark:active:bg-dark-3',
                        properties.reacted
                            ? 'border-purple-400 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-800'
                            : '',
                        properties.className,
                    )}
                    onClick={handleReaction}
                >
                    <div className="text-lg">{properties.content}</div>
                    <div className="">{properties.count}</div>
                </div>
            }
        />
    );
}
