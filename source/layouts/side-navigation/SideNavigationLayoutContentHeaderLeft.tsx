'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { useAtom, useAtomValue } from 'jotai';
import {
    getAtomForNavigationOpen,
    getAtomForNavigationWidth,
    getAtomForNavigationIsResizing,
    sideNavigationLayoutNavigationSpringConfiguration,
    desktopMinimumWidth,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutContentHeaderLeft
export interface SideNavigationLayoutContentHeaderLeftInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    children: React.ReactNode;
    className?: string;

    leftPaddingWhenNavigationClosed?: number;
    leftPaddingWhenNavigationOpen?: number;
}
export function SideNavigationLayoutContentHeaderLeft(properties: SideNavigationLayoutContentHeaderLeftInterface) {
    // Defaults
    const leftPaddingWhenNavigationClosed = properties.leftPaddingWhenNavigationClosed ?? 104;
    const leftPaddingWhenNavigationOpen = properties.leftPaddingWhenNavigationOpen ?? 16;

    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(getAtomForNavigationOpen(properties.layoutIdentifier));

    // Function to get the padding left
    const getPaddingLeft = React.useCallback(
        function (isOpen: boolean) {
            return isOpen ? leftPaddingWhenNavigationOpen : leftPaddingWhenNavigationClosed;
        },
        [leftPaddingWhenNavigationClosed, leftPaddingWhenNavigationOpen],
    );

    // Spring to animate the padding when the side navigation is opened or closed
    const [containerDivSpring, containerDivSpringControl] = useSpring(function () {
        return {
            paddingLeft: getPaddingLeft(sideNavigationLayoutNavigationOpen),
            config: sideNavigationLayoutNavigationSpringConfiguration,
        };
    });

    // Animate the padding when the side navigation is opened or closed
    React.useEffect(
        function () {
            // Animate the padding
            containerDivSpringControl.start({
                paddingLeft: getPaddingLeft(sideNavigationLayoutNavigationOpen),
                config: sideNavigationLayoutNavigationSpringConfiguration,
                immediate: window.innerWidth < desktopMinimumWidth,
            });
        },
        [getPaddingLeft, sideNavigationLayoutNavigationOpen, containerDivSpringControl],
    );

    // Render the component
    return (
        // Wrapping the animated.div in another div to prevent the Next JS warning:
        // "Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element"
        <div className="">
            <animated.div
                style={containerDivSpring}
                className={mergeClassNames('fixed top-0 flex h-16 items-center pr-4', properties.className)}
            >
                {properties.children}
            </animated.div>
        </div>
    );
}

// Export - Default
export default SideNavigationLayoutContentHeaderLeft;
