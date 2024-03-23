'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@structure/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import InternalNavigation from '@structure/source/internal/common/navigation/InternalNavigation';

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
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { titleCase } from '@structure/source/utilities/String';
import { useCookies } from 'react-cookie';
import { useSpring, animated, easings } from '@react-spring/web';

// Component - InternalLayout
export type InternalLayoutProperties = {
    children: React.ReactNode;
};
export function InternalLayout(properties: InternalLayoutProperties) {
    // Get a stateful set of cookies with the cookie name as a dependency
    const [cookies, setCookies, removeCookies] = useCookies(['internalNavigationSidebarClosed']);
    const [internalNavigationSidebarClosed, setInternalNavigationSidebarClosedState] = React.useState(
        cookies.internalNavigationSidebarClosed === 'true' ? true : false,
    );

    /**
      @function setInternalNavigationSidebarClosed
      @description Function to set the internal navigation sidebar closed cookie

      @param closed - Whether the internal navigation sidebar is closed
      @param withCookie - Whether to update the cookie to reflect the state
      @returns void
    */
    const setInternalNavigationSidebarClosed = React.useCallback(
        (closed: boolean, withCookie?: boolean) => {
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

    const [bodySpring, bodySpringControl] = useSpring(() => ({
        paddingLeft: internalNavigationSidebarClosed ? '0rem' : '18rem',
        config: {
            easing: easings.easeInOutQuart,
            duration: 300,
        },
    }));
    // Animate the body padding when the internal navigation sidebar is opened or closed
    React.useEffect(() => {
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
    }, [internalNavigationSidebarClosed, bodySpringControl]);

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

    // Use the pathname to dynamically create the title
    const pathname = usePathname();
    let title =
        pathname
            .split('/')
            .reverse()
            .filter(Boolean)
            .map((segment) => titleCase(segment))
            .join(' • ') +
        ' • ' +
        StructureSettings.title;

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
    // Error loading account
    else if(currentAccountState.error) {
        return <ApiError error={currentAccountState.error} />;
    }
    // Not signed in
    else if(!account) {
        return <NotSignedIn />;
    }
    // Not authorized
    else if(account && !account.isAdministator()) {
        return <NotAuthorized />;
    }

    // Render the component
    return (
        <>
            {/* Dynamically set the title this way for now, there should be a better way */}
            <title>{title}</title>

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
