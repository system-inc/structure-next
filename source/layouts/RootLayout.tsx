// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

// Dependencies - Main Components
import Providers from '@structure/source/layouts/providers/Providers';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Dependencies - Theme
import '@project/source/theme/styles/global.css';
import '@structure/source/theme/styles/global.css';
import '@structure/source/theme/styles/theme.css';
import {
    themeKey,
    operatingSystemThemeKey,
    Theme,
    OperatingSystemTheme,
    ThemeClassName,
} from '@structure/source/theme/Theme';

// Next.js Metadata
export async function generateMetadata(): Promise<Metadata> {
    // Get the cookies from the response headers
    const cookieStore = cookies();

    // Read the operating system theme from the cookies
    const operatingSystemTheme = cookieStore.get(operatingSystemThemeKey)?.value;
    // console.log('generateMetadata: operatingSystemTheme', operatingSystemTheme);

    // Determine the favicon based on the operating system theme
    const favicon =
        operatingSystemTheme === OperatingSystemTheme.Dark
            ? ProjectSettings.assets.favicon.dark.location
            : ProjectSettings.assets.favicon.light.location;

    return {
        title: {
            template: '%s • ' + ProjectSettings.title,
            default: ProjectSettings.title + ' • ' + ProjectSettings.tagline, // default is required when creating a template
        },
        description: ProjectSettings.description,
        icons: {
            icon: favicon,
        },
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
export interface RootLayoutInterface extends React.HTMLProps<HTMLHtmlElement> {
    htmlClassName?: string;
    bodyClassName?: string;
    mainClassName?: string;
    providersComponent?: React.ComponentType<{
        accountSignedIn: boolean;
        children: React.ReactNode;
    }>;
    children: React.ReactNode;
}
export async function RootLayout(properties: RootLayoutInterface) {
    // Use the default Providers component if one is not provided
    const ProvidersComponent = properties.providersComponent || Providers;

    // Get the cookies from the response headers
    const cookieStore = cookies();
    // console.log('cookieStore', cookieStore);

    // Determine if the account is signed in based on if the sessionId HTTP-only cookie is set
    // We use this to prevent unnecessary client-side calls to the server to check if the account is signed in
    const accountSignedIn = cookieStore.get('sessionId')?.value ? true : false;
    // This will log to terminal, not the browser console, as it is server-side
    // console.log('RootLayout: accountSignedIn', accountSignedIn, 'sessionId:', cookieStore.get('sessionId')?.value);

    // Read the theme from the cookies, falling back to the project's default theme
    // console.log('cookieStore.get(themeKey)?.value', cookieStore.get(themeKey)?.value);
    const theme = cookieStore.get(themeKey)?.value ?? ProjectSettings.theme?.defaultTheme;
    // console.log('RootLayout: theme from cookies or default', theme);

    // Determine the theme class name
    let themeClassName = undefined;

    // If the theme is Light
    if(theme === Theme.Light) {
        themeClassName = ThemeClassName.Light;
        // console.log('RootLayout: theme is Light, themeClassName', themeClassName);
    }
    // If the theme is Dark
    else if(theme === Theme.Dark) {
        themeClassName = ThemeClassName.Dark;
        // console.log('RootLayout: theme is Dark, themeClassName', themeClassName);
    }
    // If the theme is OperatingSystem
    else if(theme === Theme.OperatingSystem) {
        // Get the operating system theme from the cookies
        const operatingSystemTheme = cookieStore.get(operatingSystemThemeKey)?.value;

        // If the operating system theme is Light
        if(operatingSystemTheme === OperatingSystemTheme.Light) {
            themeClassName = ThemeClassName.Light;
        }
        // If the operating system theme is Dark
        else if(operatingSystemTheme === OperatingSystemTheme.Dark) {
            themeClassName = ThemeClassName.Dark;
        }
        // console.log(
        //     'RootLayout: theme is OperatingSystem',
        //     'operatingSystemTheme',
        //     operatingSystemTheme,
        //     'themeClassName',
        //     themeClassName,
        // );
    }

    // Render the component
    return (
        <html lang="en" className={mergeClassNames(properties.htmlClassName, themeClassName)}>
            <body className={mergeClassNames('font-sans', properties.bodyClassName)}>
                {/* Add a <main> tag so that any Radix-UI Portal elements get appended outside the main content */}
                {/* Fixes any z-index issues with Popovers, etc. */}
                <main
                    className={mergeClassNames(
                        'relative isolate z-0 h-[100dvh] overflow-y-auto overflow-x-clip',
                        properties.mainClassName,
                    )}
                >
                    {/* Providers use React's Context API to make values accessible to all components within their subtree */}
                    <ProvidersComponent accountSignedIn={accountSignedIn}>{properties.children}</ProvidersComponent>
                </main>
            </body>
        </html>
    );
}

// Export - Default
export default RootLayout;
