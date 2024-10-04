'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputText } from '@structure/source/common/forms/InputText';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SupportSearch
export interface SupportSearchInterface {
    className?: string;
    defaultValue?: string;
}
export function SupportSearch(properties: SupportSearchInterface) {
    // Render the component
    return (
        <div className={mergeClassNames(properties.className)}>
            <InputText
                id="searchTerm"
                variant="search"
                className="w-full dark:bg-dark"
                placeholder="Search for articles..."
                defaultValue={properties.defaultValue}
                // On enter key
                onKeyDown={function (event) {
                    if(event.key === 'Enter') {
                        // Redirect to the search page
                        window.location.href = '/support/search?term=' + encodeURIComponent(event.currentTarget.value);
                    }
                }}
            />
        </div>
    );
}

// Export - Default
export default SupportSearch;
