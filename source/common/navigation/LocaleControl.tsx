'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components

// Dependencies - Assets
import CurrentLocationIcon from '@structure/assets/icons/navigation/CurrentLocationIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { useI18n } from '@project/locales/client';
import Popover from '../popovers/Popover';

// Component - LocaleControl
export interface LocaleControlInterface {
    className?: string;
}
export function LocaleControl(properties: LocaleControlInterface) {
    // Hooks
    const translation = useI18n();
    const pathname = usePathname();
    console.log(pathname);
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, '/');

    // Render the component
    return (
        <Popover
            side="top"
            align="end"
            content={
                <div className="flex flex-col p-2">
                    <Link
                        href={'/en' + pathnameWithoutLocale}
                        locale="en"
                        className="rounded-md px-2 py-1 text-dark hover:bg-light hover:text-dark"
                    >
                        English
                    </Link>
                    <Link
                        href={'/es' + pathnameWithoutLocale}
                        locale="es"
                        className="rounded-md px-2 py-1 text-dark hover:bg-light hover:text-dark"
                    >
                        Español
                    </Link>
                </div>
            }
        >
            <div className={mergeClassNames(properties.className, 'flex cursor-pointer select-none items-center')}>
                <CurrentLocationIcon className="mr-2 h-4 w-4" />
                <span>{translation('current_language')}</span>
            </div>
        </Popover>
    );
}

// Export - Default
export default LocaleControl;
