'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath, useUrlParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
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

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutNavigationSide
export interface SideNavigationLayoutNavigationSideProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    layout?: 'Fixed' | 'Flex'; // Layout mode: 'Fixed' for standalone pages, 'Flex' for nested in flex containers (default: 'Fixed')
    children: React.ReactNode;
    className?: string;
    showHeader?: boolean;
    defaultNavigationWidth?: number; // Default width of the navigation sidebar in pixels (default: 288)
    minimumNavigationWidth?: number; // Minimum width of the navigation sidebar in pixels (default: 244)
    maximumNavigationWidth?: number; // Maximum width of the navigation sidebar in pixels (default: 488)
    alwaysShowNavigationOnDesktop?: boolean; // When true, prevents navigation from being collapsed or hidden on desktop (mobile behavior unchanged)
}
export function SideNavigationLayoutNavigationSide(properties: SideNavigationLayoutNavigationSideProperties) {
    // Defaults
    const layout = properties.layout ?? 'Fixed';
    const showHeader = properties.showHeader ?? false;

    // Width configuration with defaults from the imported constants
    const configuredDefaultNavigationWidth = properties.defaultNavigationWidth ?? defaultNavigationWidth;
    const configuredMinimumNavigationWidth = properties.minimumNavigationWidth ?? minimumNavigationWidth;
    const configuredMaximumNavigationWidth = properties.maximumNavigationWidth ?? maximumNavigationWidth;

    // Hooks
    const urlPath = useUrlPath();
    const urlParameters = useUrlParameters();

    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const [sideNavigationLayoutNavigationWidth, setSideNavigationLayoutNavigationWidth] = useAtom(
        getAtomForNavigationWidth(properties.layoutIdentifier, configuredDefaultNavigationWidth),
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
            // For Fixed layout: animate x position (leave 4px drag bar visible when closed)
            x:
                layout === 'Fixed'
                    ? sideNavigationLayoutNavigationOpen === true
                        ? 0
                        : -(sideNavigationLayoutNavigationWidth - 4) // When closed, show just the drag bar (4px)
                    : 0,
            // For Flex layout: animate marginLeft position (similar to Fixed's x)
            marginLeft:
                layout === 'Flex'
                    ? sideNavigationLayoutNavigationOpen === true
                        ? 0
                        : -(sideNavigationLayoutNavigationWidth - 4) // When closed, show just the drag bar (4px)
                    : 0,
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

            // Set the width equal to the starting width plus the movement x
            containerDivWidthReference.current = configuredDefaultNavigationWidth + dragState.offset[0];

            // Check if dragging far enough past minimum to trigger collapse
            // When width would go below 100px (well past minimum of 244px), collapse instead
            const wouldCollapseWidth = 100;
            const shouldCollapse = containerDivWidthReference.current < wouldCollapseWidth;
            const isDesktop = window.innerWidth >= desktopMinimumWidth;

            // If should collapse and not locked on desktop, close the navigation
            if(shouldCollapse && !(properties.alwaysShowNavigationOnDesktop && isDesktop)) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);

                // If on desktop
                if(isDesktop) {
                    // Mark the navigation as manually closed
                    setSideNavigationLayoutNavigationManuallyClosed(true);
                }
            }
            else {
                // Not collapsing - handle normal resize behavior

                // Bound the width to the minimum and maximum
                if(containerDivWidthReference.current > configuredMaximumNavigationWidth) {
                    containerDivWidthReference.current = configuredMaximumNavigationWidth;
                }
                else if(containerDivWidthReference.current < configuredMinimumNavigationWidth) {
                    containerDivWidthReference.current = configuredMinimumNavigationWidth;
                }

                // Snap +/- 10 pixels from configuredDefaultNavigationWidth
                if(
                    containerDivWidthReference.current >= configuredDefaultNavigationWidth - 10 &&
                    containerDivWidthReference.current <= configuredDefaultNavigationWidth + 10
                ) {
                    containerDivWidthReference.current = configuredDefaultNavigationWidth;
                }
                // If the navigation is closed, we're restoring from collapse
                const isRestoringFromCollapse = sideNavigationLayoutNavigationOpen === false;

                if(isRestoringFromCollapse) {
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
                    localStorageService.set<number>(
                        getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
                        roundedWidth,
                    );
                }
            }
        },
        {
            target: containerResizeHandleDivReference,
            // Bound the drag
            bounds: {
                // No left bound to allow dragging far left for collapse gesture
                right: configuredMaximumNavigationWidth - configuredDefaultNavigationWidth,
            },
            from: [sideNavigationLayoutNavigationWidth - configuredDefaultNavigationWidth, 0],
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
                containerDivWidthReference.current = configuredDefaultNavigationWidth;

                // Update the container width
                if(containerDivReference.current) {
                    containerDivReference.current.style.width = `${configuredDefaultNavigationWidth}px`;
                }

                // Update the shared state
                setSideNavigationLayoutNavigationWidth(configuredDefaultNavigationWidth);

                // Update the local storage
                localStorageService.set<number>(
                    getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
                    configuredDefaultNavigationWidth,
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
        [setSideNavigationLayoutNavigationWidth, properties.layoutIdentifier, configuredDefaultNavigationWidth],
    );

    // Effect to animate the navigation when opening, closing, or resizing
    React.useEffect(
        function () {
            containerSpringControl.start({
                // For Fixed layout: animate x position (leave 4px drag bar visible when closed)
                x:
                    layout === 'Fixed'
                        ? sideNavigationLayoutNavigationOpen === true
                            ? 0
                            : -(sideNavigationLayoutNavigationWidth - 4) // When closed, show just the drag bar (4px)
                        : 0,
                // For Flex layout: animate marginLeft position (similar to Fixed's x)
                marginLeft:
                    layout === 'Flex'
                        ? sideNavigationLayoutNavigationOpen === true
                            ? 0
                            : -(sideNavigationLayoutNavigationWidth - 4) // When closed, show just the drag bar (4px)
                        : 0,
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
                const isDesktop = window.innerWidth >= desktopMinimumWidth;

                // If the window resizes to mobile
                if(!isDesktop) {
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

                    // If always show on desktop, force open; otherwise use preferred state
                    if(properties.alwaysShowNavigationOnDesktop) {
                        setSideNavigationLayoutNavigationOpen(true);
                    }
                    else {
                        setSideNavigationLayoutNavigationOpen(!sideNavigationLayoutNavigationManuallyClosed);
                    }
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
            properties.alwaysShowNavigationOnDesktop,
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
            const localStorageWidth = localStorageService.get<number>(
                getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
            );
            // console.log('Initial width from local storage:', localStorageWidth);

            // If there is no width in session storage but there is in local storage
            if(!sessionStorageWidth && localStorageWidth) {
                // Set the width from local storage
                // This behavior means that users can adjust the width on one tab and it will not affect other active tabs
                // However, if the user closes the tab and opens a new one, the width will be the same as the last
                // manually adjusted width
                setSideNavigationLayoutNavigationWidth(localStorageWidth);
            }

            const isDesktop = window.innerWidth >= desktopMinimumWidth;

            // If on mobile
            if(!isDesktop) {
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
                // If always show on desktop, force open; otherwise use preferred state
                const shouldBeOpen = properties.alwaysShowNavigationOnDesktop || sideNavigationLayoutNavigationOpen;
                setSideNavigationLayoutNavigationOpen(shouldBeOpen);

                // Animate the navigation to be the preferred state
                containerSpringControl.start({
                    // Animate the container to be at the left edge if the navigation is open
                    x: shouldBeOpen === true ? 0 : -sideNavigationLayoutNavigationWidth,
                    // Animate the overlay to be at 1 opacity if the navigation is open
                    overlayOpacity: shouldBeOpen === true ? 1 : 0,
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
                    // Use fixed positioning for Fixed layout, relative for Flex layout
                    layout === 'Fixed' ? 'fixed z-20' : 'relative',
                    'flex h-full flex-col',
                    // For Flex layout, prevent flexbox from shrinking the navigation
                    layout === 'Flex' ? 'flex-shrink-0' : '',
                    // Hide overflow when closed for both layouts
                    !sideNavigationLayoutNavigationOpen ? 'overflow-hidden' : '',
                    // If there is no header or the window is less than the desktop minimum width and the side navigation is not closing by window resize
                    // add a border to the right (but hide it when collapsed for both layouts)
                    (!showHeader ||
                        (windowInnerWidth < desktopMinimumWidth &&
                            !sideNavigationLayoutNavigationIsClosingByWindowResize)) &&
                        sideNavigationLayoutNavigationOpen // Only show border when open
                        ? 'border-r border-r-light-4 dark:border-r-dark-4'
                        : '',
                    properties.className,
                )}
                style={{
                    // Both layouts: use static width (immediate updates during drag)
                    width: sideNavigationLayoutNavigationWidth + 'px',
                    // For Fixed layout: animate x position
                    // For Flex layout: animate marginLeft position
                    ...(layout === 'Fixed'
                        ? {
                              x: containerSpring.x,
                              overlayOpacity: containerSpring.overlayOpacity,
                          }
                        : {
                              marginLeft: containerSpring.marginLeft,
                              overlayOpacity: containerSpring.overlayOpacity,
                          }),
                }}
            >
                {/* Wrapper for content - no ScrollArea here, let children handle their own scrolling */}
                <div
                    className={mergeClassNames(
                        'h-full',
                        // If there is a header, add margin top for header height
                        showHeader ? 'mt-14' : '',
                        // If there is a header and the window is at least the desktop minimum width
                        // add a border to the right (but only when open)
                        showHeader && windowInnerWidth >= desktopMinimumWidth && sideNavigationLayoutNavigationOpen
                            ? 'border-r border-r-light-4 dark:border-r-dark-4'
                            : '',
                    )}
                >
                    {properties.children}
                </div>

                {/* Navigation Resize Handle */}
                <div
                    ref={containerResizeHandleDivReference}
                    className={mergeClassNames(
                        'absolute right-[-1px] h-full w-1 cursor-ew-resize touch-none select-none bg-transparent duration-500 hover:bg-blue active:bg-purple-500',
                        // If there is a header, offset the handle by the height of the header (h-14 = 56px)
                        showHeader && windowInnerWidth >= desktopMinimumWidth ? 'top-14' : '',
                        // Always allow pointer events for drag-to-open functionality
                        'pointer-events-auto',
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
