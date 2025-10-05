// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';

// Component - MenuSearch
// This component is memoized to prevent re-rendering when highlight changes
export interface MenuSearchProperties {
    searchInputTextReference: React.RefObject<InputReferenceInterface>;
    onSearch: (value: string) => void;
}
export const MenuSearch = React.memo(function (properties: MenuSearchProperties) {
    const handleKeyDown = React.useCallback(function (event: React.KeyboardEvent<HTMLInputElement>) {
        // Prevent any keys except for arrow and escape keys to bubble up to the menu
        if(event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Escape' && event.key !== 'Enter') {
            event.stopPropagation();
        }
    }, []);

    const handleChange = React.useCallback(
        function (value: string | undefined) {
            properties.onSearch(value ?? '');
        },

        [properties.onSearch],
    );

    return (
        <InputText
            ref={properties.searchInputTextReference}
            id="menuSearch"
            variant="menuSearch"
            placeholder="Search..."
            autoComplete="off"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
        />
    );
});

// Set displayName for debugging purposes
MenuSearch.displayName = 'MenuSearch';
