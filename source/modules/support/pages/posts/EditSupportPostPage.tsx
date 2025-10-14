'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Link } from '@structure/source/components/navigation/Link';
// import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
// import { PostReactions } from '@structure/source/modules/post/controls/PostReactions';
// import { PostControls } from '@structure/source/modules/post/controls/PostControls';
import { Button } from '@structure/source/components/buttons/Button';
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';
import { FormInputTextArea } from '@structure/source/components/forms/FormInputTextArea';
import { FormInputText } from '@structure/source/components/forms/FormInputText';
import { DeletePostDialog } from '@structure/source/modules/post/DeletePostDialog';

// Dependencies - API
import { gql } from '@structure/source/services/network/NetworkService';
import {
    PostUpdateOperation,
    PostDocument,
    // PostVoteType,
    // PostsQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

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

            <GraphQlOperationForm
                operation={PostUpdateOperation}
                inputComponentsProperties={{
                    id: {
                        className: 'hidden',
                    },
                    'input.title': {
                        component: FormInputText,
                    },
                    'input.type': {
                        className: 'hidden',
                        defaultValue: 'SupportArticle',
                    },
                    'input.description': {
                        component: FormInputTextArea,
                    },
                    'input.content': {
                        component: FormInputTextArea,
                        rows: 16,
                    },
                    'input.contentType': {
                        className: 'hidden',
                    },
                    'input.publishedAt': {
                        className: 'hidden',
                    },
                    'input.allowComment': {
                        className: 'hidden',
                        defaultValue: 'Unchecked',
                    },
                    'input.allowVote': {
                        className: 'hidden',
                        defaultValue: 'Unchecked',
                    },
                    'input.allowDownvote': {
                        className: 'hidden',
                        defaultValue: 'Unchecked',
                    },
                    'input.allowReaction': {
                        className: 'hidden',
                        defaultValue: 'Checked',
                    },
                }}
                defaultValuesQuery={{
                    document: PostDocument,
                    variables: {
                        identifier: properties.postIdentifier,
                    },
                }}
                buttonProperties={{
                    children: 'Save Changes',
                }}
            />
            <hr className="my-16 border-opsis-border-primary" />
            <div className="flex justify-end">
                <Button
                    variant="destructive"
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
