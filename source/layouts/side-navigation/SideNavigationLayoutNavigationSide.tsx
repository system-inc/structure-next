'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath, useUrlParameters } from '@structure/source/router/Navigation';

// Dependencies - Hooks
import { useDrag } from '@use-gesture/react';
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';

// Dependencies - Main Components
import { Drawer } from '@structure/source/components/drawers/Drawer';
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
import { useSpring, motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
    const isMobile = useIsMobile();

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
    const [hasMounted, setHasMounted] = React.useState<boolean>(false);
    const [windowInnerWidth, setWindowInnerWidth] = React.useState<number>(0);

    // References
    const containerDivReference = React.useRef<HTMLDivElement>(null);
    const containerDivWidthReference = React.useRef<number>(sideNavigationLayoutNavigationWidth);
    const containerResizeHandleDivReference = React.useRef<HTMLDivElement>(null);
    const wasDesktopReference = React.useRef<boolean>(
        typeof window !== 'undefined' ? window.innerWidth >= desktopMinimumWidth : true,
    );
    const wasNavigationOpenReference = React.useRef<boolean>(sideNavigationLayoutNavigationOpen);

    // Spring to animate the container
    const containerOffsetSpring = useSpring(
        sideNavigationLayoutNavigationOpen === true ? 0 : -sideNavigationLayoutNavigationWidth, // When closed, fully hide the sidebar
        {
            ...sideNavigationLayoutNavigationSpringConfiguration,
        },
    );

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
            const targetPosition =
                sideNavigationLayoutNavigationOpen === true ? 0 : -sideNavigationLayoutNavigationWidth;

            containerOffsetSpring.set(targetPosition);

            // Mark the navigation as not closing by window resize
            setSideNavigationLayoutNavigationIsClosingByWindowResize(false);
        },
        [
            sideNavigationLayoutNavigationOpen,
            sideNavigationLayoutNavigationWidth,
            containerOffsetSpring,
            setSideNavigationLayoutNavigationIsClosingByWindowResize,
            isMobile,
        ],
    );

    // Effect to update tracking refs when navigation state changes
    React.useEffect(
        function () {
            wasNavigationOpenReference.current = sideNavigationLayoutNavigationOpen;
        },
        [sideNavigationLayoutNavigationOpen],
    );

    // Effect to handle window resizes
    React.useEffect(
        function () {
            // Function to handle the window resize
            function handleWindowResize() {
                const isDesktop = window.innerWidth >= desktopMinimumWidth;
                const wasDesktop = wasDesktopReference.current;
                const wasNavigationOpen = wasNavigationOpenReference.current;

                // Only process if desktop/mobile state actually changed
                if(wasDesktop === isDesktop) {
                    // No desktop/mobile transition, ignore this resize event
                    return;
                }

                // Detect transition from desktop to mobile
                const transitioningToMobile = wasDesktop && !isDesktop;

                // If transitioning to mobile and navigation was open, keep it open (will show as drawer)
                if(transitioningToMobile && wasNavigationOpen) {
                    // Keep navigation open - it will render as a drawer on mobile
                    // Don't mark as closing by window resize
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(false);
                }
                // If transitioning to mobile and navigation was closed
                else if(transitioningToMobile && !wasNavigationOpen) {
                    // Navigation is already closed, no action needed
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(true);
                }
                // If the window resizes to desktop
                else if(isDesktop && !wasDesktop) {
                    // Mark the navigation as not closing by window resize
                    setSideNavigationLayoutNavigationIsClosingByWindowResize(false);

                    // If always show on desktop, force open; otherwise respect user's choice
                    if(properties.alwaysShowNavigationOnDesktop) {
                        setSideNavigationLayoutNavigationOpen(true);
                    }
                    else {
                        // Only open if it wasn't manually closed AND it was open when we left desktop
                        // If user closed it on mobile, keep it closed when returning to desktop
                        const shouldOpen = !sideNavigationLayoutNavigationManuallyClosed && wasNavigationOpen;
                        setSideNavigationLayoutNavigationOpen(shouldOpen);
                    }
                }

                // Update tracking ref for desktop state (after all logic)
                wasDesktopReference.current = isDesktop;
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

    // Layout effect to handle the initial size on mount
    React.useLayoutEffect(
        function () {
            // Only run once on mount
            if(hasMounted) {
                return;
            }

            // Get the prefixed storage key
            const storageKey = localStorageService.getPrefixedKey(
                getSideNavigationLayoutLocalStorageKey(properties.layoutIdentifier) + 'Width',
            );

            // Read the width from session storage
            const sessionStorageWidth = sessionStorage.getItem(storageKey);
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
            const currentNavigationWidth = sideNavigationLayoutNavigationWidth;

            // If on mobile
            if(!isDesktop) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);

                // Animate the navigation to be offscreen
                containerOffsetSpring.jump(-currentNavigationWidth);
            }
            // If on desktop
            else {
                // If always show on desktop, force open; otherwise use preferred state
                const shouldBeOpen = properties.alwaysShowNavigationOnDesktop || sideNavigationLayoutNavigationOpen;
                setSideNavigationLayoutNavigationOpen(shouldBeOpen);

                // Animate the navigation to be the preferred state
                containerOffsetSpring.set(shouldBeOpen === true ? 0 : -currentNavigationWidth);
            }

            // Mark as initialized
            setHasMounted(true);
        },
        [
            hasMounted,
            properties.layoutIdentifier,
            properties.alwaysShowNavigationOnDesktop,
            setSideNavigationLayoutNavigationWidth,
            setSideNavigationLayoutNavigationOpen,
            sideNavigationLayoutNavigationWidth,
            sideNavigationLayoutNavigationOpen,
            containerOffsetSpring,
        ],
    );

    // Effect to close the navigation when the URL path or parameters change (mobile only)
    React.useEffect(
        function () {
            // Only close on URL changes when on mobile (not just because we're on mobile)
            // This effect runs when urlPath or urlParameters change, which indicates navigation
            if(isMobile) {
                // Close the navigation
                setSideNavigationLayoutNavigationOpen(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- isMobile is intentionally excluded to prevent closing on resize
        [setSideNavigationLayoutNavigationOpen, urlPath, urlParameters],
    );

    // Render the component
    return (
        <>
            {/* Mobile: Render as Drawer */}
            {isMobile && (
                <Drawer
                    accessibilityTitle="Navigation"
                    accessibilityDescription="Side navigation menu"
                    variant="A"
                    side="Left"
                    open={sideNavigationLayoutNavigationOpen}
                    onOpenChange={setSideNavigationLayoutNavigationOpen}
                >
                    {/* Wrapper for content - no ScrollArea here, let children handle their own scrolling */}
                    <div className="h-full">{properties.children}</div>
                </Drawer>
            )}

            {/* Desktop: Render as resizable sidebar */}
            {!isMobile && (
                <motion.div
                    ref={containerDivReference}
                    className={mergeClassNames(
                        // Use fixed positioning for Fixed layout, relative for Flex layout
                        layout === 'Fixed' ? 'fixed z-20' : 'relative',
                        'flex h-full flex-col background--0',
                        // For Flex layout, prevent flexbox from shrinking the navigation
                        layout === 'Flex' ? 'shrink-0' : '',
                        // Hide overflow when closed for both layouts
                        !sideNavigationLayoutNavigationOpen ? 'overflow-hidden' : '',
                        // If there is no header or the window is less than the desktop minimum width and the side navigation is not closing by window resize
                        // add a border to the right (but hide it when collapsed for both layouts)
                        (!showHeader ||
                            (windowInnerWidth < desktopMinimumWidth &&
                                !sideNavigationLayoutNavigationIsClosingByWindowResize)) &&
                            sideNavigationLayoutNavigationOpen // Only show border when open
                            ? 'border-r border--0'
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
                                  x: containerOffsetSpring,
                              }
                            : {
                                  marginLeft: containerOffsetSpring,
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
                                ? 'border-r border--0'
                                : '',
                        )}
                    >
                        {properties.children}
                    </div>

                    {/* Navigation Resize Handle */}
                    <div
                        ref={containerResizeHandleDivReference}
                        className={mergeClassNames(
                            'absolute -right-px h-full w-1 cursor-ew-resize touch-none bg-transparent duration-500 select-none hover:bg-blue-500 active:bg-purple-500',
                            // If there is a header, offset the handle by the height of the header (h-14 = 56px)
                            showHeader && windowInnerWidth >= desktopMinimumWidth ? 'top-14' : '',
                            // Always allow pointer events for drag-to-open functionality
                            'pointer-events-auto',
                        )}
                    ></div>
                </motion.div>
            )}
        </>
    );
}
