'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { gql } from '@structure/source/services/network/NetworkService';
import { PostUpdateOperation, PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// GraphQL Operations
gql(`
    mutation PostUpdate($id: String!, $input: PostUpdateInput!) {
        postUpdate(id: $id, input: $input) {
            id
            status
            title
            contentType
            content
            settings
            upvoteCount
            downvoteCount
            metadata
            updatedAt
            createdAt
        }
    }
`);

// Component - EditPostPage
export interface EditPostPageProperties {
    postIdentifier: string;
    className?: string;
}
export function EditPostPage(properties: EditPostPageProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('container items-center justify-center pt-8 pb-32', properties.className)}>
            <h1 className="mb-6">Edit Post</h1>
            <GraphQlMutationForm
                className="flex flex-col gap-4"
                operation={PostUpdateOperation}
                excludedFields={['input.contentType', 'input.metadata']}
                fieldProperties={{
                    'input.content': { rows: 16 },
                    'input.description': { rows: 4 },
                }}
                defaultValuesQuery={{
                    document: PostDocument,
                    variables: {
                        identifier: properties.postIdentifier,
                    },
                }}
                submitButton={{ children: 'Save Changes' }}
            />
        </div>
    );
}
