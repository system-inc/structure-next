'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components

// Dependencies - Types
import { DocumentationSpecificationInterface } from '@structure/source/modules/documentation/types/DocumentationSpecificationInterface';

// Dependencies - Utilities
import { findDocumentationSpecificationCategoryByUrlPath } from '@structure/source/modules/documentation/utilities/DocumentationUtilities';

// Dependencies - Shared State
// import { useAtom } from 'jotai';
// import { apiKeyAtom } from '@structure/source/modules/documentation/forms/ApiKeyFormDialog';

// Component - DocumentationContent
export interface DocumentationContentInterface {
    specification: DocumentationSpecificationInterface;
}
export function DocumentationContent(properties: DocumentationContentInterface) {
    // Hooks
    const urlPath = useUrlPath();

    // Get the content from the current category based on the URL path
    const currentCategory = findDocumentationSpecificationCategoryByUrlPath(
        properties.specification.categories,
        urlPath,
    );
    // console.log('currentCategory', currentCategory);

    const content = currentCategory?.content || urlPath;

    // Render the component
    return <div className="px-8 pb-28 pt-6">{content}</div>;
}

// Export - Default
export default DocumentationContent;
