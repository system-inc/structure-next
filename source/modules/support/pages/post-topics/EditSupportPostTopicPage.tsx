'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import GraphQlOperationForm from '@structure/source/api/GraphQlOperationForm';

// Dependencies - API
import {
    PostTopicUpdateOperation,
    // PostTopicDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - EditSupportPostTopicPage
export interface EditSupportPostTopicPageInterface {
    postTopicId: string;
}
export function EditSupportPostTopicPage(properties: EditSupportPostTopicPageInterface) {
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
                    children: 'Edit Topic',
                }}
                // defaultValuesQuery={{
                //     document: PostTopicDocument,
                //     variables: {
                //         id: properties.postTopicId,
                //     },
                // }}
            />
        </div>
    );
}

// Export - Default
export default EditSupportPostTopicPage;
