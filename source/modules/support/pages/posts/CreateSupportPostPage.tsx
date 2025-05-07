'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';

// Dependencies - API
import { PostCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - CreateSupportPostPage
export function CreateSupportPostPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const postTopicId = urlSearchParameters?.get('postTopicId');

    // Render the component
    return (
        <div className="container pb-32 pt-12">
            <h1 className="mb-8">Create Support Article</h1>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostCreateOperation}
                inputComponentsProperties={{
                    'input.status': {
                        className: 'hidden',
                        defaultValue: 'Published',
                    },
                    'input.title': {
                        // defaultValue: 'What if my package is missing?',
                    },
                    'input.type': {
                        className: 'hidden',
                        defaultValue: 'SupportArticle',
                    },
                    'input.slug': {
                        // defaultValue: 'what-if-my-package-is-missing',
                    },
                    'input.description': {
                        // className: 'hidden',
                        // defaultValue: 'Learn how to handle missing packages.',
                    },
                    'input.content': {
                        rows: 8,
                        // defaultValue: 'If your package is missing...',
                    },
                    'input.contentType': {
                        className: 'hidden',
                    },
                    'input.topicIds': {
                        className: 'hidden',
                        defaultValue: postTopicId,
                    },
                    'input.allowComment': {
                        className: 'hidden',
                    },
                    'input.allowVote': {
                        className: 'hidden',
                    },
                    'input.allowDownvote': {
                        className: 'hidden',
                    },
                    'input.allowReaction': {
                        className: 'hidden',
                        defaultValue: 'Checked',
                    },
                    'input.metadata': {
                        className: 'hidden',
                    },
                }}
                buttonProperties={{
                    children: 'Create Article',
                }}
            />
        </div>
    );
}

// Export - Default
export default CreateSupportPostPage;
