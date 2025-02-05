// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import SearchInput from '@project/source/ui/derived/SearchInput';

// Component - SupportSearch
export interface SupportSearchInterface {
    className?: string;
    defaultValue?: string;
}
export function SupportSearch(properties: SupportSearchInterface) {
    const router = useRouter();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const searchTerm = event.currentTarget.searchTerm.value;
        console.log('redirecting to ', searchTerm);

        // Redirect to the search page using next navigation for better routing handling
        router.push(`/support/search?term=${encodeURIComponent(searchTerm)}`);
    }

    // Render the component
    return (
        <form className={mergeClassNames(properties.className, 'max-w-md')} onSubmit={handleSubmit}>
            <SearchInput id="searchTerm" placeholder="Search for answers" defaultValue={properties.defaultValue} />
        </form>
    );
}

// Export - Default
export default SupportSearch;
