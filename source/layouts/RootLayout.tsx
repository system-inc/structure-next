// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - React and Next.js
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import Script from 'next/script';

// Dependencies - Theme
import '@structure/source/styles/global.css';
import '@structure/source/theme/styles/theme.css';
import { accountSignedInKey } from '@structure/source/modules/account/Account';
import { darkThemeClassName, themeClassNameCookieKey } from '@structure/source/theme/Theme';

// Dependencies - Main Components
import Providers from '@structure/source/layouts/providers/Providers';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: {
            template: '%s • ' + StructureSettings.title,
            default: StructureSettings.title + ' • ' + StructureSettings.tagline, // default is required when creating a template
        },
        description: StructureSettings.description,
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
}
export function RootLayout(properties: RootLayoutInterface) {
    // We need to get the theme class name from the response cookies in order to prevent a flash
    // of light mode when the page first loads. We can't use the theme mode from local storage because
    // we need to know the theme class name before the page completely loads.

    // Get the cookies from the response headers
    const cookieStore = cookies();
    // console.log('cookieStore', cookieStore);

    // Get the signed in cookie
    const accountSignedIn = cookieStore.get(accountSignedInKey)?.value == 'true' ? true : false;

    // Get the theme class name from the cookies
    const themeClassNameCookieValue = cookieStore.get(themeClassNameCookieKey)?.value;

    // The initial theme class name comes from the cookie or StructureSettings
    const themeClassName = themeClassNameCookieValue
        ? themeClassNameCookieValue
        : StructureSettings?.theme?.defaultClassName || undefined;

    // Defaults
    const googleAnalyticsId = StructureSettings.services?.google?.analytics?.id;

    // Render the component
    return (
        <html lang="en" className={themeClassName}>
            {/* Important: Do not use next/head here it will break dynamic favicons */}
            {/* eslint-disable-next-line -- We want to use traditional <head> here because this is shimmed into a layout.tsx */}
            <head>
                {/* Google Analytics - Include the tag if the ID is set and on production environment */}
                {googleAnalyticsId && process.env.NODE_ENV == 'production' && (
                    <>
                        <Script
                            async
                            src={'https://www.googletagmanager.com/gtag/js?id=' + googleAnalyticsId}
                            strategy="afterInteractive"
                            rel="preconnect"
                        />
                        <Script id={'google-analytics'} strategy="afterInteractive" rel="preconnect">
                            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag() {
                                dataLayer.push(arguments);
                            }
                            gtag('js', new Date());
                            gtag('config', '` +
                                googleAnalyticsId +
                                `');
                            `}
                        </Script>
                    </>
                )}

                {/* Favicon */}
                {/* The favicon is based on the system theme mode not the user selected theme */}
                {/* This is so it matches the browser tab colors */}
                <link
                    rel="icon"
                    // Here we assume that if the cookie is set to dark, the system theme is also dark
                    // When the page loads we will use JavaScript to check the system theme and update the favicon
                    href={
                        themeClassNameCookieValue === darkThemeClassName
                            ? StructureSettings.assets.favicon.dark.location
                            : StructureSettings.assets.favicon.light.location
                    }
                />
            </head>

            <body className="isolate h-full min-h-screen bg-light font-sans text-dark transition-colors dark:bg-dark dark:text-white">
                {/* Providers pass properties down to children */}
                {/* Pass the theme class name into providers so anything using the useTheme hook instantly knows the theme from the cookies via the response headers */}
                <Providers accountSignedIn={accountSignedIn} themeClassName={themeClassName}>
                    {/* Render children passed into the layout */}
                    {properties.children}
                    {/* The following interactions are enabled on all pages */}
                    {/* TODO: Get global modal working again */}
                    {/* <SignInSignUpModal /> */}
                </Providers>
            </body>
        </html>
    );
}

// Export - Default
export default RootLayout;
