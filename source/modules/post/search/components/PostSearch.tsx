// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { InputText } from '@structure/source/components/forms-new/fields/text/InputText';

// Dependencies - Assets
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostSearch
export interface PostSearchProperties {
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    searchPath: string;
}
export function PostSearch(properties: PostSearchProperties) {
    // Hooks
    const router = useRouter();

    // Defaults
    const placeholder = properties.placeholder || 'Search for answers';

    // Function to handle form submission
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const searchTerm = formData.get('searchTerm') as string;

        if(searchTerm && searchTerm.trim()) {
            // Redirect to the search page
            router.push(`${properties.searchPath}?term=${encodeURIComponent(searchTerm.trim())}`);
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
                placeholder={placeholder}
                defaultValue={properties.defaultValue}
            />
        </form>
    );
}
