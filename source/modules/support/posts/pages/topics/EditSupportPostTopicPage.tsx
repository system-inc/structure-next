'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';
import { Button } from '@structure/source/components/buttons/Button';
import { DeletePostTopicDialog } from '@structure/source/modules/post/topics/components/dialogs/DeletePostTopicDialog';

// Dependencies - API
import { gql } from '@structure/source/services/network/NetworkService';
import { PostTopicUpdateOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - EditSupportPostTopicPage
export interface EditSupportPostTopicPageProperties {
    postTopicId: string;
}
export function EditSupportPostTopicPage(properties: EditSupportPostTopicPageProperties) {
    // State
    const [deletePostTopicDialogOpen, setDeletePostTopicDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className="container pt-12 pb-32">
            <h1 className="mb-8">Edit Topic</h1>

            <p>need to do this</p>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostTopicUpdateOperation}
                inputComponentsProperties={{
                    'input.id': {
                        defaultValue: properties.postTopicId,
                    },
                }}
                buttonProperties={{
                    children: 'Save Changes',
                }}
                defaultValuesQuery={{
                    document: gql(`
                        query PostTopicById($id: String!) {
                            postTopicById(id: $id) {
                                id
                                title
                                slug
                                description
                                postCount
                                createdAt
                            }
                        }
                    `),
                    variables: {
                        id: properties.postTopicId,
                    },
                }}
            />

            <hr className="my-16 border--a" />

            <div className="flex justify-end">
                <Button
                    variant="Destructive"
                    onClick={function () {
                        setDeletePostTopicDialogOpen(true);
                    }}
                >
                    Delete Post Topic
                </Button>
                <DeletePostTopicDialog
                    open={deletePostTopicDialogOpen}
                    onOpenChange={setDeletePostTopicDialogOpen}
                    postTopicId={properties.postTopicId}
                />
            </div>
        </div>
    );
}
