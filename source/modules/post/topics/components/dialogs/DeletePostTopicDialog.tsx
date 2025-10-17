'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - API
import { usePostTopicDeleteRequest } from '@structure/source/modules/post/topics/hooks/usePostTopicDeleteRequest';

// Component - DeletePostTopicDialog
export interface DeletePostTopicDialogProperties extends DialogProperties {
    postTopicId: string;
}
export function DeletePostTopicDialog(properties: DeletePostTopicDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const postTopicDeleteRequest = usePostTopicDeleteRequest();

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

        try {
            // Delete the post
            await postTopicDeleteRequest.execute({
                id: properties.postTopicId,
            });
            console.log('Post topic deleted');
        }
        catch(error) {
            console.error('Error deleting post topic:', error);
        }
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
                    variant="Destructive"
                    isLoading={postTopicDeleteRequest.isLoading}
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
