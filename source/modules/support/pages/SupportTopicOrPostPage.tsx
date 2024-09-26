'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { SupportTopicPage } from '@structure/source/modules/support/pages/SupportTopicPage';
import { SupportPostPage } from '@structure/source/modules/support/pages/SupportPostPage';

// Component - SupportTopicOrPostPage
export interface SupportTopicOrPostPageInterface {
    params: {
        supportPath: string[];
    };
}
export function SupportTopicOrPostPage(properties: SupportTopicOrPostPageInterface) {
    // The path is a post if it has more than 2 parts and the second to last part is 'articles'
    const isPost =
        properties.params.supportPath.length > 2 &&
        properties.params.supportPath[properties.params.supportPath.length - 2] === 'articles';

    // Post
    if(isPost) {
        // Render the component
        return <SupportPostPage {...properties} />;
    }
    // Topic
    else {
        // Render the component
        return <SupportTopicPage {...properties} />;
    }
}

// Export - Default
export default SupportTopicOrPostPage;
