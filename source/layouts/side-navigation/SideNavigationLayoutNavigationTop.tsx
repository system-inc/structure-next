'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { SideNavigationLayoutNavigationSideToggle } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSideToggle';
import { AccountMenuButton } from '@structure/source/modules/account/components/AccountMenuButton';

// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import {
    desktopMinimumWidth,
    getAtomForNavigationOpen,
    getAtomForNavigationWidth,
    getAtomForNavigationIsResizing,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, motion } from 'motion/react';

// Component - SideNavigationLayoutNavigationTop
export interface SideNavigationLayoutNavigationTopProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    title?: React.ReactNode;
    className?: string;
    showHeader?: boolean;
    showHeaderBorder?: boolean;
}
export function SideNavigationLayoutNavigationTop(properties: SideNavigationLayoutNavigationTopProperties) {
    // Defaults
    const showHeader = properties.showHeader ?? false;
    const showHeaderBorder = properties.showHeaderBorder ?? true;

    // References
    const firstMount = React.useRef(true);
    const topBarBottomBorderDivReference = React.useRef<HTMLDivElement>(null);

    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(getAtomForNavigationOpen(properties.layoutIdentifier));
    const sideNavigationLayoutNavigationWidth = useAtomValue(getAtomForNavigationWidth(properties.layoutIdentifier));
    const sideNavigationLayoutNavigationIsResizing = useAtomValue(
        getAtomForNavigationIsResizing(properties.layoutIdentifier),
    );

    // Spring to animate the top bar bottom border div left margin
    const topBarBottomBorderDivMarginLeftSpring = useSpring(
        // On mobile we use left margin on the top bar bottom border div to show the navigation as a drawer without the line cutting through the drawer
        // If the side navigation is closed set the left margin to 0, otherwise set it to the navigation width
        sideNavigationLayoutNavigationOpen === false ? 0 : sideNavigationLayoutNavigationWidth,
        {
            ...sideNavigationLayoutNavigationSpringConfiguration,
        },
    );

    // Effect to animate the top bar bottom border left margin when the navigation is opened, closed, or resized
    React.useEffect(
        function () {
            // Only if the header border is enabled and the top bar bottom border div reference exists
            if(showHeaderBorder && topBarBottomBorderDivReference.current) {
                if(
                    // Apply the animation immediately if it is the first mount or the navigation is resizing
                    // Using first mount prevents the animation from running on the first render, which would animate
                    // content on the screen on the first load
                    // Conditionally apply the animation immediately
                    // If on first mount
                    // Using first mount prevents the animation from running on the first render, which would animate
                    // content on the screen on the first load
                    firstMount.current ||
                    // Or if the navigation is open and is resizing
                    (sideNavigationLayoutNavigationOpen && sideNavigationLayoutNavigationIsResizing)
                ) {
                    // Animate the left margin immediately
                    topBarBottomBorderDivMarginLeftSpring.jump(
                        // Do not apply margin
                        // If on desktop or the navigation is closed
                        window.innerWidth >= desktopMinimumWidth || sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidth,
                    );
                    // Set the first mount to false now we've immediately set the initial values
                    // Set the first mount to false
                    firstMount.current = false;
                }
                else {
                    // Otherwise, animate the values

                    // Animate the left margin
                    topBarBottomBorderDivMarginLeftSpring.set(
                        // Do not apply margin
                        // If on desktop or the navigation is closed
                        window.innerWidth >= desktopMinimumWidth || sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidth,
                    );
                }
            }
        },
        [
            showHeaderBorder,
            sideNavigationLayoutNavigationOpen,
            sideNavigationLayoutNavigationWidth,
            sideNavigationLayoutNavigationIsResizing,
            topBarBottomBorderDivMarginLeftSpring,
        ],
    );

    // Early return if no header wanted (after all hooks)
    if(!showHeader) {
        return null;
    }

    // Render the component
    return (
        <>
            {/* Top Bar Background */}
            <div className="pointer-events-none fixed z-30 h-14 w-full" />

            {/* Top Bar Bottom Border */}
            {showHeaderBorder && (
                <motion.div
                    ref={topBarBottomBorderDivReference}
                    style={{ marginLeft: topBarBottomBorderDivMarginLeftSpring }}
                    className="pointer-events-none fixed z-30 h-14 w-full border-b border--0"
                />
            )}

            {/* Top Left */}
            <div className="fixed left-4 z-30 flex h-14 items-center">
                <SideNavigationLayoutNavigationSideToggle layoutIdentifier={properties.layoutIdentifier} />
                {properties.title}
            </div>

            {/* Top Right */}
            <div className="fixed right-4 z-30 flex h-14 items-center">
                <AccountMenuButton />
            </div>
        </>
    );
}
