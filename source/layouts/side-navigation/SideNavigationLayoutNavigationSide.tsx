'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname as useUrlPath, useParams as useUrlParameters } from 'next/navigation';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { useDrag } from '@use-gesture/react';
import {
    desktopMinimumWidth,
    defaultNavigationWidth,
    minimumNavigationWidth,
    maximumNavigationWidth,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Shared State
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    sideNavigationLayoutNavigationOpenPreferenceAtom,
    sideNavigationLayoutNavigationOpenAtom,
    sideNavigationLayoutNavigationWidthPreferenceAtom,
    setSideNavigationLayoutNavigationOpenAtom,
    sideNavigationLayoutNavigationIsResizingAtom,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutNavigationSide
export interface SideNavigationLayoutNavigationSideInterface {
    children: React.ReactNode;
    className?: string;

    topBar?: boolean;
}
export function SideNavigationLayoutNavigationSide(properties: SideNavigationLayoutNavigationSideInterface) {
    // Defaults
    const topBar = properties.topBar ?? false;

    // Hooks
    const urlPath = useUrlPath();
    const urlParameters = useUrlParameters();

    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(sideNavigationLayoutNavigationOpenAtom);
    const setSideNavigationLayoutNavigationOpen = useSetAtom(setSideNavigationLayoutNavigationOpenAtom);
    const sideNavigationLayoutNavigationOpenWithStorage = useAtomValue(
        sideNavigationLayoutNavigationOpenPreferenceAtom,
    );
    const [sideNavigationLayoutNavigationWidthPreference, setSideNavigationLayoutNavigationWidthPreference] = useAtom(
        sideNavigationLayoutNavigationWidthPreferenceAtom,
    );
    const setSideNavigationLayoutNavigationIsResizing = useSetAtom(sideNavigationLayoutNavigationIsResizingAtom);

    // References
    const containerDivReference = React.useRef<HTMLDivElement>(null);
    const containerDivWidthReference = React.useRef<number>(sideNavigationLayoutNavigationWidthPreference);
    const containerResizeHandleDivReference = React.useRef<HTMLDivElement>(null);

    // Spring to animate the container
    const [containerSpring, containerSpringControl] = useSpring(function () {
        return {
            x:
                sideNavigationLayoutNavigationOpenWithStorage === true
                    ? // If the navigation is open, animate the container to be at the left edge
                      0
                    : // Otherwise, animate the container to be at negative width to hide it
                      -containerDivWidthReference.current,
            // If the navigation is open, animate the overlay to be at 1 opacity
            overlayOpacity: sideNavigationLayoutNavigationOpenWithStorage === true ? 1 : 0,
            // Use the imported spring configuration for consistent animation
            config: sideNavigationLayoutNavigationSpringConfiguration,
        };
    });

    // Hook to handle the drag gesture on the container resize handle
    useDrag(
        function (dragState) {
            // Update the shared state to indicate if the navigation is resizing
            if(dragState.first) {
                setSideNavigationLayoutNavigationIsResizing(true);
            }
            else if(dragState.last) {
                setSideNavigationLayoutNavigationIsResizing(false);
            }

            // Set the width equal to the starting with plus the movement x
            containerDivWidthReference.current = defaultNavigationWidth + dragState.offset[0];

            // Bound the width to the minimum and maximum
            if(containerDivWidthReference.current > maximumNavigationWidth) {
                containerDivWidthReference.current = maximumNavigationWidth;
            }
            else if(containerDivWidthReference.current < minimumNavigationWidth) {
                containerDivWidthReference.current = minimumNavigationWidth;
            }

            // Snap +/- 10 pixels from defaultNavigationWidth
            if(
                containerDivWidthReference.current >= defaultNavigationWidth - 10 &&
                containerDivWidthReference.current <= defaultNavigationWidth + 10
            ) {
                containerDivWidthReference.current = defaultNavigationWidth;
            }

            // Resize the container div
            if(containerDivReference.current) {
                containerDivReference.current.style.width = `${containerDivWidthReference.current}px`;

                // Update the shared state
                // console.log('Updating shared state:', containerDivWidthReference.current);
                setSideNavigationLayoutNavigationWidthPreference(Math.round(containerDivWidthReference.current));
            }
        },
        {
            target: containerResizeHandleDivReference,
            // Bound the drag
            bounds: {
                left: minimumNavigationWidth - defaultNavigationWidth,
                right: maximumNavigationWidth - defaultNavigationWidth,
            },
            from: [sideNavigationLayoutNavigationWidthPreference - defaultNavigationWidth, 0],
            filterTaps: true, // Prevent taps from triggering the drag
        },
    );

    // Effect to animate the navigation when the state changes
    React.useEffect(
        function () {
            containerSpringControl.start({
                // If the navigation is open, animate the container to be at the left edge
                x: sideNavigationLayoutNavigationOpen === true ? 0 : -containerDivWidthReference.current,
                // If the navigation is open, animate the overlay to be at 1 opacity
                overlayOpacity: sideNavigationLayoutNavigationOpen === true ? 1 : 0,
                // Use the imported spring configuration for consistent animation
                config: sideNavigationLayoutNavigationSpringConfiguration,
            });
        },
        [sideNavigationLayoutNavigationOpen, containerSpringControl],
    );

    // Effect to animate the navigation on window resize
    React.useEffect(
        function () {
            // Function to handle the window resize
            function handleWindowResize() {
                // If on mobile
                if(window.innerWidth < desktopMinimumWidth) {
                    // Close the navigation
                    setSideNavigationLayoutNavigationOpen(false);

                    // Animate the navigation to be offscreen
                    containerSpringControl.start({
                        // Animate the container to be offscreen
                        x: -containerDivWidthReference.current,
                        // Animate the overlay to be at 0 opacity
                        overlayOpacity: 0,
                        // Use the imported spring configuration for consistent animation
                        config: sideNavigationLayoutNavigationSpringConfiguration,
                        // immediate: true,
                    });
                }
                // If on desktop
                else {
                    // Set the navigation to the preferred state
                    setSideNavigationLayoutNavigationOpen(sideNavigationLayoutNavigationOpenWithStorage);

                    // Animate the navigation to be the preferred state
                    containerSpringControl.start({
                        // Animate the container to be at the left edge if the navigation is open
                        x:
                            sideNavigationLayoutNavigationOpenWithStorage === true
                                ? 0
                                : -containerDivWidthReference.current,
                        // Animate the overlay to be at 1 opacity if the navigation is open
                        overlayOpacity: sideNavigationLayoutNavigationOpenWithStorage === true ? 1 : 0,
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
        [sideNavigationLayoutNavigationOpenWithStorage, containerSpringControl, setSideNavigationLayoutNavigationOpen],
    );

    // Effect to handle the initial size on mount
    React.useEffect(
        function () {
            // If on mobile
            if(window.innerWidth < desktopMinimumWidth) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);

                // Animate the navigation to be offscreen
                containerSpringControl.start({
                    // Animate the container to be offscreen
                    x: -containerDivWidthReference.current,
                    // Animate the overlay to be at 0 opacity
                    overlayOpacity: 0,
                    // Use the imported spring configuration for consistent animation
                    config: sideNavigationLayoutNavigationSpringConfiguration,
                    // Apply the animation immediately
                    immediate: true,
                });
            }
            // If on desktop
            else {
                // Set the navigation to the preferred state
                setSideNavigationLayoutNavigationOpen(sideNavigationLayoutNavigationOpenWithStorage);

                // Animate the navigation to be the preferred state
                containerSpringControl.start({
                    // Animate the container to be at the left edge if the navigation is open
                    x: sideNavigationLayoutNavigationOpenWithStorage === true ? 0 : -containerDivWidthReference.current,
                    // Animate the overlay to be at 1 opacity if the navigation is open
                    overlayOpacity: sideNavigationLayoutNavigationOpenWithStorage === true ? 1 : 0,
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

    // Effect to close navigation when the user presses the escape key on mobile
    React.useEffect(
        function () {
            // Function to handle keyboard events
            function handleKeyboardEvent(event: KeyboardEvent) {
                // If the escape key is pressed
                if(event.key === 'Escape') {
                    // If on mobile
                    if(window.innerWidth < desktopMinimumWidth) {
                        // Close the navigation
                        setSideNavigationLayoutNavigationOpen(false);
                    }
                }
            }

            // Add the keyboard event listener
            window.addEventListener('keydown', handleKeyboardEvent);

            // On unmount, remove the keyboard event listener
            return function () {
                window.removeEventListener('keydown', handleKeyboardEvent);
            };
        },
        [setSideNavigationLayoutNavigationOpen],
    );

    // Effect to close the navigation when the URL path or parameters change
    React.useEffect(
        function () {
            // If on mobile
            if(window.innerWidth < desktopMinimumWidth) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);
            }
        },
        [setSideNavigationLayoutNavigationOpen, urlPath, urlParameters],
    );

    // Render the component
    return (
        <>
            {/* Navigation Container */}
            <animated.div
                ref={containerDivReference}
                className={mergeClassNames(
                    'fixed top-0 z-20 flex h-full flex-col bg-light-1 dark:bg-dark',
                    topBar ? '' : 'border-r border-r-light-4 dark:border-r-dark-4',
                    properties.className,
                )}
                style={{ width: sideNavigationLayoutNavigationWidthPreference + 'px', ...containerSpring }}
            >
                <ScrollArea
                    containerClassName={mergeClassNames(
                        'mt-16 h-full',
                        topBar ? 'border-r border-r-light-4 dark:border-r-dark-4' : '',
                    )}
                    className="px-3"
                >
                    {properties.children}
                </ScrollArea>

                {/* Navigation Resize Handle */}
                <div
                    ref={containerResizeHandleDivReference}
                    className={mergeClassNames(
                        'absolute -right-1 h-full w-1 cursor-ew-resize touch-none select-none bg-transparent transition-colors hover:bg-blue active:bg-purple-500',
                        // If the top bar is enabled, offset the handle by the height of the top bar
                        topBar ? 'top-16' : '',
                        // If the navigation is open, show the handle, otherwise disable interacting with it
                        sideNavigationLayoutNavigationOpen ? 'pointer-events-auto' : 'pointer-events-none',
                    )}
                ></div>
            </animated.div>

            {/* Dimmed Overlay (mobile only) */}
            <animated.div
                style={{ opacity: containerSpring.overlayOpacity }}
                className={mergeClassNames(
                    'fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden',
                    sideNavigationLayoutNavigationOpen === true ? 'pointer-events-auto' : 'pointer-events-none',
                )}
                onClick={function () {
                    // Close the navigation when the overlay is clicked
                    setSideNavigationLayoutNavigationOpen(false);
                }}
            />
        </>
    );
}

// Export - Default
export default SideNavigationLayoutNavigationSide;
