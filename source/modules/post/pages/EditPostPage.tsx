'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
import { Card } from '@structure/source/components/containers/Card';

// Dependencies - API
import { PostUpdateOperation, PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - EditPostPage
export interface EditPostPageProperties {
    postIdentifier: string;
}
export function EditPostPage(properties: EditPostPageProperties) {
    // Render the component
    return (
        <div className="container items-center justify-center pt-8 pb-32">
            <h1 className="text-xl font-medium">Edit Post</h1>

            <Card variant="A" className="mt-4">
                <GraphQlMutationForm
                    className="flex flex-col gap-4"
                    operation={PostUpdateOperation}
                    excludedFields={['input.contentType', 'input.metadata']}
                    fieldProperties={{
                        'input.description': { rows: 4 },
                        'input.content': { rows: 16 },
                    }}
                    defaultValuesGraphQlQuery={{
                        document: PostDocument,
                        variables: {
                            identifier: properties.postIdentifier,
                        },
                    }}
                    submitButtonProperties={{ children: 'Save' }}
                />
            </Card>
        </div>
    );
}
