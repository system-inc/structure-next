'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components

// Dependencies - Assets
import CurrentLocationIcon from '@structure/assets/icons/navigation/CurrentLocationIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - LocaleControl
export interface LocaleControlInterface {
    className?: string;
}
export function LocaleControl(properties: LocaleControlInterface) {
    // Hooks
    const urlPathname = usePathname();

    // Render the component
    return (
        <div className={mergeClassNames(properties.className, 'flex cursor-pointer items-center')}>
            <CurrentLocationIcon className="mr-2 h-4 w-4" />
            <span>English (United States)</span>
        </div>
    );
}

// Export - Default
export default LocaleControl;
