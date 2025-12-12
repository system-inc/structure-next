'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
import { Card } from '@structure/source/components/containers/Card';

// Dependencies - API
import { PostTopicCreateOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { usePostTopicByIdRequest } from '@structure/source/modules/post/hooks/usePostTopicByIdRequest';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';
import { slug } from '@structure/source/utilities/type/String';

// Component - CreatePostTopicPage
export function CreatePostTopicPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const parentPostTopicId = urlSearchParameters?.get('parentPostTopicId');

    // Query for parent topic data if parentPostTopicId is provided
    const parentPostTopicByIdRequest = usePostTopicByIdRequest(
        { id: parentPostTopicId ?? '' },
        { enabled: !!parentPostTopicId },
    );
    const parentPostTopic = parentPostTopicByIdRequest.data?.postTopicById;

    // Render the component
    return (
        <div className="container items-center justify-center pt-8 pb-32">
            <h1 className="text-xl">{parentPostTopic ? 'Create Sub Topic' : 'Create Topic'}</h1>

            {/* Show parent topic context */}
            {parentPostTopic && (
                <p className="mt-2 text-sm content--4">
                    Under <span className="font-medium content--2">{parentPostTopic.title}</span>
                </p>
            )}

            <Card variant="A" className="mt-4">
                <GraphQlMutationForm
                    showPreviewGraphQlMutationTip={true}
                    className="flex flex-col gap-4"
                    operation={PostTopicCreateOperation}
                    schema={schema.object({
                        'input.title': schema.string(),
                        'input.slug': schema.string(),
                        'input.description': schema.string().maximumLength(128),
                    })}
                    fieldProperties={{
                        'input.title': {
                            order: 1,
                            tip: 'The topic name displayed in navigation and headings.',
                        },
                        'input.slug': {
                            order: 2,
                            tip: 'The URL-friendly identifier used in the topic link.',
                        },
                        'input.description': {
                            order: 3,
                            tip: 'A brief summary of what this topic covers.',
                        },
                    }}
                    linkedFields={[{ sourceField: 'input.title', targetField: 'input.slug', transform: slug }]}
                    hiddenFields={['input.type', ...(parentPostTopicId ? (['input.parentId'] as const) : [])]}
                    defaultValues={{
                        'input.type': 'SupportArticle',
                        ...(parentPostTopicId ? { 'input.parentId': parentPostTopicId } : {}),
                    }}
                    submitButtonProperties={{ children: parentPostTopic ? 'Create Sub Topic' : 'Create Topic' }}
                />
            </Card>
        </div>
    );
}
