'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogInterface, Dialog } from '@structure/source/common/dialogs/Dialog';
import { Button } from '@structure/source/common/buttons/Button';
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';

// Dependencies - API
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { PostDeleteDocument, PostDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - DeletePostDialog
export interface DeletePostDialogInterface extends DialogInterface {
    postIdentifier: string;
}
export function DeletePostDialog(properties: DeletePostDialogInterface) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const [postDeleteMutation, postDeleteMutationState] = useMutation(PostDeleteDocument);
    const apolloClient = useApolloClient();

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

        // First, get the post by identifier
        const postQueryState = await apolloClient.query({
            query: PostDocument,
            variables: {
                identifier: properties.postIdentifier,
            },
        });

        console.log('Post', postQueryState);

        // Delete the post
        await postDeleteMutation({
            variables: {
                id: postQueryState.data.post.id,
            },
            onCompleted: function () {
                console.log('Post deleted');
                // document.title = `${inputTextReference.current?.getValue()} • Chat • Phi`;
            },
        });
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
                    loading={postDeleteMutationState.loading}
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

// Export - Default
export default DeletePostDialog;