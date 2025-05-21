'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { redirect } from 'next/navigation';

// Dependencies - Main Components
// import { Button } from '@structure/source/common/buttons/Button';
// import { Post } from '@structure/source/modules/post/Post';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
// import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { slug } from '@structure/source/utilities/String';

// Component - IdeaPage
export interface IdeaPageProperties {
    params: {
        ideaIdentifier: string;
        ideaSlug?: string;
    };
}
export function IdeaPage(properties: IdeaPageProperties) {
    // Hooks
    const ideaQueryState = useQuery(PostDocument, {
        variables: {
            identifier: properties.params.ideaIdentifier,
        },
    });

    // If there is no idea slug, redirect to the URL with the slug
    if(!properties.params.ideaSlug && ideaQueryState.data?.post) {
        redirect('/ideas/' + properties.params.ideaIdentifier + '/' + slug(ideaQueryState.data.post.title));
    }

    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            <p>Post Page use github issue page https://github.com/reactchartjs/react-chartjs-2/issues/1219</p>
            {/* Loading */}
            {ideaQueryState.loading && <BrokenCircleIcon className="h-4 w-4 animate-spin" />}
            {/* Error */}
            {ideaQueryState.error && <p>Error: {ideaQueryState.error.message}</p>}
            {/* Data */}
            {ideaQueryState.data && (
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

// Export - Default
export default IdeaPage;
