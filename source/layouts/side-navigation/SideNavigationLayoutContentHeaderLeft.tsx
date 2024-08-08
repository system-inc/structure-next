'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import {
    sideNavigationLayoutNavigationOpenPreferenceAtom,
    sideNavigationLayoutNavigationOpenAtom,
    sideNavigationLayoutNavigationSpringConfiguration,
    desktopMinimumWidth,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLayoutContentHeaderLeft
export interface SideNavigationLayoutContentHeaderLeftInterface {
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutContentHeaderLeft(properties: SideNavigationLayoutContentHeaderLeftInterface) {
    // Shared State
    const sideNavigationLayoutNavigationOpenPreference = useAtomValue(sideNavigationLayoutNavigationOpenPreferenceAtom);
    const sideNavigationLayoutNavigationOpen = useAtomValue(sideNavigationLayoutNavigationOpenAtom);

    // Function to get the padding left
    const leftPadding = 74;
    const getPaddingLeft = (isOpen: boolean) => (isOpen ? 0 : leftPadding);

    // Spring to animate the padding when the side navigation is opened or closed
    const [containerDivSpring, containerDivSpringControl] = useSpring(function () {
        return {
            paddingLeft: getPaddingLeft(sideNavigationLayoutNavigationOpenPreference),
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
        [sideNavigationLayoutNavigationOpen, containerDivSpringControl],
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
