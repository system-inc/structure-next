'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';

// Dependencies - API
import { PostTopicCreateOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - CreateSupportPostTopicPage
export function CreateSupportPostTopicPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const parentPostTopicId = urlSearchParameters?.get('parentPostTopicId');

    // Render the component
    return (
        <div className="container pt-10 pb-32">
            <h1 className="mb-8">Create Topic</h1>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostTopicCreateOperation}
                inputComponentsProperties={{
                    'input.type': {
                        defaultValue: 'SupportArticle',
                    },
                    'input.parentId': {
                        defaultValue: parentPostTopicId,
                    },
                }}
                buttonProperties={{
                    children: 'Create Topic',
                }}
            />
        </div>
    );
}
