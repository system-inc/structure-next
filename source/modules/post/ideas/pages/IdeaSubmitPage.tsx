'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import GraphQlOperationForm from '@structure/source/api/GraphQlOperationForm';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { PostCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import SupportIcon from '@structure/assets/icons/communication/SupportIcon.svg';
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';

// Component - IdeaSubmitPage
export interface IdeaSubmitPageInterface {}
export function IdeaSubmitPage(properties: IdeaSubmitPageInterface) {
    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            <h1 className="mb-8">Submit Idea</h1>

            <p>Use create issue page - https://github.com/system-inc/base/issues/new</p>
            <p>
                Could be a bug report, feature request, or question -
                https://github.com/reactchartjs/react-chartjs-2/issues/new/choose
            </p>

            <GraphQlOperationForm
                className="mt-6"
                operation={PostCreateOperation}
                inputComponentsProperties={{
                    'input.description': {
                        className: 'hidden',
                    },
                    'input.content': {
                        component: FormInputTextArea,
                        rows: 16,
                    },
                    'input.topicId': {
                        className: 'hidden',
                    },
                    'input.allowComment': {
                        className: 'hidden',
                        defaultValue: 'Checked',
                    },
                    'input.allowVote': {
                        className: 'hidden',
                        defaultValue: 'Checked',
                    },
                    'input.allowDownvote': {
                        className: 'hidden',
                    },
                }}
                buttonProperties={{
                    children: 'Submit Idea',
                }}
            />
        </div>
    );
}

// Export - Default
export default IdeaSubmitPage;
