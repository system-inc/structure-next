'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';
import { DeletePostDialog } from '@structure/source/modules/post/components/dialogs/DeletePostDialog';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';

// Dependencies - API
import { PostUpdateOperation, PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - EditSupportPostPage
export interface EditSupportPostPageProperties {
    postIdentifier: string;
    className?: string;
}
export function EditSupportPostPage(properties: EditSupportPostPageProperties) {
    // State
    const [deletePostDialogOpen, setDeletePostDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className={mergeClassNames('container items-center justify-center pt-8 pb-32', properties.className)}>
            <h1 className="mb-6 text-3xl font-medium">Edit Post</h1>

            <GraphQlMutationForm
                className="flex flex-col gap-4"
                operation={PostUpdateOperation}
                hiddenFields={{
                    'input.type': 'SupportArticle',
                    'input.allowComment': false,
                    'input.allowVote': false,
                    'input.allowDownvote': false,
                    'input.allowReaction': true,
                }}
                excludedFields={['id', 'input.contentType', 'input.publishedAt', 'input.metadata']}
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

            <HorizontalRule className="my-16" />

            <div className="flex justify-end">
                <Button
                    variant="Destructive"
                    onClick={function () {
                        setDeletePostDialogOpen(true);
                    }}
                >
                    Delete Post
                </Button>
                <DeletePostDialog
                    open={deletePostDialogOpen}
                    onOpenChange={setDeletePostDialogOpen}
                    postIdentifier={properties.postIdentifier}
                />
            </div>
        </div>
    );
}
