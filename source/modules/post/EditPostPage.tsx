'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import { Link } from '@structure/source/common/navigation/Link';

// Dependencies - Main Components
// import { PostVoteControl } from '@structure/source/modules/post/controls/PostVoteControl';
// import { PostReactions } from '@structure/source/modules/post/controls/PostReactions';
// import { PostControls } from '@structure/source/modules/post/controls/PostControls';
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { gql } from '@structure/source/services/network/NetworkService';
import {
    PostUpdateOperation,
    PostDocument,
    // PostVoteType,
    // PostsQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

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

// Component - EditPostPage
export interface EditPostPageProperties {
    postIdentifier: string;
    className?: string;
}
export function EditPostPage(properties: EditPostPageProperties) {
    // State

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
            />
        </div>
    );
}
