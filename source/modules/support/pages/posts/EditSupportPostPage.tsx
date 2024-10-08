'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import Link from 'next/link';

// Dependencies - Main Components
// import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
// import { PostReactions } from '@structure/source/modules/post/controls/PostReactions';
// import { PostControls } from '@structure/source/modules/post/controls/PostControls';
import { Button } from '@structure/source/common/buttons/Button';
import { GraphQlOperationForm } from '@structure/source/api/GraphQlOperationForm';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { DeletePostDialog } from '@structure/source/modules/post/DeletePostDialog';

// Dependencies - API
import {
    PostUpdateOperation,
    PostDocument,
    // PostVoteType,
    // PostsQuery,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - EditSupportPostPage
export interface EditSupportPostPageInterface {
    postIdentifier: string;
    className?: string;
}
export function EditSupportPostPage(properties: EditSupportPostPageInterface) {
    // State
    const [deletePostDialogOpen, setDeletePostDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className={mergeClassNames('container items-center justify-center pb-32 pt-8', properties.className)}>
            THIS HAS A MAJOR BUG AND YOU NEED TO EDIT EACH FIELD IN ORDER TO HAVE THE FORM VALUES UPDATE Edit Post Page{' '}
            {properties.postIdentifier}
            <GraphQlOperationForm
                operation={PostUpdateOperation}
                inputComponentsProperties={{
                    id: {
                        // className: 'hidden',
                    },
                    'input.title': {
                        component: FormInputText,
                    },
                    'input.type': {
                        // defaultValue: 'Principle',
                        // className: 'hidden',
                    },
                    'input.description': {
                        component: FormInputTextArea,
                    },
                    'input.content': {
                        component: FormInputTextArea,
                        rows: 16,
                    },
                    'input.topicId': {
                        // className: 'hidden',
                    },
                    'input.allowComment': {
                        // className: 'hidden',
                        // defaultValue: 'Checked',
                    },
                    'input.allowVote': {
                        // className: 'hidden',
                        // defaultValue: 'Checked',
                    },
                    'input.allowDownvote': {
                        // className: 'hidden',
                        // defaultValue: 'Unchecked',
                    },
                    'input.allowReaction': {
                        // className: 'hidden',
                        // defaultValue: 'Checked',
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
            <hr className="my-16" />
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

// Export - Default
export default EditSupportPostPage;
