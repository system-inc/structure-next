// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';

// Component - MenuSearch
export interface MenuSearchProperties {
    searchInputTextReference: React.RefObject<InputReferenceInterface | null>;
    onSearch: (value: string) => void;
}
export function MenuSearch({ searchInputTextReference, onSearch, ...inputTextProperties }: MenuSearchProperties) {
    // Functions
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        // Prevent any keys except for arrow and escape keys to bubble up to the menu
        if(event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Escape' && event.key !== 'Enter') {
            event.stopPropagation();
        }
    }

    function handleChange(value: string | undefined) {
        onSearch(value ?? '');
    }

    return (
        <InputText
            ref={searchInputTextReference}
            id="menuSearch"
            variant="menuSearch"
            placeholder="Search..."
            autoComplete="off"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            {...inputTextProperties}
        />
    );
}
