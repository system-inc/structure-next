'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { redirect } from '@structure/source/router/Navigation';

// Dependencies - Main Components
// import { Button } from '@structure/source/common/buttons/Button';
// import { Post } from '@structure/source/modules/post/Post';

// Dependencies - API
import { usePostRequest } from '@structure/source/modules/post/hooks/usePostRequest';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
// import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { slug } from '@structure/source/utilities/type/String';

// Component - IdeaPage
export interface IdeaPageProperties {
    ideaIdentifier: string;
    ideaSlug?: string;
}
export function IdeaPage(properties: IdeaPageProperties) {
    // Hooks
    const postRequest = usePostRequest({
        identifier: properties.ideaIdentifier,
    });

    // If there is no idea slug, redirect to the URL with the slug
    if(!properties.ideaSlug && postRequest.data?.post) {
        redirect('/ideas/' + properties.ideaIdentifier + '/' + slug(postRequest.data.post.title));
    }

    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            <p>Post Page use github issue page https://github.com/reactchartjs/react-chartjs-2/issues/1219</p>
            {/* Loading */}
            {postRequest.isLoading && <BrokenCircleIcon className="h-4 w-4 animate-spin" />}
            {/* Error */}
            {postRequest.error && <p>Error: {postRequest.error.message}</p>}
            {/* Data */}
            {postRequest.data && (
                <div>data</div>
                // <Post
                //     id={ideaQueryState.data.post.id}
                //     identifier={ideaQueryState.data.post.identifier}
                //     title={ideaQueryState.data.post.title}
                //     content={ideaQueryState.data.post.content}
                //     upvoteCount={ideaQueryState.data.post.upvoteCount ?? 0}
                //     voteType={ideaQueryState.data.post.voteType}
                //     reactions={ideaQueryState.data.post.reactions ?? []}
                //     views={100}
                //     submittedByDisplayName="Bill"
                //     submittedByUsername="bill"
                //     createdAt={ideaQueryState.data.post.createdAt}
                //     updatedAt={ideaQueryState.data.post.updatedAt}
                //     topics={['Stack', 'Supplements']}
                // />
            )}
        </div>
    );
}
