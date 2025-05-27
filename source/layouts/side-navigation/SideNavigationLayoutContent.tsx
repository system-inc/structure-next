'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';
import { desktopMinimumWidth } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Shared State
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    getAtomForNavigationOpen,
    getAtomForNavigationManuallyClosed,
    getAtomForNavigationWidth,
    getAtomForNavigationIsResizing,
    getAtomForNavigationIsOpeningByDrag,
    getAtomForNavigationIsClosingByWindowResize,
    sideNavigationLayoutNavigationSpringConfiguration,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';
import { LineLoadingAnimation } from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Dependencies - Hooks
import { useInternalNavigationMetadata } from '@structure/source/internal/layouts/navigation/hooks/useInternalNavigationMetadata';

// Dependencies - Assets
import { Bell, SidebarSimple } from '@phosphor-icons/react';

// Component - SideNavigationLayoutContent
export interface SideNavigationLayoutContentInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutContent(properties: SideNavigationLayoutContentInterface) {
    // References
    const firstMount = React.useRef(true);

    const { title: pageTitle, icon: Icon } = useInternalNavigationMetadata();

    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationManuallyClosed = useSetAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );
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
    const [contentDivSpring, contentDivSpringControl] = useSpring(function () {
        return {
            // If the side navigation is closed set the left padding to 0, otherwise set it to the navigation width
            paddingLeft: sideNavigationLayoutNavigationOpen === false ? 0 : sideNavigationLayoutNavigationWidth,
        };
    });

    // Effect to animate the content div padding when the navigation is opened, closed, or resized
    React.useEffect(
        function () {
            // Animate the padding
            contentDivSpringControl.start({
                paddingLeft:
                    // Do not apply the padding
                    // On mobile
                    window.innerWidth < desktopMinimumWidth ||
                    // Or if the navigation is closed
                    sideNavigationLayoutNavigationOpen === false
                        ? 0
                        : sideNavigationLayoutNavigationWidth,
                // Use the imported spring configuration for consistent animation
                config: sideNavigationLayoutNavigationSpringConfiguration,
                immediate:
                    // Conditionally apply the animation immediately
                    // If on first mount
                    // Using first mount prevents the animation from running on the first render, which would animate
                    // content on the screen on the first load
                    firstMount.current ||
                    // Or if the navigation is open and is resizing and not opening by drag and not closing by window resize
                    (sideNavigationLayoutNavigationOpen &&
                        sideNavigationLayoutNavigationIsResizing &&
                        !sideNavigationLayoutNavigationIsOpeningByDrag &&
                        !sideNavigationLayoutNavigationIsClosingByWindowResize),
            });
            // Set first mount to false
            firstMount.current = false;
        },
        // Just when the navigation open state or width changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sideNavigationLayoutNavigationOpen, sideNavigationLayoutNavigationWidth],
    );

    const showSidebarToggleIcon = !sideNavigationLayoutNavigationOpen && window.innerWidth >= desktopMinimumWidth;

    // Render the component
    return (
        <animated.div
            style={contentDivSpring}
            className={mergeClassNames('relative h-screen w-screen overflow-y-hidden', properties.className)}
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
                {/* Top Bar */}
                <div className="flex items-center justify-between h-14 px-4 py-2 border-b border-opsis-border-primary">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        
                        {showSidebarToggleIcon && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="focus:border-0"
                                icon={SidebarSimple}
                                onClick={async function () {
                                    // Toggle the navigation open state
                                    setSideNavigationLayoutNavigationOpen(true);
                
                                    // If on desktop
                                    if(window.innerWidth >= desktopMinimumWidth) {
                                        // Set the navigation manually closed state
                                        setSideNavigationLayoutNavigationManuallyClosed(sideNavigationLayoutNavigationOpen);
                                    }
                                }}
                            />
                        )}

                        
                        {/* Top Bar Page Icon */}
                        {Icon && (
                            <Icon className="h-5 w-5 text-opsis-content-secondary" />
                        )}

                        {/* Top Bar Page Identifier */}
                        <h1 className="text-base font-medium text-opsis-content-primary">
                            {pageTitle}
                        </h1>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="focus:border-0"
                        icon={Bell}
                        onClick={async function () {
                            alert('Notifications clicked');
                        }}
                    />
                </div>
                
                {/* Page */}
                <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col">{properties.children}</div>
            </React.Suspense>
        </animated.div>
    );
}

// Export - Default
export default SideNavigationLayoutContent;
