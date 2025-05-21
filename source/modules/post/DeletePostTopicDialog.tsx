'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { PostTopicDeleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - DeletePostTopicDialog
export interface DeletePostTopicDialogProperties extends DialogProperties {
    postTopicId: string;
}
export function DeletePostTopicDialog(properties: DeletePostTopicDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const [postTopicDeleteMutation, postTopicDeleteMutationState] = useMutation(PostTopicDeleteDocument);

    // Effect to update the open state when the open property changes
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Function to delete the post
    async function deletePostTopic() {
        console.log('Deleting post topic', properties.postTopicId);

        // Delete the post
        await postTopicDeleteMutation({
            variables: {
                id: properties.postTopicId,
            },
            onCompleted: function () {
                console.log('Post topic deleted');
            },
        });
    }

    // Render the component
    return (
        <Dialog
            header={'Delete Post Topic'}
            content={
                <div>
                    <p>Are you sure you want to delete this post topic?</p>
                </div>
            }
            footer={
                <Button
                    variant="destructive"
                    loading={postTopicDeleteMutationState.loading}
                    onClick={function () {
                        deletePostTopic();
                    }}
                >
                    Delete
                </Button>
            }
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
