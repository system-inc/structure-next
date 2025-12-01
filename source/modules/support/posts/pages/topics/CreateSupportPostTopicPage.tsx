'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { PostTopicCreateOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - CreateSupportPostTopicPage
export function CreateSupportPostTopicPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const parentPostTopicId = urlSearchParameters?.get('parentPostTopicId');

    // Render the component
    return (
        <div className="container pt-10 pb-32">
            <h1 className="mb-8">Create Topic</h1>

            <GraphQlMutationForm
                className="mt-6 flex flex-col gap-4"
                operation={PostTopicCreateOperation}
                hiddenFields={{
                    'input.type': 'SupportArticle',
                    ...(parentPostTopicId ? { 'input.parentId': parentPostTopicId } : {}),
                }}
                submitButton={{ children: 'Create Topic' }}
            />
        </div>
    );
}
