'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { usePostDeleteRequest } from '@structure/source/modules/post/hooks/usePostDeleteRequest';

// Component - DeletePostDialog
export interface DeletePostDialogProperties extends DialogProperties {
    postIdentifier: string;
}
export function DeletePostDialog(properties: DeletePostDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const postDeleteRequest = usePostDeleteRequest();

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
    async function deletePost() {
        console.log('Deleting post', properties.postIdentifier);

        try {
            // First, get the post by identifier
            const postRequest = await networkService.graphQlRequest(
                gql(`
                    query PostByIdentifier($identifier: String!) {
                        post(identifier: $identifier) {
                            id
                        }
                    }
                `),
                {
                    identifier: properties.postIdentifier,
                },
            );

            console.log('Post', postRequest);

            // Delete the post
            await postDeleteRequest.execute({
                id: postRequest.post.id,
            });

            console.log('Post deleted');
        }
        catch(error) {
            console.error('Error deleting post:', error);
        }
    }

    // Render the component
    return (
        <Dialog
            header={'Delete Post'}
            content={
                <div>
                    <p>Are you sure you want to delete this post?</p>
                </div>
            }
            footer={
                <Button
                    variant="destructive"
                    loading={postDeleteRequest.isLoading}
                    onClick={function () {
                        deletePost();
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
