'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { IdeasDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import SupportIcon from '@structure/assets/icons/communication/SupportIcon.svg';
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';

// Component - IdeaPage
export interface IdeaPageInterface {}
export function IdeaPage(properties: IdeaPageInterface) {
    // Hooks
    // const ideasQueryState = useQuery(IdeasDocument, {
    //     variables: {
    //         // pagination: {
    //         //     itemsPerPage: 10,
    //         // },
    //     },
    // });

    // Render the component
    return (
        <div className="container items-center justify-center pt-12">
            Idea Page use github issue page https://github.com/reactchartjs/react-chartjs-2/issues/1219
        </div>
    );
}

// Export - Default
export default IdeaPage;
