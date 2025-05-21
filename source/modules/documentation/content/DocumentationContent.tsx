'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { Markdown } from '@structure/source/common/markdown/Markdown';
import { RestEndpointNodeContent } from '@structure/source/modules/documentation/content/nodes/rest-endpoint/RestEndpointNodeContent';

// Dependencies - Types
import { DocumentationSpecificationProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Utilities
import { findDocumentationNodeByUrlPath } from '@structure/source/modules/documentation/utilities/DocumentationUtilities';

// Component - DocumentationContent
export interface DocumentationContentProperties {
    specification: DocumentationSpecificationProperties;
}
export function DocumentationContent(properties: DocumentationContentProperties) {
    // Hooks
    const urlPath = useUrlPath() ?? '';

    // Get the content from the current category based on the URL path
    const currentNode = findDocumentationNodeByUrlPath(
        properties.specification.nodes,
        properties.specification.baseUrlPath,
        urlPath,
    );
    // console.log('currentCategory', currentCategory);

    let content;
    if(currentNode) {
        switch(currentNode.type) {
            case 'MarkdownPage':
                content = <Markdown>{currentNode.content}</Markdown>;
                break;
            case 'RestEndpoint':
                content = <RestEndpointNodeContent node={currentNode} />;
                break;
            // Add cases for other node types as needed
            default:
                content = <p>Content not available.</p>;
        }
    }
    else {
        content = <p>Page not found.</p>;
    }

    // Render the component
    return <div className="px-8 pb-28 pt-6">{content}</div>;
}

// Export - Default
export default DocumentationContent;
