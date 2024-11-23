'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import GraphQlOperationForm from '@structure/source/api/graphql/GraphQlOperationForm';
import { Button } from '@structure/source/common/buttons/Button';
import { DeletePostTopicDialog } from '@structure/source/modules/post/DeletePostTopicDialog';

// Dependencies - API
import { PostTopicUpdateOperation, PostTopicByIdDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - EditSupportPostTopicPage
export interface EditSupportPostTopicPageInterface {
    postTopicId: string;
}
export function EditSupportPostTopicPage(properties: EditSupportPostTopicPageInterface) {
    // State
    const [deletePostTopicDialogOpen, setDeletePostTopicDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className="container pb-32 pt-12">
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
                    document: PostTopicByIdDocument,
                    variables: {
                        id: properties.postTopicId,
                    },
                }}
            />

            <hr className="my-16" />

            <div className="flex justify-end">
                <Button
                    variant="destructive"
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

// Export - Default
export default EditSupportPostTopicPage;
