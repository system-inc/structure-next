// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
// import Script from 'next/script';

// Dependencies - Theme
import '@project/source/styles/global.css';
// import { accountSignedInKey } from '@structure/source/modules/account/Account';
import { darkThemeClassName, themeClassNameCookieKey, ThemeMode } from '@structure/source/theme/Theme';
import { preventThemeFlashOnFirstLoad } from '../theme/preventThemeFlashOnFirstLoad';

// Dependencies - Main Components
import Providers from '@structure/source/layouts/providers/Providers';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Next.js Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: {
            template: '%s • ' + ProjectSettings.title,
            default: ProjectSettings.title + ' • ' + ProjectSettings.tagline, // default is required when creating a template
        },
        description: ProjectSettings.description,
    };
}

// Viewport
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // This makes it easier to enter form fields on mobile without the page zooming in
    userScalable: true,
};

// Component - RootLayout
export interface RootLayoutInterface {
    children: React.ReactNode;
    className?: string;
}
export async function RootLayout(properties: RootLayoutInterface) {
    // We need to get the theme class name from the response cookies in order to prevent a flash
    // of light mode when the page first loads. We can't use the theme mode from local storage because
    // we need to know the theme class name before the page completely loads.

    // Get the cookies from the response headers
    const cookieStore = cookies();
    // console.log('cookieStore', cookieStore);

    // Get the signed in cookie
    const accountSignedIn = cookieStore.get('sessionId')?.value ? true : false;
    // console.log('sessionId:', cookieStore.get('sessionId')?.value);

    // Get the user's selected color theme from the cookie
    const userColorThemeCookieValue = cookieStore.get(themeClassNameCookieKey)?.value as ThemeMode;

    // The initial theme class name comes from the cookie or StructureSettings
    // If the user has a cookie set, use that, otherwise use the default theme class name
    const userColorTheme = userColorThemeCookieValue
        ? userColorThemeCookieValue
        : ProjectSettings?.theme?.defaultClassName;

    // Defaults
    // const googleAnalyticsId = ProjectSettings.services?.google?.analytics?.id;

    // Render the component
    return (
        // Suppress hydration warning necessary for dynamic theme setting between the server and the client
        <html lang="en" className={mergeClassNames(userColorTheme, properties.className)} suppressHydrationWarning>
            {/* Important: Do not use next/head here it will break dynamic favicons */}
            {/* eslint-disable-next-line -- We want to use traditional <head> here because this is shimmed into a layout.tsx */}
            <head>
                {/* Favicon */}
                {/* The favicon is based on the system theme mode not the user selected theme */}
                {/* This is so it matches the browser tab colors */}
                <link
                    rel="icon"
                    // Here we assume that if the cookie is set to dark, the system theme is also dark
                    // When the page loads we will use JavaScript to check the system theme and update the favicon
                    href={
                        userColorThemeCookieValue === darkThemeClassName
                            ? ProjectSettings.assets.favicon.dark.location
                            : ProjectSettings.assets.favicon.light.location
                    }
                />

                {/* Preventing theme flashing on fist load (no cookie and system preference may not match) requires some tricky hacks */}
                {/* See: https://github.com/vercel/next.js/discussions/53063#discussioncomment-6996549 */}
                <script dangerouslySetInnerHTML={{ __html: preventThemeFlashOnFirstLoad }} />
            </head>

            <body className="h-full min-h-screen bg-light font-sans text-dark transition-colors dark:bg-dark-1 dark:text-white">
                {/* Add a <main> tag so that any Radix-UI Portal elements get appended outside the main content. Fixes any z-index issues with Popovers, etc. */}
                <main className="relative isolate z-0">
                    {/* Providers pass properties down to children */}
                    {/* Pass the theme class name into providers so anything using the useTheme hook instantly knows the theme from the cookies via the response headers */}
                    <Providers accountSignedIn={accountSignedIn}>
                        {/* Render children passed into the layout */}
                        {properties.children}
                    </Providers>
                </main>
            </body>
        </html>
    );
}

// Export - Default
export default RootLayout;
