'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigation from '@structure/source/internal/layouts/navigation/InternalNavigation';

// Dependencies - Hooks
import { useCookies } from 'react-cookie';
import { useSpring, animated, easings } from '@react-spring/web';

// Dependencies - Authorization
import ApiError from '@structure/source/common/notifications/ApiError';
import NotConnected from '@structure/source/common/notifications/NotConnected';
import NotAuthorized from '@structure/source/common/notifications/NotAuthorized';
import NotSignedIn from '@structure/source/common/notifications/NotSignedIn';

// Dependencies - Animation
import LineLoadingAnimation from '@structure/source/common/animations/LineLoadingAnimation';

// Dependencies - Account
import { useAccountCurrent } from '@structure/source/modules/account/Account';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - InternalLayout
export interface InternalLayoutInterface {
    children: React.ReactNode;
}
export function InternalLayout(properties: InternalLayoutInterface) {
    // Get a stateful set of cookies with the cookie name as a dependency
    const [cookies, setCookies, removeCookies] = useCookies(['internalNavigationSidebarClosed']);
    const [internalNavigationSidebarClosed, setInternalNavigationSidebarClosedState] = React.useState(
        cookies.internalNavigationSidebarClosed === 'true' ? true : false,
    );

    // Function to set the internal navigation sidebar closed cookie
    const setInternalNavigationSidebarClosed = React.useCallback(
        function (closed: boolean, withCookie?: boolean) {
            setInternalNavigationSidebarClosedState(closed);

            if(withCookie) {
                if(closed) {
                    setCookies('internalNavigationSidebarClosed', 'true');
                }
                else {
                    removeCookies('internalNavigationSidebarClosed');
                }
            }
        },
        [setCookies, removeCookies],
    );

    // Spring to animate the body padding when the internal navigation sidebar is opened or closed
    const [bodySpring, bodySpringControl] = useSpring(function () {
        return {
            paddingLeft: internalNavigationSidebarClosed ? '0rem' : '18rem',
            config: {
                easing: easings.easeInOutQuart,
                duration: 300,
            },
        };
    });

    // Animate the body padding when the internal navigation sidebar is opened or closed
    React.useEffect(
        function () {
            // If the window is mobile sizing, don't animate the body padding (768px is the medium breakpoint in tailwindcss)
            if(window.innerWidth < 768) {
                return;
            }

            // Otherwise, animate the body padding based on the internal navigation sidebar state
            bodySpringControl.start({
                paddingLeft: internalNavigationSidebarClosed ? '0rem' : '18rem',
                config: {
                    easing: easings.easeInOutQuart,
                    duration: 300,
                },
            });
        },
        [internalNavigationSidebarClosed, bodySpringControl],
    );

    // Resize event listener for the internal navigation sidebar
    // If the window is resized to mobile sizing, close the internal navigation sidebar
    // If the window is resized to desktop sizing, open the internal navigation sidebar
    React.useEffect(
        function () {
            function handleResize() {
                const cookiePreference = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('internalNavigationSidebarClosed='))
                    ?.split('=')[1];

                if(window.innerWidth < 768) {
                    setInternalNavigationSidebarClosed(true);

                    // Animate the padding to 0rem
                    bodySpringControl.start({
                        paddingLeft: '0rem',
                        config: {
                            easing: easings.easeInOutQuart,
                            duration: 300,
                        },
                        immediate: true,
                    });
                }
                else {
                    setInternalNavigationSidebarClosed(
                        // Set the internal navigation sidebar closed state based on the cookie
                        cookiePreference === 'true' ? true : false,
                    );
                    // Animate the padding to 18rem
                    // Animate the padding to 0rem
                    bodySpringControl.start({
                        paddingLeft: cookiePreference === 'true' ? '0rem' : '18rem',
                        config: {
                            easing: easings.easeInOutQuart,
                            duration: 300,
                        },
                        immediate: true,
                    });
                }

                // console.log('Setting sidebar closed: ', cookiePreference === 'true' ? 'true' : 'false');
            }

            window.addEventListener('resize', handleResize);
            handleResize();

            return () => window.removeEventListener('resize', handleResize);
        },
        [setInternalNavigationSidebarClosed, bodySpringControl],
    );

    // throw new Error('hi!');
    // return <NotAuthorized />;
    // return <NotConnected />;
    // return <NotSignedIn />;
    // return <LineLoadingAnimation />;
    // return <ApiError />;

    // Use the current account hook
    const currentAccountState = useAccountCurrent();
    const account = currentAccountState.data;

    // Loading account or rendering on server
    if(currentAccountState.loading) {
        return <LineLoadingAnimation />;
    }
    // Not signed in
    else if(!account) {
        return <NotSignedIn />;
    }
    // Error loading account
    else if(currentAccountState.error) {
        return <ApiError error={currentAccountState.error} />;
    }
    // Not authorized
    else if(account && !account.isAdministator()) {
        return <NotAuthorized />;
    }

    // Render the component
    return (
        <>
            {/* Navigation */}
            <InternalNavigation
                sidebarOpen={!internalNavigationSidebarClosed}
                setSidebarClosed={setInternalNavigationSidebarClosed}
            />

            <animated.div style={bodySpring} className={mergeClassNames('w-screen overflow-x-hidden')}>
                <main className="relative w-full py-6">
                    {/* Page */}
                    <div id="internal-main" className="px-4 sm:px-6 lg:px-8">
                        {/* Show the line loading animation when the page is loading */}
                        <React.Suspense
                            fallback={
                                <div className="absolute inset-0 w-full">
                                    <LineLoadingAnimation />
                                </div>
                            }
                        >
                            {properties.children}
                        </React.Suspense>
                    </div>
                </main>
            </animated.div>
        </>
    );
}

// Export - Default
export default InternalLayout;
