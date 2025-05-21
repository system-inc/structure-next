'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Shared State
import { useAtom, useSetAtom } from 'jotai';
import {
    desktopMinimumWidth,
    getAtomForNavigationOpen,
    getAtomForNavigationManuallyClosed,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Assets
import MenuIcon from '@structure/assets/icons/navigation/MenuIcon.svg';

// Dependencies - Styles
// import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutNavigationSideToggle
export interface SideNavigationLayoutNavigationSideToggleProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    className?: string;
}
export function SideNavigationLayoutNavigationSideToggle(
    properties: SideNavigationLayoutNavigationSideToggleProperties,
) {
    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationManuallyClosed = useSetAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );

    // Render the component
    return (
        <div className={mergeClassNames('mr-4 flex flex-shrink-0 items-center space-x-2', properties.className)}>
            {/* Logo */}
            <Link href="/">
                <Image
                    src={ProjectSettings.assets.favicon.light.location}
                    alt="Logo"
                    height={28} // h-7 = 28px
                    width={28} // h-7 = 28px
                    priority={true}
                    className="dark:hidden"
                />
                <Image
                    src={ProjectSettings.assets.favicon.dark.location}
                    alt="Logo"
                    height={28}
                    width={28}
                    priority={true}
                    className="hidden dark:block"
                />
            </Link>

            {/* Menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="focus:border-0"
                icon={MenuIcon}
                onClick={async function () {
                    // Toggle the navigation open state
                    setSideNavigationLayoutNavigationOpen(!sideNavigationLayoutNavigationOpen);

                    // If on desktop
                    if(window.innerWidth >= desktopMinimumWidth) {
                        // Set the navigation manually closed state
                        setSideNavigationLayoutNavigationManuallyClosed(sideNavigationLayoutNavigationOpen);
                    }
                }}
            />
        </div>
    );
}
