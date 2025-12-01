'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { PostCreatePrivilegedOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - IdeaSubmitPage
export function IdeaSubmitPage() {
    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            <h1 className="mb-8">Submit Idea</h1>

            <p>Use create issue page - https://github.com/system-inc/base/issues/new</p>
            <p>
                Could be a bug report, feature request, or question -
                https://github.com/reactchartjs/react-chartjs-2/issues/new/choose
            </p>

            <GraphQlMutationForm
                className="mt-6 flex flex-col gap-4"
                operation={PostCreatePrivilegedOperation}
                hiddenFields={{
                    'input.allowComment': true,
                    'input.allowVote': true,
                }}
                excludedFields={[
                    'input.description',
                    'input.allowDownvote',
                    'input.allowReaction',
                    'input.metadata',
                    'input.contentType',
                ]}
                fieldProperties={{
                    'input.content': { rows: 16 },
                }}
                submitButton={{ children: 'Submit Idea' }}
            />
        </div>
    );
}
