'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
import { Card } from '@structure/source/components/containers/Card';

// Dependencies - API
import { PostCreateOperation, PostStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { usePostTopicByIdRequest } from '@structure/source/modules/post/hooks/usePostTopicByIdRequest';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';
import { slug } from '@structure/source/utilities/type/String';

// Component - CreatePostPage
export interface CreatePostPageProperties {
    postType: string; // Post type (e.g., "Article", "SupportArticle")
}
export function CreatePostPage(properties: CreatePostPageProperties) {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const postTopicId = urlSearchParameters?.get('postTopicId');

    // Query for topic data if postTopicId is provided
    const postTopicByIdRequest = usePostTopicByIdRequest({ id: postTopicId ?? '' }, { enabled: !!postTopicId });
    const postTopic = postTopicByIdRequest.data?.postTopicById;

    // Render the component
    return (
        <div className="container items-center justify-center pt-8 pb-32">
            <h1 className="text-xl">Create Post</h1>

            {/* Show topic context */}
            {postTopic && (
                <p className="mt-2 text-sm content--4">
                    In <span className="font-medium content--2">{postTopic.title}</span>
                </p>
            )}

            <Card variant="A" className="mt-4">
                <GraphQlMutationForm
                    showPreviewGraphQlMutationTip={true}
                    className="flex flex-col gap-4"
                    operation={PostCreateOperation}
                    schema={schema.object({
                        'input.title': schema.string(),
                        'input.slug': schema.string(),
                        'input.content': schema.string(),
                    })}
                    fieldProperties={{
                        'input.title': {
                            order: 1,
                            tip: 'The title displayed to users when browsing support articles.',
                        },
                        'input.slug': {
                            order: 2,
                            tip: 'The URL-friendly identifier used in the article link.',
                        },
                        'input.description': {
                            order: 3,
                            rows: 4,
                            tip: 'A brief summary shown in search results and article previews.',
                        },
                        'input.content': {
                            order: 4,
                            rows: 16,
                            tip: 'The full article content. Supports Markdown formatting.',
                        },
                    }}
                    linkedFields={[{ sourceField: 'input.title', targetField: 'input.slug', transform: slug }]}
                    defaultValues={{
                        'input.status': PostStatus.Published,
                        'input.type': properties.postType,
                        'input.allowReaction': true,
                        ...(postTopicId ? { 'input.topicIds': [postTopicId] } : {}),
                    }}
                    hiddenFields={[
                        'input.status',
                        'input.type',
                        'input.allowReaction',
                        ...(postTopicId ? (['input.topicIds'] as const) : []),
                    ]}
                    excludedFields={[
                        'input.contentType',
                        'input.allowComment',
                        'input.allowVote',
                        'input.allowDownvote',
                        'input.metadata',
                    ]}
                    submitButtonProperties={{ children: 'Create Post' }}
                />
            </Card>
        </div>
    );
}
