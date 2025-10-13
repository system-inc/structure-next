'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { desktopMinimumWidth } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import {
    getAtomForNavigationOpen,
    getAtomForNavigationWidth,
    getAtomForNavigationIsResizing,
    getAtomForNavigationIsOpeningByDrag,
    getAtomForNavigationIsClosingByWindowResize,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { motion, useSpring } from 'motion/react';
import { LineLoadingAnimation } from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutContent
export interface SideNavigationLayoutContentProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    layout?: 'Fixed' | 'Flex'; // Layout mode: 'Fixed' for standalone pages, 'Flex' for nested in flex containers (default: 'Fixed')
    showHeader?: boolean;
    topTitle?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutContent(properties: SideNavigationLayoutContentProperties) {
    // Defaults
    const layout = properties.layout ?? 'Fixed';
    const showHeader = properties.showHeader ?? false;
    // References
    const firstMount = React.useRef(true);

    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(getAtomForNavigationOpen(properties.layoutIdentifier));
    const sideNavigationLayoutNavigationWidth = useAtomValue(getAtomForNavigationWidth(properties.layoutIdentifier));
    const sideNavigationLayoutNavigationIsResizing = useAtomValue(
        getAtomForNavigationIsResizing(properties.layoutIdentifier),
    );
    const sideNavigationLayoutNavigationIsOpeningByDrag = useAtomValue(
        getAtomForNavigationIsOpeningByDrag(properties.layoutIdentifier),
    );
    const sideNavigationLayoutNavigationIsClosingByWindowResize = useAtomValue(
        getAtomForNavigationIsClosingByWindowResize(properties.layoutIdentifier),
    );

    // Spring to animate the content div padding when the navigation is opened or closed
    const contentDivPaddingLeftSpring = useSpring(
        sideNavigationLayoutNavigationOpen === false ? 0 : sideNavigationLayoutNavigationWidth,
        {
            ...sideNavigationLayoutNavigationSpringConfiguration,
        },
    );

    // Effect to animate the content div padding when the navigation is opened, closed, or resized
    // Only applies to Fixed layout
    React.useEffect(
        function () {
            // Only animate padding for Fixed layout
            if(layout === 'Fixed') {
                if(
                    // Conditionally apply the animation immediately
                    // If on first mount
                    // Using first mount prevents the animation from running on the first render, which would animate
                    // content on the screen on the first load
                    firstMount.current ||
                    // Or if the navigation is open and is resizing and not opening by drag and not closing by window resize
                    (sideNavigationLayoutNavigationOpen &&
                        sideNavigationLayoutNavigationIsResizing &&
                        !sideNavigationLayoutNavigationIsOpeningByDrag &&
                        !sideNavigationLayoutNavigationIsClosingByWindowResize)
                ) {
                    // Animate the padding
                    contentDivPaddingLeftSpring.jump(
                        // Do not apply the padding
                        // On mobile
                        window.innerWidth < desktopMinimumWidth ||
                            // Or if the navigation is closed
                            sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidth,
                    );
                }
                else {
                    // Otherwise, animate the changes

                    // Animate the padding
                    contentDivPaddingLeftSpring.set(
                        // Do not apply the padding
                        // On mobile
                        window.innerWidth < desktopMinimumWidth ||
                            // Or if the navigation is closed
                            sideNavigationLayoutNavigationOpen === false
                            ? 0
                            : sideNavigationLayoutNavigationWidth,
                    );
                }
            }
            // Set first mount to false
            firstMount.current = false;
        },
        [
            layout,
            sideNavigationLayoutNavigationOpen,
            sideNavigationLayoutNavigationWidth,
            sideNavigationLayoutNavigationIsResizing,
            sideNavigationLayoutNavigationIsOpeningByDrag,
            sideNavigationLayoutNavigationIsClosingByWindowResize,
            contentDivPaddingLeftSpring,
        ],
    );

    // Render the component
    return (
        <motion.div
            style={{
                paddingLeft: layout === 'Fixed' ? contentDivPaddingLeftSpring : 0,
            }}
            className={mergeClassNames(
                'relative overscroll-none',
                // Use h-screen for Fixed layout, h-full for Flex layout
                layout === 'Fixed' ? 'h-screen w-screen' : 'h-full w-full',
                // For Fixed layout, use z-10 to stay below the header (z-30) but above other content
                layout === 'Fixed' ? 'z-10' : '',
                // For Flex layout, grow to fill remaining space and allow shrinking below content width
                layout === 'Flex' ? 'min-w-0 flex-1' : '',
                properties.className,
            )}
            suppressHydrationWarning
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
                {/* Only render content header if topTitle exists AND there's no fixed header */}
                {!showHeader && properties.topTitle && (
                    <div className="flex h-14 items-center justify-center px-4 md:justify-start">
                        {properties.topTitle}
                    </div>
                )}
                <div
                    className={mergeClassNames(
                        'flex h-full w-full flex-col overscroll-none',
                        // When showHeader={true}: Add top padding to prevent content from going under fixed header
                        showHeader ? 'pt-14' : '',
                    )}
                >
                    {properties.children}
                </div>
            </React.Suspense>
        </motion.div>
    );
}
