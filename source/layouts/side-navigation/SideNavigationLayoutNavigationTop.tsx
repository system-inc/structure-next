'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { SideNavigationLayoutNavigationSideToggle } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSideToggle';
import AccountMenuButton from '@structure/source/modules/account/components/AccountMenuButton';

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
import { useSpring, animated } from '@react-spring/web';

// Component - SideNavigationLayoutNavigationTop
export interface SideNavigationLayoutNavigationTopInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    title?: React.ReactNode;
    className?: string;
    topBar?: boolean;
}
export function SideNavigationLayoutNavigationTop(properties: SideNavigationLayoutNavigationTopInterface) {
    // Defaults
    const topBar = properties.topBar ?? false;

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
    const [topBarBottomBorderDivSpring, topBarBottomBorderDivSpringControl] = useSpring(function () {
        return {
            // On mobile we use left margin on the top bar bottom border div to show the navigation as a drawer without the line cutting through the drawer
            marginLeft:
                // If the side navigation is closed set the left margin to 0, otherwise set it to the navigation width
                sideNavigationLayoutNavigationOpen === false ? 0 : sideNavigationLayoutNavigationWidth,
        };
    });

    // Effect to animate the top bar bottom border left margin when the navigation is opened, closed, or resized
    React.useEffect(
        function () {
            // Only if the top bar is enabled and the top bar bottom border div reference exists
            if(topBar && topBarBottomBorderDivReference.current) {
                // Animate the left margin
                topBarBottomBorderDivSpringControl.start({
                    marginLeft:
                        // Do not apply margin
                        // If on desktop or the navigation is closed
                        window.innerWidth >= desktopMinimumWidth || sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidth,
                    // Use the imported spring configuration for consistent animation
                    config: sideNavigationLayoutNavigationSpringConfiguration,
                    // Apply the animation immediately if it is the first mount or the navigation is resizing
                    // Using first mount prevents the animation from running on the first render, which would animate
                    // content on the screen on the first load
                    immediate:
                        // Conditionally apply the animation immediately
                        // If on first mount
                        // Using first mount prevents the animation from running on the first render, which would animate
                        // content on the screen on the first load
                        firstMount.current ||
                        // Or if the navigation is open and is resizing
                        (sideNavigationLayoutNavigationOpen && sideNavigationLayoutNavigationIsResizing),
                    onRest: function () {
                        // Set the first mount to false
                        firstMount.current = false;
                    },
                });
            }
        },
        // Just when the navigation open state or width changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sideNavigationLayoutNavigationOpen, sideNavigationLayoutNavigationWidth],
    );

    // Render the component
    return (
        <>
            {/* Top Bar Bottom Border */}
            {topBar && (
                <animated.div
                    ref={topBarBottomBorderDivReference}
                    style={topBarBottomBorderDivSpring}
                    className="pointer-events-none z-30 h-14 w-full border-b border-b-light-4 dark:border-b-dark-4"
                    // className="pointer-events-none fixed z-30 h-14 w-full border-b border-b-light-4 dark:border-b-dark-4"
                />
            )}

            {/* Top Left */}
            <div className="left-4 z-30 flex h-14 items-center">
                <SideNavigationLayoutNavigationSideToggle layoutIdentifier={properties.layoutIdentifier} />
                {properties.title}
            </div>

            {/* Top Right */}
            {/* <div className="fixed right-4 z-30 flex h-14 items-center">
                <AccountMenuButton />
            </div> */}
        </>
    );
}

// Export - Default
export default SideNavigationLayoutNavigationTop;
