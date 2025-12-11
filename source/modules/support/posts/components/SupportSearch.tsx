// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { InputText } from '@structure/source/components/forms-new/fields/text/InputText';

// Dependencies - Assets
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SupportSearch
export interface SupportSearchProperties {
    className?: string;
    defaultValue?: string;
}
export function SupportSearch(properties: SupportSearchProperties) {
    // Hooks
    const router = useRouter();

    // Function to handle form submission
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const searchTerm = formData.get('searchTerm') as string;

        if(searchTerm && searchTerm.trim()) {
            // Redirect to the search page
            router.push(`/support/search?term=${encodeURIComponent(searchTerm.trim())}`);
        }
    }

    // Render the component
    return (
        <form className={mergeClassNames('w-full max-w-md', properties.className)} onSubmit={handleSubmit}>
            <InputText
                name="searchTerm"
                variant="Outline"
                size="Large"
                className="w-full rounded-full border--6"
                iconLeft={MagnifyingGlassIcon}
                isClearable={true}
                selectValueOnFocus={true}
                placeholder="Search for answers"
                defaultValue={properties.defaultValue}
            />
        </form>
    );
}
