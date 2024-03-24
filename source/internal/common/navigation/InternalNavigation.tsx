'use client'; // This component uses client-only features

// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import InternalNavigationLinks from '@structure/source/internal/common/navigation/InternalNavigationLinks';
import {
    InternalNavigationLinkInterface,
    InternalNavigationLink,
} from '@structure/source/internal/common/navigation/InternalNavigationLink';
import { InternalNavigationLinkGroup } from '@structure/source/internal/common/navigation/InternalNavigationLinkGroup';
import AccountMenuButton from '@structure/source/modules/account/AccountMenuButton';
import InternalDialogMenu from '@structure/source/internal/common/navigation/InternalDialogMenu';
import Button from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import MenuIcon from '@structure/assets/icons/navigation/MenuIcon.svg';

// Dependencies - Styles
import { useTheme } from '@structure/source/theme/ThemeProvider';
import { useSpring, animated, easings } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - InternalNavigation
export interface InternalNavigationInterface {
    sidebarOpen: boolean;
    /**
      @function setInternalNavigationSidebarClosed
      @description Function to set the internal navigation sidebar closed cookie

      @param closed - Whether the internal navigation sidebar is closed
      @param withCookie - Whether to update the cookie to reflect the state
      @returns void
    */
    setSidebarClosed: (sideBarClosed: boolean, withCookie?: boolean) => void;
}
export function InternalNavigation(properties: InternalNavigationInterface) {
    // Use the theme hook
    const { theme } = useTheme();

    // Get the current pathname from the URL using the usePathname hook
    const urlPathname = usePathname();

    // State to track if the sidebar is open
    const [sidebarOpen, setSidebarClosed] = [properties.sidebarOpen, properties.setSidebarClosed];

    // Spring to animate the sidebar
    const [sidebarSpring, sidebarSpringCtrl] = useSpring(() => ({
        x: sidebarOpen
            ? // If the sidebar is open, animate it to be at 0rem
              '0rem'
            : // Otherwise, animate it to be at -18rem (offscreen to the left)
              '-18rem',
        overlayOpacity: sidebarOpen ? 1 : 0,
        config: {
            easing: easings.easeInOutQuart,
            duration: 300,
        },
    }));
    React.useEffect(
        function () {
            sidebarSpringCtrl.start({
                x: sidebarOpen ? '0rem' : '-18rem',
                overlayOpacity: sidebarOpen ? 1 : 0,
                config: {
                    easing: easings.easeInOutQuart,
                    duration: 300,
                },
            });
        },
        [sidebarOpen, sidebarSpringCtrl],
    );
    React.useEffect(
        function () {
            // On resize, make the animation immediate
            function handleResize() {
                sidebarSpringCtrl.start({
                    x: sidebarOpen ? '0rem' : '-18rem',
                    overlayOpacity: sidebarOpen ? 1 : 0,
                    config: {
                        easing: easings.easeInOutQuart,
                        duration: 300,
                    },
                    immediate: true,
                });
            }
            window.addEventListener('resize', handleResize);

            return function () {
                window.removeEventListener('resize', handleResize);
            };
        },
        [sidebarOpen, sidebarSpringCtrl],
    );

    // Close sidebar when the user presses the escape key (only on mobile sizing)
    React.useEffect(
        function () {
            function handleEscapeKey(event: KeyboardEvent) {
                if(event.key === 'Escape') {
                    if(window.innerWidth > 768) return;

                    setSidebarClosed(true);
                }
            }
            window.addEventListener('keydown', handleEscapeKey);

            return function () {
                window.removeEventListener('keydown', handleEscapeKey);
            };
        },
        [setSidebarClosed],
    );

    // Memoize the internal navigation links based on the current URL
    const memoizedInternalNavigationLinks = React.useMemo(() => {
        function setActiveFlag(
            internalNavigationLink: InternalNavigationLinkInterface,
        ): InternalNavigationLinkInterface {
            // Check if the link is active, and handle a special case for the root link
            if(internalNavigationLink.title === 'Home') {
                internalNavigationLink.active = urlPathname === '/internal';
            }
            // Links besides the root link
            else if(internalNavigationLink.title !== 'Home') {
                internalNavigationLink.active =
                    internalNavigationLink.href === urlPathname ||
                    urlPathname.includes(internalNavigationLink.href + '/');
            }

            // If the link is a group, recursively set the active flag on the links
            if(internalNavigationLink.links) {
                internalNavigationLink.links = internalNavigationLink.links.map(setActiveFlag);
            }

            return internalNavigationLink;
        }

        return InternalNavigationLinks.map(setActiveFlag);
    }, [urlPathname]);

    const navigationList = React.useMemo(
        function () {
            return (
                <ul role="list" className="-mx-2 space-y-0.5">
                    {memoizedInternalNavigationLinks.map(function (internalNavigationLink) {
                        // Check if the item is a group
                        if(internalNavigationLink.links) {
                            // Return a collapsible group
                            return (
                                <InternalNavigationLinkGroup
                                    key={internalNavigationLink.title}
                                    title={internalNavigationLink.title}
                                    href={internalNavigationLink.href}
                                    icon={internalNavigationLink.icon}
                                    links={internalNavigationLink.links}
                                    active={internalNavigationLink.active}
                                />
                            );
                        }
                        else {
                            return (
                                <li key={internalNavigationLink.title}>
                                    <InternalNavigationLink
                                        title={internalNavigationLink.title}
                                        href={internalNavigationLink.href}
                                        icon={internalNavigationLink.icon}
                                        active={internalNavigationLink.active}
                                    />
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        },
        [memoizedInternalNavigationLinks],
    );

    // Function to handle closing and opening the sidebar on mobile and desktop devices
    const handleCloseSidebar = React.useCallback(
        function (state: boolean) {
            // If on desktop, set the cookie to remember the state
            if(window.innerWidth > 768) {
                // Set the cookie to remember the state
                // console.log('Setting sidebar to be ', state ? 'closed' : 'open');
                setSidebarClosed(state, true);
            }
            // Otherwise, just set the state
            else {
                setSidebarClosed(state);
            }
        },
        [setSidebarClosed],
    );

    // Close the sidebar when the route changes when less than 768px
    React.useEffect(
        function () {
            if(window.innerWidth > 768) return;
            setSidebarClosed(true);
        },
        [urlPathname, setSidebarClosed],
    );

    // Render the component
    return (
        <>
            <InternalDialogMenu />

            {/* Top Navigation Bar */}
            <div className="fixed inset-x-0 top-0 z-10 flex h-16 shrink-0 items-center gap-x-2 border-b border-light-4 bg-light px-4 transition-colors dark:border-dark-4 dark:bg-dark dark:text-white lg:px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="focus:border-0"
                    icon={MenuIcon}
                    title="To"
                    onClick={async function () {
                        handleCloseSidebar(sidebarOpen);
                    }}
                />

                {/* Logo and Actions */}
                <div className="flex flex-1 self-stretch">
                    {/* Logo on the left */}
                    <div className="flex h-full flex-1 items-center">
                        <div className="flex h-7 w-full">
                            {/* TODO: let's not use the favicon? let's use an SVG */}
                            {/* The width should be flexible should not have to be a square */}
                            <Link href="/">
                                <Image
                                    src={
                                        theme == 'dark'
                                            ? StructureSettings.assets.favicon.dark.location
                                            : StructureSettings.assets.favicon.light.location
                                    }
                                    alt="Logo"
                                    height={28} // h-7 = 28px
                                    width={28} // h-7 = 28px
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Items on the right */}
                    <div className="flex items-center gap-x-3">
                        <AccountMenuButton />
                    </div>
                </div>
            </div>

            {/* Top Navigation Bar Padding Element */}
            <div className="h-16" />

            {/* Navigation Sidebar for Larger Screens */}
            <animated.div
                style={sidebarSpring}
                className={mergeClassNames('fixed inset-y-0 top-16 z-50 flex w-72 flex-col lg:z-40')}
            >
                {/* Sidebar Component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-r-light-4 bg-[#fafaf9] px-6 pb-4 pt-5 transition-colors dark:border-r-dark-4 dark:bg-dark">
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col">
                            <li>{navigationList}</li>
                        </ul>
                    </nav>
                </div>
            </animated.div>

            {/* Overlay for the Sidebar */}
            <animated.div
                style={{ opacity: sidebarSpring.overlayOpacity }}
                className={mergeClassNames(
                    'fixed inset-0 top-16 z-30 bg-black bg-opacity-50 md:hidden',
                    sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none',
                )}
                onClick={function () {
                    // Close the sidebar when the overlay is clicked
                    handleCloseSidebar(true);
                }}
            />
        </>
    );
}

// Export - Default
export default InternalNavigation;
