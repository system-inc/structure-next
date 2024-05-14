// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - React and Next.js
import { Metadata, ResolvingMetadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import Script from 'next/script';

// Dependencies - Theme
import '@structure/source/styles/global.css';
import '@structure/source/theme/styles/theme.css';
import { themeClassNameCookieKey, darkThemeClassName } from '@structure/source/theme/Theme';

// Dependencies - Main Components
import Providers from '@structure/source/layouts/providers/Providers';
import { mergeClassNames } from '../utilities/Styles';
// import { SignInSignUpModal } from '@structure/source/modules/account/SignInSignUpModal';

// Metadata
export async function generateMetadata(properties: any, parent: ResolvingMetadata): Promise<Metadata> {
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
    // maximumScale: 1,
    userScalable: true,
};

// Component - RootLayout
export interface RootLayoutInterface {
    children: React.ReactNode;
}
export function RootLayout(properties: RootLayoutInterface) {
    // We need to get the theme class name from the client's cookies in order to prevent a flash
    // of light mode when the page first loads. We can't use the theme mode from local storage because
    // we need to know the theme class name before the page completely loads.
    const cookieStore = cookies();
    // console.log('cookieStore', cookieStore);
    const themeClassNameCookie = cookieStore.get(themeClassNameCookieKey)?.value;

    const googleAnalyticsId = StructureSettings.services?.google?.analytics?.id;

    // Render the component
    return (
        <html
            lang="en"
            className={mergeClassNames(
                themeClassNameCookie === darkThemeClassName ? darkThemeClassName : '',
                'font-sans',
            )}
        >
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
                <link
                    rel="icon"
                    href={
                        themeClassNameCookie === darkThemeClassName
                            ? StructureSettings.assets.favicon.dark.location
                            : StructureSettings.assets.favicon.light.location
                    }
                />
            </head>

            <body className="min-h-screen bg-light text-dark transition-colors dark:bg-dark dark:text-white">
                {/* Providers pass properties down to children */}
                <Providers>
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
