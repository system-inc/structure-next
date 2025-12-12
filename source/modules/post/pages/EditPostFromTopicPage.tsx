'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Card } from '@structure/source/components/containers/Card';
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
import { DeletePostDialog } from '@structure/source/modules/post/components/dialogs/DeletePostDialog';

// Dependencies - API
import { PostUpdateOperation, PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';
import { slug } from '@structure/source/utilities/type/String';

// Dependencies - Assets
import { TrashIcon } from '@phosphor-icons/react/dist/ssr';

// Component - EditPostFromTopicPage
export interface EditPostFromTopicPageProperties {
    postIdentifier: string;
}
export function EditPostFromTopicPage(properties: EditPostFromTopicPageProperties) {
    // State
    const [deletePostDialogOpen, setDeletePostDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className="container items-center justify-center pt-8 pb-32">
            <div className="flex items-center justify-between">
                <h1 className="text-xl">Edit Post</h1>
                <Button
                    variant="DestructiveGhost"
                    size="Icon"
                    icon={TrashIcon}
                    onClick={function () {
                        setDeletePostDialogOpen(true);
                    }}
                />
                <DeletePostDialog
                    open={deletePostDialogOpen}
                    onOpenChange={setDeletePostDialogOpen}
                    postIdentifier={properties.postIdentifier}
                />
            </div>

            <Card variant="A" className="mt-4">
                <GraphQlMutationForm
                    showPreviewGraphQlMutationTip={true}
                    className="flex flex-col gap-4"
                    operation={PostUpdateOperation}
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
                            tip: 'The full article content. Supports Markdown formatting.',
                        },
                    }}
                    linkedFields={[{ sourceField: 'input.title', targetField: 'input.slug', transform: slug }]}
                    hiddenFields={[
                        'id',
                        'input.type',
                        'input.allowComment',
                        'input.allowVote',
                        'input.allowDownvote',
                        'input.allowReaction',
                    ]}
                    excludedFields={['input.contentType', 'input.publishedAt', 'input.metadata']}
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
