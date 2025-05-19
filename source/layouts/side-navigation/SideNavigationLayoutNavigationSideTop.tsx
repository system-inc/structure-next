'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';

// Dependencies - Shared State
import { useAtom, useSetAtom } from 'jotai';
import {
    desktopMinimumWidth,
    getAtomForNavigationOpen,
    getAtomForNavigationManuallyClosed,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Assets
import { SidebarSimple } from '@phosphor-icons/react';

// Component - SideNavigationLayoutNavigationSideToggle
export interface SideNavigationLayoutNavigationTopInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    className?: string;
}
export function SideNavigationLayoutNavigationTop(
    properties: SideNavigationLayoutNavigationTopInterface,
)  {
    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationManuallyClosed = useSetAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );

    return (
        <div className="flex items-center justify-between flex-shrink-0 h-14 px-4 py-2 bg-opsis-background-secondary border-b border-opsis-border-primary">
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
                icon={SidebarSimple}
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
    )
}

// Export - Default
export default SideNavigationLayoutNavigationTop;