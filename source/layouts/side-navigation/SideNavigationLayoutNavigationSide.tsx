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
import { useAtom, useSetAtom } from 'jotai';
import {
    getSideNavigationLayoutLocalStorageKey,
    getAtomForNavigationOpen,
    getAtomForNavigationWidth,
    getAtomForNavigationManuallyClosed,
    getAtomForNavigationIsResizing,
    getAtomForNavigationIsOpeningByDrag,
    getAtomForNavigationIsClosingByWindowResize,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutNavigationSide
export interface SideNavigationLayoutNavigationSideProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    children: React.ReactNode;
    className?: string;
    topBar?: boolean;
}
export function SideNavigationLayoutNavigationSide(properties: SideNavigationLayoutNavigationSideProperties) {
    // Defaults
    const topBar = properties.topBar ?? false;

    // Hooks
    const urlPath = useUrlPath();
    const urlParameters = useUrlParameters();

    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const [sideNavigationLayoutNavigationWidth, setSideNavigationLayoutNavigationWidth] = useAtom(
        getAtomForNavigationWidth(properties.layoutIdentifier),
    );
    const [sideNavigationLayoutNavigationManuallyClosed, setSideNavigationLayoutNavigationManuallyClosed] = useAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationIsResizing = useSetAtom(
        getAtomForNavigationIsResizing(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationIsOpeningByDrag = useSetAtom(
        getAtomForNavigationIsOpeningByDrag(properties.layoutIdentifier),
    );
    const [
        sideNavigationLayoutNavigationIsClosingByWindowResize,
        setSideNavigationLayoutNavigationIsClosingByWindowResize,
    ] = useAtom(getAtomForNavigationIsClosingByWindowResize(properties.layoutIdentifier));

    // State
    const [windowInnerWidth, setWindowInnerWidth] = React.useState<number>(0);

    // References
    const containerDivReference = React.useRef<HTMLDivElement>(null);
    const containerDivWidthReference = React.useRef<number>(sideNavigationLayoutNavigationWidth);
    const containerResizeHandleDivReference = React.useRef<HTMLDivElement>(null);

    // Spring to animate the container
    const [containerSpring, containerSpringControl] = useSpring(function () {
        return {
            x:
                sideNavigationLayoutNavigationOpen === true
                    ? // If the navigation is open, animate the container to be at the left edge
                      0
                    : // Otherwise, animate the container to be at negative width to hide it
                      -sideNavigationLayoutNavigationWidth,
            // If the navigation is open, animate the overlay to be at 1 opacity
            overlayOpacity: sideNavigationLayoutNavigationOpen === true ? 1 : 0,
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

            // If dragging far enough to the left, close the navigation
            if(dragState.offset[0] < -minimumNavigationWidth) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);

                // If on desktop
                if(window.innerWidth >= desktopMinimumWidth) {
                    // Mark the navigation as manually closed
                    setSideNavigationLayoutNavigationManuallyClosed(true);
                }
            }
            else {
                // If the navigation is closed
                if(sideNavigationLayoutNavigationOpen === false) {
                    // console.log('Opening navigation by drag');
                    setSideNavigationLayoutNavigationIsOpeningByDrag(true);
                }
                else {
                    // console.log('Not opening navigation by drag');
                    setSideNavigationLayoutNavigationIsOpeningByDrag(false);
                }

                // Open or keep the navigation open
                setSideNavigationLayoutNavigationOpen(true);

                // If on desktop
                if(window.innerWidth >= desktopMinimumWidth) {
                    // Mark the navigation as not manually closed
                    setSideNavigationLayoutNavigationManuallyClosed(false);
                }

                // Resize the container div
                if(containerDivReference.current) {
                    containerDivReference.current.style.width = `${containerDivWidthReference.current}px`;

                    // Update the shared state
                    // console.log('Updating shared state:', containerDivWidthReference.current);
                    const roundedWidth = Math.round(containerDivWidthReference.current);
                    setSideNavigationLayoutNavigationWidth(roundedWidth);

                    // Set the width in local storage
                    // This is used as the default initial width when a new tab is opened
                    // console.log(
                    //     'Setting width in local storage:',
                    //     getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
                    //     roundedWidth,
                    // );
                    localStorage.setItem(
                        getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
                        roundedWidth.toString(),
                    );
                }
            }
        },
        {
            target: containerResizeHandleDivReference,
            // Bound the drag
            bounds: {
                // left: minimumNavigationWidth - defaultNavigationWidth,
                right: maximumNavigationWidth - defaultNavigationWidth,
            },
            from: [sideNavigationLayoutNavigationWidth - defaultNavigationWidth, 0],
            filterTaps: true, // Prevent taps from triggering the drag
        },
    );

    // Layout effect to update the window inner width
    React.useLayoutEffect(function () {
        // Update the window inner width
        setWindowInnerWidth(window.innerWidth);
    }, []);

    // Effect to listen to double clicks on the resize handle
    React.useEffect(
        function () {
            // Function to handle the double click event
            function handleDoubleClick() {
                // Reset the width to the default width
                containerDivWidthReference.current = defaultNavigationWidth;

                // Update the container width
                if(containerDivReference.current) {
                    containerDivReference.current.style.width = `${defaultNavigationWidth}px`;
                }

                // Update the shared state
                setSideNavigationLayoutNavigationWidth(defaultNavigationWidth);

                // Update the local storage
                localStorage.setItem(
                    getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
                    defaultNavigationWidth.toString(),
                );
            }

            // Get the resize handle reference and add the event listener
            const resizeHandle = containerResizeHandleDivReference.current;
            if(resizeHandle) {
                resizeHandle.addEventListener('dblclick', handleDoubleClick);
            }

            // On unmount, remove the event listener
            return function () {
                if(resizeHandle) {
                    resizeHandle.removeEventListener('dblclick', handleDoubleClick);
                }
            };
        },
        [setSideNavigationLayoutNavigationWidth, properties.layoutIdentifier],
    );

    // Effect to animate the navigation when opening, closing, or resizing
    React.useEffect(
        function () {
            containerSpringControl.start({
                // If the navigation is open, animate the container to be at the left edge
                x: sideNavigationLayoutNavigationOpen === true ? 0 : -sideNavigationLayoutNavigationWidth,
                // If the navigation is open, animate the overlay to be at 1 opacity
                overlayOpacity: sideNavigationLayoutNavigationOpen === true ? 1 : 0,
                // Use the imported spring configuration for consistent animation
                config: sideNavigationLayoutNavigationSpringConfiguration,
                // On rest
                onRest: function () {
                    // console.log('Navigation animation finished');

                    // Mark the navigation as not closing by window resize
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(false);
                },
            });
        },
        // Just when the navigation open state or width changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sideNavigationLayoutNavigationOpen, sideNavigationLayoutNavigationWidth],
    );

    // Effect to handle window resizes
    React.useEffect(
        function () {
            // Function to handle the window resize
            function handleWindowResize() {
                // If the window resizes to mobile
                if(window.innerWidth < desktopMinimumWidth) {
                    // Mark the navigation as closing by window resize
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(true);
                    // console.log('Closing navigation by window resize');

                    // Close the navigation
                    setSideNavigationLayoutNavigationOpen(false);
                }
                // If the window resizes to desktop
                else {
                    // Mark the navigation as not closing by window resize
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(false);

                    // Set the navigation to the preferred state
                    setSideNavigationLayoutNavigationOpen(!sideNavigationLayoutNavigationManuallyClosed);
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
            setSideNavigationLayoutNavigationOpen,
            sideNavigationLayoutNavigationManuallyClosed,
            setSideNavigationLayoutNavigationIsClosingByWindowResize,
        ],
    );

    // Effect to handle the initial size on mount
    React.useEffect(
        function () {
            // Read the width from session storage
            const sessionStorageWidth = sessionStorage.getItem(
                getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
            );
            // console.log('Initial width from session storage:', sessionStorageWidth);

            // Read the width from local storage
            const localStorageWidth = localStorage.getItem(
                getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
            );
            // console.log('Initial width from local storage:', localStorageWidth);

            // If there is no width in session storage but there is in local storage
            if(!sessionStorageWidth && localStorageWidth) {
                // Set the width from local storage
                // This behavior means that users can adjust the width on one tab and it will not affect other active tabs
                // However, if the user closes the tab and opens a new one, the width will be the same as the last
                // manually adjusted width
                setSideNavigationLayoutNavigationWidth(parseInt(localStorageWidth));
            }

            // If on mobile
            if(window.innerWidth < desktopMinimumWidth) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);

                // Animate the navigation to be offscreen
                containerSpringControl.start({
                    // Animate the container to be offscreen
                    x: -sideNavigationLayoutNavigationWidth,
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
                setSideNavigationLayoutNavigationOpen(sideNavigationLayoutNavigationOpen);

                // Animate the navigation to be the preferred state
                containerSpringControl.start({
                    // Animate the container to be at the left edge if the navigation is open
                    x: sideNavigationLayoutNavigationOpen === true ? 0 : -sideNavigationLayoutNavigationWidth,
                    // Animate the overlay to be at 1 opacity if the navigation is open
                    overlayOpacity: sideNavigationLayoutNavigationOpen === true ? 1 : 0,
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
                    'fixed top-0 z-20 flex h-full flex-col bg-light dark:bg-dark-1',
                    // If there is no top bar or the window is less than the desktop minimum width and the side navigation is not closing by window resize
                    // add a border to the right
                    !topBar ||
                        (windowInnerWidth < desktopMinimumWidth &&
                            !sideNavigationLayoutNavigationIsClosingByWindowResize)
                        ? 'border-r border-r-light-4 dark:border-r-dark-4'
                        : '',
                    properties.className,
                )}
                style={{ width: sideNavigationLayoutNavigationWidth + 'px', ...containerSpring }}
            >
                <ScrollArea
                    containerClassName={mergeClassNames(
                        'mt-14 h-full',
                        // If there is a top bar and the window is at least the desktop minimum width
                        // add a border to the right
                        topBar && windowInnerWidth >= desktopMinimumWidth
                            ? 'border-r border-r-light-4 dark:border-r-dark-4'
                            : '',
                    )}
                >
                    {properties.children}
                </ScrollArea>

                {/* Navigation Resize Handle */}
                <div
                    ref={containerResizeHandleDivReference}
                    className={mergeClassNames(
                        'absolute right-[-1px] h-full w-1 cursor-ew-resize touch-none select-none bg-transparent duration-500 hover:bg-blue active:bg-purple-500',
                        // If the top bar is enabled, offset the handle by the height of the top bar
                        topBar && windowInnerWidth >= desktopMinimumWidth ? 'top-16' : '',
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
                    // If the navigation is closing by window resize, do not show the overlay
                    sideNavigationLayoutNavigationIsClosingByWindowResize ? 'hidden' : '',
                    // If the navigation is open, allow pointer events, otherwise disable them
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
