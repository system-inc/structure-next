'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { desktopMinimumWidth } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import {
    sideNavigationLayoutNavigationOpenPreferenceAtom,
    sideNavigationLayoutNavigationOpenAtom,
    sideNavigationLayoutNavigationWidthPreferenceAtom,
    sideNavigationLayoutNavigationIsResizingAtom,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';
import { LineLoadingAnimation } from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutContent
export interface SideNavigationLayoutContentInterface {
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutContent(properties: SideNavigationLayoutContentInterface) {
    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(sideNavigationLayoutNavigationOpenAtom);
    const sideNavigationLayoutNavigationOpenWithStorage = useAtomValue(
        sideNavigationLayoutNavigationOpenPreferenceAtom,
    );
    const sideNavigationLayoutNavigationWidthPreference = useAtomValue(
        sideNavigationLayoutNavigationWidthPreferenceAtom,
    );
    const sideNavigationLayoutNavigationIsResizing = useAtomValue(sideNavigationLayoutNavigationIsResizingAtom);

    // Spring to animate the content div padding when the navigation is opened or closed
    const [contentDivSpring, contentDivSpringControl] = useSpring(function () {
        return {
            paddingLeft:
                sideNavigationLayoutNavigationOpenWithStorage === false
                    ? 0
                    : sideNavigationLayoutNavigationWidthPreference,
            config: sideNavigationLayoutNavigationSpringConfiguration,
        };
    });

    // Effect to animate the content div padding when the navigation is opened or closed (desktop only)
    React.useEffect(
        function () {
            // If on desktop
            if(window.innerWidth >= desktopMinimumWidth) {
                // Animate the padding
                contentDivSpringControl.start({
                    paddingLeft:
                        sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidthPreference,
                    // Use the imported spring configuration for consistent animation
                    config: sideNavigationLayoutNavigationSpringConfiguration,
                    // Apply the animation immediately
                    immediate: sideNavigationLayoutNavigationIsResizing,
                });
            }
        },
        [
            sideNavigationLayoutNavigationOpen,
            contentDivSpringControl,
            sideNavigationLayoutNavigationWidthPreference,
            sideNavigationLayoutNavigationIsResizing,
        ],
    );

    // Effect to listen to window resizes
    React.useEffect(
        function () {
            // Handle the resize event
            function handleWindowResize() {
                // If on mobile
                if(window.innerWidth < desktopMinimumWidth) {
                    // Animate the padding to 0rem
                    contentDivSpringControl.start({
                        paddingLeft: 0,
                        // Use the imported spring configuration for consistent animation
                        config: sideNavigationLayoutNavigationSpringConfiguration,
                        // immediate: true,
                    });
                }
                // If the window is resized to desktop sizing, open the navigation
                else {
                    // Animate the padding
                    contentDivSpringControl.start({
                        paddingLeft:
                            sideNavigationLayoutNavigationOpenWithStorage === false
                                ? 0
                                : sideNavigationLayoutNavigationWidthPreference,
                        // Use the imported spring configuration for consistent animation
                        config: sideNavigationLayoutNavigationSpringConfiguration,
                        // immediate: true,
                    });
                }
            }

            // Add the event listener
            window.addEventListener('resize', handleWindowResize);

            // On unmount, remove the event listener
            return function () {
                window.removeEventListener('resize', handleWindowResize);
            };
        },
        [
            contentDivSpringControl,
            sideNavigationLayoutNavigationOpenWithStorage,
            sideNavigationLayoutNavigationWidthPreference,
        ],
    );

    // Effect to handle the initial size on mount
    React.useEffect(
        function () {
            // If on mobile
            if(window.innerWidth < desktopMinimumWidth) {
                // Animate the padding to 0rem
                contentDivSpringControl.start({
                    paddingLeft: 0,
                    // Use the imported spring configuration for consistent animation
                    config: sideNavigationLayoutNavigationSpringConfiguration,
                    // Apply the animation immediately
                    immediate: true,
                });
            }
            // If on desktop
            else {
                // Animate the padding
                contentDivSpringControl.start({
                    paddingLeft:
                        sideNavigationLayoutNavigationOpenWithStorage === false
                            ? 0
                            : sideNavigationLayoutNavigationWidthPreference,
                    // Use the imported spring configuration for consistent animation
                    config: sideNavigationLayoutNavigationSpringConfiguration,
                    // Apply the animation immediately
                    immediate: true,
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // Render the component
    return (
        <animated.div
            style={contentDivSpring}
            className={mergeClassNames('relative h-screen w-screen', properties.className)}
        >
            {/* Show the line loading animation when the page is loading */}
            <React.Suspense
                fallback={
                    <div className="absolute inset-0 h-full w-full">
                        <LineLoadingAnimation />
                    </div>
                }
            >
                {/* Page */}
                <div className="flex h-full w-full flex-col">{properties.children}</div>
            </React.Suspense>
        </animated.div>
    );
}

// Export - Default
export default SideNavigationLayoutContent;
