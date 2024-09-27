'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/GraphQlOperationForm';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - API
import { PostCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - CreateSupportArticlePage
export function CreateSupportArticlePage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const postTopicId = urlSearchParameters.get('postTopicId');

    // Render the component
    return (
        <div className="container pb-32 pt-12">
            <h1 className="mb-8">Create Support Article</h1>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostCreateOperation}
                inputComponentsProperties={{
                    'input.status': {
                        defaultValue: 'Published',
                    },
                    'input.title': {
                        component: FormInputText,
                        defaultValue: 'What if my package is missing?',
                    },
                    'input.type': {
                        defaultValue: 'SupportArticle',
                    },
                    'input.slug': {
                        component: FormInputText,
                        defaultValue: 'what-if-my-package-is-missing',
                    },
                    'input.description': {
                        // className: 'hidden',
                        defaultValue: 'Learn how to handle missing packages.',
                    },
                    'input.content': {
                        component: FormInputTextArea,
                        rows: 8,
                        defaultValue: 'If your package is missing...',
                    },
                    'input.topicIds': {
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
                        // className: 'hidden',
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
export default CreateSupportArticlePage;
