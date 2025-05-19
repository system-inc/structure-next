'use client';

import * as React from 'react';
import { motion } from 'motion/react';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import MenuIcon from '@structure/assets/icons/navigation/MenuIcon.svg';

// Dependencies - Shared State
import { useAtom, useSetAtom } from 'jotai';
import {
    desktopMinimumWidth,
    getAtomForNavigationOpen,
    getAtomForNavigationManuallyClosed,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

const SIDENAV_WIDTH = 240;

// Component - SideNavigationLayoutNavigationSideToggle
export interface SideNavigationLayoutNavigationSideToggleInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    className?: string;
}
export default function InternalLayout(properties: SideNavigationLayoutNavigationSideToggleInterface) {
    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationManuallyClosed = useSetAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Side Nav */}
            <motion.aside
                initial={false}
                animate={{ width: sideNavigationLayoutNavigationOpen ? SIDENAV_WIDTH : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-gray-800 text-white overflow-hidden"
                style={{ willChange: 'width' }}
            >
                <div className="h-full p-4">
                    <h2 className="text-lg font-bold mb-4">Navigation</h2>
                    {/* Your navigation links here */}
                </div>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 relative">
                <div className="absolute top-4 left-4 z-10">
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
                <main className="h-full overflow-y-auto p-6">{properties.children}</main>
            </div>
        </div>
    );
}