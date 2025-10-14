'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import { usePathname } from 'next/navigation';

// Dependencies - Main Components
// import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Assets
import CurrentLocationIcon from '@structure/assets/icons/navigation/CurrentLocationIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - LocaleControl
export interface LocaleControlProperties {
    className?: string;
}
export function LocaleControl(properties: LocaleControlProperties) {
    // Hooks
    // const urlPathname = usePathname();

    // Render the component
    return (
        // <div className={mergeClassNames(properties.className, 'flex cursor-pointer items-center')}>
        <div className={mergeClassNames(properties.className, 'flex items-center')}>
            <CurrentLocationIcon className="mr-2 h-4 w-4" />
            <span>English (United States)</span>
        </div>
    );
}
