'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { PostCreateOperation, PostStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - CreateSupportPostPage
export function CreateSupportPostPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const postTopicId = urlSearchParameters?.get('postTopicId');

    // Render the component
    return (
        <div className="container pt-10 pb-32">
            <h1 className="mb-8">Create Support Article</h1>

            <GraphQlMutationForm
                className="mt-6 flex flex-col gap-4"
                operation={PostCreateOperation}
                hiddenFields={{
                    'input.status': PostStatus.Published,
                    'input.type': 'SupportArticle',
                    'input.allowReaction': true,
                    ...(postTopicId ? { 'input.topicIds': [postTopicId] } : {}),
                }}
                excludedFields={[
                    'input.contentType',
                    'input.allowComment',
                    'input.allowVote',
                    'input.allowDownvote',
                    'input.metadata',
                ]}
                fieldProperties={{
                    'input.content': { rows: 8 },
                    'input.description': { rows: 4 },
                }}
                submitButton={{ children: 'Create Article' }}
            />
        </div>
    );
}
