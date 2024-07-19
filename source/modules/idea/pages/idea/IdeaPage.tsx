'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Idea } from '@structure/source/modules/idea/common/idea/Idea';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { IdeaDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - Utilities
import { slug } from '@structure/source/utilities/String';

// Component - IdeaPage
export interface IdeaPageInterface {
    params: {
        ideaIdentifier: string;
        ideaSlug?: string;
    };
}
export function IdeaPage(properties: IdeaPageInterface) {
    // Hooks
    const ideaQueryState = useQuery(IdeaDocument, {
        variables: {
            identifier: properties.params.ideaIdentifier,
        },
    });

    // If there is no idea slug, redirect to the URL with the slug
    if(!properties.params.ideaSlug && ideaQueryState.data?.article) {
        redirect('/ideas/' + properties.params.ideaIdentifier + '/' + slug(ideaQueryState.data.article.title));
    }

    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            <p>Idea Page use github issue page https://github.com/reactchartjs/react-chartjs-2/issues/1219</p>
            {/* Loading */}
            {ideaQueryState.loading && <BrokenCircleIcon className="h-4 w-4 animate-spin" />}
            {/* Error */}
            {ideaQueryState.error && <p>Error: {ideaQueryState.error.message}</p>}
            {/* Data */}
            {ideaQueryState.data && (
                <Idea
                    id={ideaQueryState.data.article.id}
                    identifier={ideaQueryState.data.article.identifier}
                    title={ideaQueryState.data.article.title}
                    description={ideaQueryState.data.article.content}
                    upvoteCount={ideaQueryState.data.article.upvoteCount ?? 0}
                    voteType={ideaQueryState.data.article.voteType}
                    reactions={ideaQueryState.data.article.reactions ?? []}
                    views={100}
                    submittedByDisplayName="Bill"
                    submittedByUsername="bill"
                    createdAt={ideaQueryState.data.article.createdAt}
                    updatedAt={ideaQueryState.data.article.updatedAt}
                    topics={['Stack', 'Supplements']}
                />
            )}
        </div>
    );
}

// Export - Default
export default IdeaPage;
