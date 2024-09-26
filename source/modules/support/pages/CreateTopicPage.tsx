'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import GraphQlOperationForm from '@structure/source/api/GraphQlOperationForm';

// Dependencies - API
import { PostTopicCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - CreateTopicPage
export function CreateTopicPage() {
    // Render the component
    return (
        <div className="container pb-32 pt-12">
            <h1 className="mb-8">Create Topic</h1>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostTopicCreateOperation}
                inputComponentsProperties={
                    {
                        // 'input.description': {
                        //     className: 'hidden',
                        // },
                    }
                }
                buttonProperties={{
                    children: 'Submit Idea',
                }}
            />
        </div>
    );
}

// Export - Default
export default CreateTopicPage;
